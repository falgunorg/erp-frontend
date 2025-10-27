import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";
import { mailMinimize } from "../../minimize/mailMinimize";
import InboxHeader from "./InboxHeader";
import MailingSingle from "./MailingSingle";
import MailContextMenu from "./MailContextMenu";
import { debounce } from "lodash";

import { ArrowDownIcon, ArrowRightIcon } from "../SvgIcons";
export default function MailList(props) {
  const { instance, accounts } = useMsal();

  const [filterAble, setFilterAble] = useState(false);
  const inboxRef = useRef(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");
  const [nextLink, setNextLink] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [fetchedCount, setFetchedCount] = useState(0);
  //toMe cc to filters on diffrent way
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [toMeActive, setToMeActive] = useState(false);
  const [toEmailsActive, setToEmailsActive] = useState(false);
  const [ccEmailsActive, setCcEmailsActive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  //mail chain
  const [expandedChains, setExpandedChains] = useState({});

  //make sure deltaEmails are not be inserted when sortQyery of filterQuery is running
  const [appliedFilterQuery, setAppliedFilterQuery] = useState("");
  const [appliedSortQuery, setAppliedSortQuery] = useState("");

  //NEW ERA
  // Memoize access token to avoid acquiring it unnecessarily
  const [fToken, setFToken] = useState(null);

  const getAccessToken = useCallback(async () => {
    if (accounts.length > 0) {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      setFToken(response.accessToken);
      return response.accessToken;
    }
  }, [instance, accounts]);
  mailMinimize.setAccessTokenAndEmails(getAccessToken, props.setEmails);
  const abortControllerRef = useRef(null);

  const debouncedGetEmails = useCallback(
    debounce(async (skipCount = 0) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      if (accounts.length > 0 && props.mailFolder?.folderId) {
        try {
          const accessToken = await getAccessToken();
          let baseURL = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/mailFolders/${props.mailFolder.folderId}/messages?$top=10&$skip=${skipCount}`;
          const {
            fromEmails,
            toEmails,
            ccEmails,
            subject,
            keywords,
            dateFrom,
            dateTo,
            isRead,
            attachments,
          } = props.mailSearchData;

          // Initialize filter and sort queries
          let filters = [];
          let sortQuery = "";

          // Apply sorting
          if (sortOrder) {
            const sortFields = {
              date: "receivedDateTime",
              from: "from/emailAddress/name",
              subject: "subject",
            };
            sortQuery = sortFields[sortOrder]
              ? `&$orderby=${sortFields[sortOrder]} asc`
              : "";
          }

          // Apply filter conditions
          if (isRead !== undefined) filters.push(`isRead eq ${isRead}`);
          if (filter === "unread") filters.push(`isRead eq false`);
          if (filter === "toMe")
            filters.push(
              `toRecipients/any(r:r/emailAddress/address) eq '${accounts[0].username.toLowerCase()}'`
            );

          if (filter === "flagged")
            filters.push(`flag/flagStatus eq 'flagged'`);
          if (filter === "important") filters.push(`importance eq 'high'`);
          if (filter === "event")
            filters.push(`categories/any(c:c eq 'event')`);

          if (filter === "mentionsMe")
            filters.push(
              `contains(body/content, '${accounts[0].username.toLowerCase()}')`
            );

          if (fromEmails?.length)
            filters.push(
              `(${fromEmails
                .map((email) => `from/emailAddress/address eq '${email}'`)
                .join(" or ")})`
            );
          if (toEmails?.length) setToEmailsActive(true);
          if (ccEmails?.length) setCcEmailsActive(true);

          if (subject) filters.push(`contains(subject, '${subject}')`);
          if (keywords) filters.push(`contains(body/content, '${keywords}')`);
          if (dateFrom && dateTo)
            filters.push(
              `(receivedDateTime ge ${new Date(
                dateFrom
              ).toISOString()} and receivedDateTime le ${new Date(
                dateTo
              ).toISOString()})`
            );
          if (attachments) filters.push(`hasAttachments eq true`);

          // Finalize filter and sort query
          const filterQuery = filters.length
            ? `&$filter=${encodeURIComponent(filters.join(" and "))}`
            : "";

          setAppliedFilterQuery(filterQuery);
          setAppliedSortQuery(sortQuery);

          const fetchUrl = `${baseURL}${filterQuery}${sortQuery}`;

          let requestBatchCount = 0;
          let newNextLink = fetchUrl;

          while (newNextLink && requestBatchCount < 20) {
            const emailResponse = await fetch(newNextLink, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              signal: abortController.signal,
            });

            if (emailResponse.ok) {
              const data = await emailResponse.json();

              // Process emails and track conversation threads
              const processedEmails = await Promise.all(
                data.value.map(async (email) => {
                  const subject = email.subject || "No Subject";
                  const [parsedSubject, workOrder] = subject.split("=>") || [];

                  const conversationCount = await fetchEmailsByConversationId(
                    accessToken,
                    email.conversationId
                  );

                  return {
                    ...email,
                    subject: parsedSubject || "No Subject",
                    workOrder: workOrder || "WO#",

                    hasMailChain: conversationCount,
                  };
                })
              );

              // Append new emails to the existing emails
              props.setEmails((prevEmails) => [
                ...prevEmails,
                ...processedEmails,
              ]);

              // Update the fetched count
              setFetchedCount(
                (prevCount) => prevCount + processedEmails.length
              );

              // Update the next link for pagination
              newNextLink = data["@odata.nextLink"] || null;

              requestBatchCount++;
            } else {
              console.error(
                "Failed to fetch emails:",
                emailResponse.statusText
              );
              break;
            }
          }
          setNextLink(newNextLink);
          setHasMore(!!newNextLink);
          setShowNextButton(!!newNextLink);
        } catch (error) {
          console.error("Error acquiring token or fetching emails", error);
        }
      }
    }, 300),
    [
      accounts,
      getAccessToken,
      props.mailFolder?.folderId,
      props.mailSearchData,
      sortOrder,
      filter,
    ]
  );

  useEffect(() => {
    props.setMailID("");
  }, [props.mailFolder?.folderId]);

  // Call the debounced function
  useEffect(() => {
    if (props.mailFolder) {
      props.setEmails([]);
      setActiveIndex(null);
      debouncedGetEmails();
      props.setMarkMail(false);
      props.setSelectedMailIds([]);
    }

    // Cleanup on component unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    props.mailFolder?.folderId,
    filter,
    props.mailSearchData,
    debouncedGetEmails,
  ]);

  const fetchEmailsByConversationId = async (
    accessToken,
    conversationId,
    retries = 2
  ) => {
    // Safely encode the conversationId
    const encodedConversationId = encodeURIComponent(conversationId);
    const url = `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages?$filter=conversationId eq '${encodedConversationId}'`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.value.length; // Return the number of emails in the conversation
      } else {
        console.error(
          `Error fetching emails for conversationId: ${conversationId}. Status: ${response.status} ${response.statusText}`
        );

        // If the response is not OK and there are retries left, retry the request
        if (retries > 0) {
          return fetchEmailsByConversationId(
            accessToken,
            conversationId,
            retries - 1
          );
        }

        return 0; // Return 0 if all retries have been exhausted
      }
    } catch (error) {
      console.error("Error in fetchEmailsByConversationId:", error);

      // If an error occurs and there are retries left, retry the request
      if (retries > 0) {
        return fetchEmailsByConversationId(
          accessToken,
          conversationId,
          retries - 1
        );
      }
      return 0; // Return 0 if all retries have been exhausted
    }
  };

  const handleToggleMailChain = async (email) => {
    const emailId = email.id;
    if (expandedChains[emailId]) {
      setExpandedChains((prev) => ({
        ...prev,
        [emailId]: false, // Collapse the chain
      }));
    } else {
      // Fetch mail chain with same subject between logged-in user and the sender
      const accessToken = await getAccessToken();
      const chainResponse = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages?$filter=conversationId eq '${email.conversationId}'`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (chainResponse.ok) {
        const chainData = await chainResponse.json();
        // Process and map the fetched emails
        const processedMailChain = chainData.value.map((email) => {
          const subject = email.subject || "No Subject";
          const [parsedSubject, workOrder] = subject.split("=>") || [];

          return {
            ...email,
            subject: parsedSubject || "No Subject",
            workOrder: workOrder || "WO#",
          };
        });

        // Expand the chain with the processed emails
        setExpandedChains((prev) => ({
          ...prev,
          [emailId]: processedMailChain, // Expand the chain with processed emails
        }));
      }
    }
  };

  const handleNextBatch = () => {
    setShowNextButton(false); // Hide the button before fetching the next batch
    debouncedGetEmails(fetchedCount); // Pass the number of already fetched emails
  };

  // Memoized email IDs to avoid recalculating during rendering
  const allEmailIds = useMemo(
    () => props.emails.map((email) => email.id),
    [props.emails]
  );
  const toggleMarkAble = useCallback(() => {
    props.setSelectedMailIds([]);
    props.setMarkMail((prevMarkAble) => !prevMarkAble);
  }, [props]);
  const toggleSelectAll = useCallback(() => {
    if (props.selectedMailIds.length === props.emails.length) {
      props.setSelectedMailIds([]); // Unselect all
    } else {
      props.setSelectedMailIds(allEmailIds); // Select all
    }
  }, [props.emails.length, props, allEmailIds]);
  const toggleSelectChange = useCallback(
    (id) => {
      if (props.selectedMailIds.includes(id)) {
        props.setSelectedMailIds(
          props.selectedMailIds.filter((selectedId) => selectedId !== id)
        ); // Unselect item
      } else {
        props.setSelectedMailIds([...props.selectedMailIds, id]); // Select item
      }
    },
    [props]
  );
  const filterToggle = () => {
    setFilterAble(!filterAble);
  };
  // Filter for 'toMe'
  const toMeFilter = () => {
    if (accounts.length > 0) {
      const toMeEmail = accounts[0].username.toLowerCase();
      const filtered = props.emails.filter((email) => {
        return email.toRecipients.some(
          (recipient) =>
            recipient.emailAddress.address.toLowerCase() === toMeEmail
        );
      });
      setFilteredEmails(filtered);
    }
  };
  // Filter for 'toEmails' (array)
  const toEmailsFilter = () => {
    if (props.mailSearchData?.toEmails?.length > 0) {
      const toEmailsLowercase = props.mailSearchData?.toEmails.map((email) =>
        email.toLowerCase()
      );
      const filtered = props.emails.filter((email) => {
        return email.toRecipients.some((recipient) =>
          toEmailsLowercase.includes(
            recipient.emailAddress.address.toLowerCase()
          )
        );
      });
      setFilteredEmails(filtered);
    }
  };
  // Filter for 'ccEmails' (array)
  const ccEmailsFilter = () => {
    if (props.mailSearchData?.ccEmails?.length > 0) {
      const ccEmailsLowercase = props.mailSearchData?.ccEmails.map((email) =>
        email.toLowerCase()
      );
      const filtered = props.emails.filter((email) => {
        return email.ccRecipients.some((recipient) =>
          ccEmailsLowercase.includes(
            recipient.emailAddress.address.toLowerCase()
          )
        );
      });
      setFilteredEmails(filtered);
    }
  };
  // Use effects to trigger the filters based on active states
  useEffect(() => {
    if (toMeActive) {
      toMeFilter();
    }
  }, [props.emails, accounts, toMeActive]);

  useEffect(() => {
    if (toEmailsActive) {
      toEmailsFilter();
    }
  }, [props.emails, props.toEmails, toEmailsActive]);

  useEffect(() => {
    if (ccEmailsActive) {
      ccEmailsFilter();
    }
  }, [props.emails, props.ccEmails, ccEmailsActive]);

  const handleItemClick = async (index, itemId) => {
    if (props.mailFolder.folderName === "Drafts") {
      props.setMailID(itemId);
      setActiveIndex(index);
      mailMinimize.markAsRead(itemId);
      props.setIsComposing(true);
      props.setMailSendType("draftSent");

      try {
        const accessToken = await getAccessToken();
        const email = props.emails.find((email) => email.id === itemId);

        if (!email) throw new Error("Email not found.");

        const [subject, workOrder] = parseSubject(email.subject);

        // Set basic email data first for immediate display
        props.setSelectedMail({
          ...email,
          subject,
          workOrder,
          body: { content: email.body.content || "" },
          attachments: [],
          senderImage: null,
        });

        const senderImage = await getSenderImage(
          email.from.emailAddress.address,
          accessToken
        );
        const attachments = await fetchAttachments(itemId, accessToken);
        const updatedBody = insertInlineAttachments(
          email.body.content,
          attachments
        );

        props.setSelectedMail((prev) =>
          prev.id === itemId
            ? {
                ...email,
                subject,
                workOrder,

                senderImage,
                body: { content: updatedBody },
                attachments,
              }
            : prev
        );
      } catch (error) {
        if (error.name !== "AbortError")
          console.error("Error fetching email details:", error);
      }
    } else {
      props.setIsComposing(false);
      setActiveIndex(index);
      props.setMailID(itemId);
      mailMinimize.markAsRead(itemId);
    }
  };

  const parseSubject = (subject = "") => {
    const [mainSubject, workOrder] = subject.split("=>");
    return [mainSubject || "No Subject", workOrder || "WO#"];
  };

  const getSenderImage = async (emailAddress, accessToken) => {
    try {
      let response;

      if (accounts[0].username === emailAddress) {
        response = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/me/photo/$value`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      } else {
        response = await fetch(
          `${process.env.REACT_APP_MICROSOFT_API_URL}/users/${emailAddress}/photo/$value`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      return response.ok ? response.url : null;
    } catch (error) {
      console.error("Error fetching sender image:", error);
      return null;
    }
  };

  const fetchAttachments = async (itemId, accessToken) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_MICROSOFT_API_URL}/me/messages/${itemId}/attachments`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.value || [];
      }
    } catch (error) {
      console.error(`Error fetching attachments for mailID: ${itemId}`, error);
    }
    return [];
  };

  const insertInlineAttachments = (bodyContent, attachments) => {
    let updatedBody = bodyContent;
    attachments
      .filter((attachment) => attachment.isInline)
      .forEach((attachment) => {
        const cid = attachment.contentId;
        const base64Image = `data:${attachment.contentType};base64,${attachment.contentBytes}`;
        updatedBody = updatedBody.replace(`cid:${cid}`, base64Image);
      });
    return updatedBody;
  };

  //CONTEXT MENU
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    mail: null,
  });

  const contextMenuRef = useRef(null); // Ref for the context menu

  const handleContextMenu = (event, mail) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      mail,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, mail: null });
  };

  const handleAction = (action) => {
    switch (action) {
      case "Copy":
      case "Print":
      case "Reply":
      case "Reply All":
      case "Forward":
      case "Mark as Unread":
      case "Mark as Read":
      case "Move to":
      case "Delete":
      default:
        return null;
    }

    handleCloseContextMenu();
  };

  useEffect(() => {
    document.addEventListener("click", handleCloseContextMenu);
    return () => document.removeEventListener("click", handleCloseContextMenu);
  }, []);

  // console.log("EXPANDED",expandedChains);

  const fetchDeltaEmails = useCallback(async () => {
    const accessToken = await getAccessToken();
    const deltaUrl = `https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages/delta`;
    try {
      const response = await fetch(deltaUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const emails = data.value;

        // Filter out already fetched emails
        const newEmailIds = new Set(props.emails.map((email) => email.id));
        const filteredNewEmails = emails.filter(
          (email) => !newEmailIds.has(email.id)
        );

        if (filteredNewEmails.length > 0) {
          const processedEmails = await Promise.all(
            filteredNewEmails.map(async (email) => {
              const subject = email.subject || "No Subject";
              const [parsedSubject, workOrder] = subject.split("=>") || [];

              const conversationCount = await fetchEmailsByConversationId(
                accessToken,
                email.conversationId
              );

              return {
                ...email,
                subject: parsedSubject || "No Subject",
                workOrder: workOrder || "WO#",

                hasMailChain: conversationCount,
              };
            })
          );

          if (
            props.mailFolder.folderName === "Inbox" &&
            filter === "all" &&
            props.mailSearchData.subject === "" &&
            appliedSortQuery !== "" &&
            appliedFilterQuery !== ""
          ) {
            // Update the emails in props
            props.setEmails((prevEmails) => [
              ...processedEmails,
              ...prevEmails,
            ]);
          }

          processedEmails.forEach((email) => {
            // addNotification({
            //   title: `${email.from.emailAddress.name} sent you a message via FALGUN MAIL`,
            //   subtitle: `${email.subject}`,
            //   message: `${email.subject}`,
            //   theme: "darkblue",
            //   native: true,
            //   duration: 30000, // 30 seconds
            // });
          });
        }
        // Store the delta token for future use
        if (data["@odata.deltaLink"]) {
          localStorage.setItem("deltaLink", data["@odata.deltaLink"]);
        }
      }
    } catch (error) {
      console.error("Error fetching delta emails:", error);
    }
  }, [getAccessToken, props]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchDeltaEmails(); // Poll for delta changes every 20 seconds
    }, 20000); // Adjust the interval as needed

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchDeltaEmails]);

  const groupEmailsByDate = (emails) => {
    const grouped = {
      today: [],
      yesterday: [],
      thisWeek: [],
      lastWeek: [],
      twoWeeksAgo: [],
      older: [],
    };

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfToday.getDate() - 1);
    const startOfThisWeek = new Date(startOfToday);
    startOfThisWeek.setDate(
      startOfThisWeek.getDate() - startOfThisWeek.getDay()
    );
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
    const startOfTwoWeeksAgo = new Date(startOfLastWeek);
    startOfTwoWeeksAgo.setDate(startOfTwoWeeksAgo.getDate() - 7);

    emails.forEach((email) => {
      const receivedDate = new Date(email.receivedDateTime);

      if (receivedDate >= startOfToday) {
        grouped.today.push(email);
      } else if (
        receivedDate >= startOfYesterday &&
        receivedDate < startOfToday
      ) {
        grouped.yesterday.push(email);
      } else if (
        receivedDate >= startOfThisWeek &&
        receivedDate < startOfToday
      ) {
        grouped.thisWeek.push(email);
      } else if (
        receivedDate >= startOfLastWeek &&
        receivedDate < startOfThisWeek
      ) {
        grouped.lastWeek.push(email);
      } else if (
        receivedDate >= startOfTwoWeeksAgo &&
        receivedDate < startOfLastWeek
      ) {
        grouped.twoWeeksAgo.push(email);
      } else {
        grouped.older.push(email);
      }
    });

    // Remove empty groups
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, emails]) => emails.length > 0)
    );
  };

  const groupedEmails = groupEmailsByDate(
    toMeActive || toEmailsActive || ccEmailsActive
      ? filteredEmails
      : props.emails
  );

  const [expandedGroups, setExpandedGroups] = useState(() => {
    const savedState = localStorage.getItem("expandedGroups");
    return savedState
      ? JSON.parse(savedState)
      : Object.keys(groupedEmails).reduce((acc, group) => {
          acc[group] = true; // Set each group as expanded
          return acc;
        }, {});
  });

  // Save expandedGroups to localStorage
  useEffect(() => {
    localStorage.setItem("expandedGroups", JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  const toggleGroupVisibility = (group) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  const flatEmails = Object.values(groupedEmails).flat();

  console.log("FLATEMAIL", flatEmails);

  const itemRefs = useRef([]);

  // Handle keydown events for ArrowUp and ArrowDown
  const handleKeyDown = (e) => {
    const totalItems = flatEmails.length;

    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent default scrolling behavior
      setActiveIndex((prevIndex) =>
        prevIndex + 1 < totalItems ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent default scrolling behavior
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex
      );
    }
  };

  // Smooth scroll to the active item
  useEffect(() => {
    if (activeIndex !== null && flatEmails[activeIndex]) {
      const activeMail = flatEmails[activeIndex];
      props.setMailID(activeMail.id);
      mailMinimize.markAsRead(activeMail.id);

      const activeItem = itemRefs.current[activeIndex];
      if (activeItem && inboxRef.current) {
        const offsetTop =
          activeItem.offsetTop - inboxRef.current.offsetHeight / 2; // Center the active item
        smoothScroll(inboxRef.current, offsetTop, 300); // Adjust duration as needed
      }
    }
  }, [activeIndex]);

  // Smooth scroll function
  const smoothScroll = (element, target, duration) => {
    const start = element.scrollTop;
    const change = target - start;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Ensure progress doesn't exceed 1
      const ease = easeInOutQuad(progress);
      element.scrollTop = start + change * ease;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  // Easing function for smooth scrolling
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  // Attach and clean up keydown event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    // Flatten expandedChains into a single array
    const chainMails = Object.values(expandedChains).flat().filter(Boolean);

    // Combine emails + chain mails
    const combined = [...props.emails, ...chainMails];

    // Deduplicate by ID
    const uniqueMails = combined.reduce((acc, mail) => {
      if (!acc.some((m) => m.id === mail.id)) acc.push(mail);
      return acc;
    }, []);

    props.setUnitedAllMails(uniqueMails);
  }, [props.emails, expandedChains]);

  return (
    <div
      className={`inbox non_printing_area ${
        props.extendDetailsToggle ? "collapsed" : ""
      }`}
      style={{ width: `${props.mailListWidth}%` }}
    >
      <InboxHeader
        toggleSelectAll={toggleSelectAll}
        setFilter={setFilter}
        setToMeActive={setToMeActive}
        toMeFilter={toMeFilter}
        toMeActive={toMeActive}
        filter={filter}
        filterToggle={filterToggle}
        filterAble={filterAble}
        setSortOrder={setSortOrder}
        mailFolder={props.mailFolder}
        emails={props.emails}
        selectedMailIds={props.selectedMailIds}
        toggleMarkAble={toggleMarkAble}
        props={props}
      />
      <div
        className="mail_list"
        ref={inboxRef}
        tabIndex="0"
        onKeyDown={handleKeyDown}
      >
        {Object.entries(groupedEmails).map(([group, emails]) => (
          <div className="group" key={group}>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => toggleGroupVisibility(group)}
              className="group-header"
            >
              <span className="me-2">
                {expandedGroups[group] ? <ArrowDownIcon /> : <ArrowRightIcon />}
              </span>

              {group === "today"
                ? "Today"
                : group === "yesterday"
                ? "Yesterday"
                : group === "thisWeek"
                ? "This Week"
                : group === "lastWeek"
                ? "Last Week"
                : group === "twoWeeksAgo"
                ? "Two Weeks Ago"
                : "Earlier"}
            </div>

            {/* Group Emails */}
            {expandedGroups[group] && (
              <div className="group-emails">
                {emails.map((item, index) => (
                  <div
                    className={
                      index === activeIndex ? "with_chain active" : "with_chain"
                    }
                    key={item.id}
                    ref={(el) =>
                      (itemRefs.current[flatEmails.indexOf(item)] = el)
                    }
                  >
                    {/* Main Email Item */}
                    <MailingSingle
                      accessToken={fToken}
                      item={item}
                      index={flatEmails.indexOf(item)}
                      activeIndex={activeIndex}
                      handleItemClick={handleItemClick}
                      handleContextMenu={
                        props.mailID === item.id ? handleContextMenu : undefined
                      }
                      toggleSelectChange={toggleSelectChange}
                      selectedMailIds={props.selectedMailIds}
                      mailMinimize={mailMinimize}
                      mailFolder={props.mailFolder}
                      setMailSendType={props.setMailSendType}
                      setMailID={props.setMailID}
                      props={props}
                      onToggleMailChain={() => handleToggleMailChain(item)}
                      hasMailChain={!!item.mailChain}
                    />

                    {/* Expanded Mail Chain */}
                    {expandedChains[item.id] &&
                      expandedChains[item.id].map((chainMail) => (
                        <div key={chainMail.id} className="mail-chain-item">
                          <MailingSingle
                            accessToken={fToken}
                            isSubMail={true}
                            item={chainMail}
                            index={chainMail}
                            activeIndex={activeIndex}
                            handleItemClick={handleItemClick}
                            handleContextMenu={
                              props.mailID === chainMail.id
                                ? handleContextMenu
                                : undefined
                            }
                            toggleSelectChange={toggleSelectChange}
                            selectedMailIds={props.selectedMailIds}
                            mailMinimize={mailMinimize}
                            mailFolder={props.mailFolder}
                            setMailSendType={props.setMailSendType}
                            setMailID={props.setMailID}
                            props={props}
                          />
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {showNextButton && hasMore && (
          <div className="text-center">
            <button className="load_more_mail_btn" onClick={handleNextBatch}>
              Load More
            </button>
          </div>
        )}
      </div>

      {contextMenu.visible && (
        <MailContextMenu
          mail={contextMenu.mail}
          ref={contextMenuRef} // This ref isn't necessary in the parent anymore, handled inside the component
          x={contextMenu.x}
          y={contextMenu.y}
          mailMinimize={mailMinimize}
          props={props}
          visible={contextMenu.visible}
          onClose={handleCloseContextMenu}
          onAction={handleAction}
        />
      )}
    </div>
  );
}
