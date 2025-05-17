import React, { useState, useEffect } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  VoiceCallButton,
  VideoCallButton,
  InfoButton,
  TypingIndicator,
  Sidebar,
  ConversationList,
  Conversation,
  Search,
  AttachmentButton,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { FaPaperclip } from "react-icons/fa";
import api from "../../services/api";
import Spinner from "../Spinner";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import moment from "moment";

//socket
import io from "socket.io-client";
import Echo from "laravel-echo";

export default function ChatBot() {
  const [echo, setEcho] = useState(null);
  useEffect(() => {
    const echoInstance = new Echo({
      broadcaster: "socket.io",
      client: io,
      host: window.location.hostname + ":6001", // Ensure this matches your Laravel Echo Server port
    });
    setEcho(echoInstance);

    console.log("Echo instance created", echoInstance);

    echoInstance.connector.socket.on("connect", () => {
      console.log("Successfully connected to Echo server");
    });

    echoInstance.connector.socket.on("connect_error", (error) => {
      console.error("Connection error", error);
    });

    return () => {
      echoInstance.disconnect(); // Disconnect Echo instance when component unmounts
    };
  }, []);

  const [spinner, setSpinner] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchConversations = async () => {
    var response = await api.post("/conversations", {
      recipient_id: recipientId,
    });
    if (response.status === 200 && response.data) {
      setConversations(response.data.data);
    }
  };
  useEffect(() => {
    fetchConversations();
  }, []);

  const handleConversationChange = (conversationId) => {
    setActiveConversation(conversationId);
  };

  // Fetching meggasge

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    if (echo && activeConversation) {
      const channel = `conversation.${activeConversation}`;
      console.log(`Joining channel ${channel}`);

      echo
        .join(channel)
        .here((users) => {
          console.log("Users in the channel:", users);
        })
        .joining((user) => {
          console.log(`${user.name} is joining the chat`);
        })
        .leaving((user) => {
          console.log(`${user.name} has left the chat`);
        })
        .listen("MessageSent", (e) => {
          console.log("Message received:", e);
          fetchMessages(activeConversation);
        });

      return () => {
        echo.leave(channel);
        console.log(`Left channel ${channel}`);
      };
    }
  }, [echo, activeConversation]);

  const fetchMessages = async (conversationId) => {
    var response = await api.post("/conversations-details", {
      conversation_id: conversationId,
    });
    if (response.status === 200 && response.data) {
      setMessages(response.data.data);
    }
  };

  const handleSend = async (message) => {
    setSpinner(true);
    var response = await api.post("/messages-send", {
      conversation_id: activeConversation,
      message: message,
    });
    if (response.status === 200 && response.data) {
      fetchMessages(activeConversation);
      fetchConversations();
    }
    setSpinner(false);
  };

  const handleFileUpload = (event) => {
    // Implement file upload functionality
  };

  // Find active conversation object
  const activeConversationObj = conversations.find(
    (conversation) => conversation.id === activeConversation
  );

  const [employees, setEmployees] = useState([]);
  const getEmployees = async () => {
    setSpinner(true);
    var response = await api.post("/employees");
    if (response.status === 200 && response.data) {
      setEmployees(response.data.data);
    } else {
      console.log(response.data);
    }
    setSpinner(false);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  //fhdjskfhdkjs fh

  const [submitError, setSubmitError] = useState("");
  const [recipientModal, setRecipientModal] = useState(false);
  const [recipientId, setRecipientId] = useState(null);
  const selectedEmployee = employees.find((item) => item.id === recipientId);

  const openRecipientModal = () => {
    setRecipientModal(true);
  };

  const closeRecipientModal = () => {
    setRecipientModal(false);
    setRecipientId(null);
    setSubmitError("");
  };

  const submitConversation = async () => {
    setSpinner(true);
    if (!recipientId) {
      setSubmitError("Please Select Recipient");
    } else {
      var response = await api.post("/conversations-create", {
        recipient_id: recipientId,
      });
      if (response.status === 200 && response.data) {
        fetchConversations();
        setRecipientModal(false);
        setRecipientId(null);
        setSubmitError("");
      } else {
        setSubmitError(response.data.message);
      }
    }
    setSpinner(false);
  };
  const formatDate = (date) => moment(date).format("DD MMM YYYY");
  let prevDate = null;
  return (
    <div style={{ position: "relative", height: `calc(100vh - 95px)` }}>
      {spinner && <Spinner />}
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <Search
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e)}
          />
          <ConversationList>
            {filteredConversations.map((conversation) => (
              <Conversation
                key={conversation.id}
                name={conversation.name}
                lastSenderName={conversation.lastSenderName}
                info={conversation.info}
                active={activeConversation === conversation.id}
                onClick={() => handleConversationChange(conversation.id)}
              >
                <Avatar
                  src={conversation.avatar}
                  name={conversation.name}
                  status={conversation.status}
                />
              </Conversation>
            ))}
          </ConversationList>
          <Button onClick={openRecipientModal}>Add New Recipient</Button>
        </Sidebar>
        <ChatContainer>
          {activeConversationObj && (
            <ConversationHeader>
              <Avatar
                src={activeConversationObj.avatar}
                name={activeConversationObj.name}
                status={activeConversationObj.status}
              />
              <ConversationHeader.Content
                userName={activeConversationObj.name}
                info="Active now"
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
          )}

          {activeConversation ? (
            <MessageList>
              {messages.map((msg, index) => {
                const messageDate = formatDate(msg.created_at);
                const showSeparator = messageDate !== prevDate;
                prevDate = messageDate;

                return (
                  <div key={index}>
                    {showSeparator && (
                      <MessageSeparator content={messageDate} />
                    )}
                    <Message model={msg}>
                      {msg.file ? (
                        <a
                          href={msg.file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {msg.message}
                        </a>
                      ) : (
                        <span>{msg.message}</span>
                      )}
                      <Message.Footer
                        sentTime={moment(msg.created_at).format("LT")}
                      />
                    </Message>
                  </div>
                );
              })}
            </MessageList>
          ) : (
            ""
          )}

          <MessageInput
            autoFocus
            placeholder="Type message here"
            onSend={handleSend}
            disabled={activeConversation ? false : true}
          />
        </ChatContainer>
      </MainContainer>

      <Modal show={recipientModal} onHide={closeRecipientModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Recipient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>
              Select Recipient<sup>*</sup>
            </label>

            <Select
              placeholder="Search or Select"
              value={
                selectedEmployee
                  ? {
                      value: recipientId,
                      label: `${selectedEmployee.full_name} | ${selectedEmployee.department_title} | ${selectedEmployee.designation_title}`,
                    }
                  : null
              }
              onChange={(selectedOption) =>
                setRecipientId(selectedOption.value)
              }
              name="supplier_id"
              options={employees.map((item) => ({
                value: item.id,
                label: `${item.full_name} | ${item.department_title} | ${item.designation_title}`,
              }))}
            />
          </div>
          <br />
          <div className="text-danger">{submitError ? submitError : ""}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitConversation}>
            Connect
          </Button>
          <Button variant="secondary" onClick={closeRecipientModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
