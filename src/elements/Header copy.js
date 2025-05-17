import React, { Fragment, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import InnerSearch from "./InnerSearch";
import HeaderDropdown from "./HeaderDropdown";
import MailSearch from "./mail/MailSearch";
import { mailMinimize } from "../minimize/mailMinimize";
import HeaderRightMenu from "./HeaderRightMenu";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";

import Logo from "../assets/images/logos/logo-short.png";

const Header = (props) => {
  const history = useHistory();
  const canGoBack = history.length > 2;

  // Function to go back
  const handleBackClick = () => {
    history.goBack();
  };

  //mail delete,read,unread functions
  const { instance, accounts } = useMsal();

  // Memoize access token to avoid acquiring it unnecessarily
  const getAccessToken = useCallback(async () => {
    if (accounts.length > 0) {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });
      return response.accessToken;
    }
  }, [instance, accounts]);

  mailMinimize.setAccessTokenAndEmails(getAccessToken, props.setEmails);

  return (
    <header className="header_V1">
      <div
        className={
          props.headerData?.pageName === "Mail"
            ? "header_content three_part"
            : "header_content"
        }
      >
        {props.headerData?.pageName === "Mail" ? (
          <Fragment>
            <div className="header_left_menus">
              <a
                href="/dashboard"
                className="navbar-brand margin-auto text-center"
              >
                <img style={{ height: "38px" }} src={Logo} alt="Logo" />
              </a>
              <div className="header_page_title">
                {props.headerData?.pageName}
              </div>
            </div>
            <div className="header_left_menus">
              {props.headerData?.modalButtonRef === "composeSection" && (
                <button
                  onClick={() => {
                    props.setIsComposing(true);
                    props.setMailSendType("Send");
                  }}
                  className="btn new_btn"
                >
                  {props.headerData?.newButtonText}
                </button>
              )}
              {props.headerData.isMailSearch === true && (
                <MailSearch {...props} />
              )}
            </div>
            <div className="header_left_menus">
              {props.selectedMailIds.length > 0 && (
                <div className="buttons_group">
                  {props.mailFolder.folderName === "Deleted Items" ? (
                    <>
                      <button
                        onClick={() =>
                          mailMinimize.bulkRestore(props.selectedMailIds)
                        }
                        className="text-sucess"
                      >
                        Restore
                      </button>
                      <button
                        className="text-danger"
                        onClick={() =>
                          mailMinimize.bulkPermanentDelete(
                            props.selectedMailIds
                          )
                        }
                      >
                        Trash
                      </button>
                    </>
                  ) : (
                    <button
                      className="text-danger"
                      onClick={() =>
                        mailMinimize.bulkDelete(props.selectedMailIds)
                      }
                    >
                      Delete
                    </button>
                  )}
                  <button>Archive</button>
                  <button>Move to</button>
                </div>
              )}
              <HeaderRightMenu {...props} />
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="header_left_menus">
              {/* {props.headerData?.isBackBtn && (
            <>
              {canGoBack && (
                <button className="backBtn" onClick={handleBackClick}>
                  <i className="fa fa-chevron-left"></i>
                </button>
              )}
            </>
          )} */}
              <div className="logo_area">
                <a
                  href="/dashboard"
                  className="navbar-brand margin-auto text-center"
                >
                  <img style={{ height: "38px" }} src={Logo} alt="Logo" />
                </a>
              </div>

              <div className="header_page_title">
                {props.headerData?.pageName}
              </div>
              {props.headerData?.isModalButton === true && (
                <>
                  {props.headerData?.modalButtonRef === "buyerModal" && (
                    <button
                      onClick={() => {
                        props.setBuyerModal(true);
                      }}
                      className="btn new_btn"
                    >
                      {props.headerData?.newButtonText}
                    </button>
                  )}
                </>
              )}
              {props.headerData?.isNewButton === true && (
                <Link
                  to={props.headerData?.newButtonLink}
                  className="btn new_btn"
                >
                  {props.headerData?.newButtonText}
                </Link>
              )}
              {props.headerData?.isDropdown === true && (
                <HeaderDropdown {...props} />
              )}
              {props.headerData.isInnerSearch === true && (
                <InnerSearch {...props} />
              )}
              {props.headerData.isMailSearch === true && (
                <MailSearch {...props} />
              )}
            </div>
            <div className="header_middle_content"></div>
            <HeaderRightMenu {...props} />
          </Fragment>
        )}
      </div>
    </header>
  );
};

export default Header;
