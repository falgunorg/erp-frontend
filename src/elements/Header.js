import React, { Fragment, useCallback } from "react";
import { useHistory } from "react-router-dom";
import InnerSearch from "./InnerSearch";
import MailSearch from "./mail/MailSearch";
import HeaderRightMenu from "./HeaderRightMenu";
import Logo from "../assets/images/logos/logo-short.png";

const Header = (props) => {
  const history = useHistory();
  const canGoBack = history.length > 2;

  // Function to go back
  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <header className="header_V1">
      <div className="new_header">
        <div className="logo_area">
          <a href="/dashboard" className="navbar-brand margin-auto text-center">
            <img style={{ height: "38px" }} src={Logo} alt="Logo" />
          </a>
        </div>
        <div className="page_name_area">{props.headerData?.pageName}</div>
        <div className="search_area">
          {props.headerData?.pageName === "Mail" ? (
            <MailSearch {...props} />
          ) : (
            <InnerSearch {...props} />
          )}
        </div>
        <div className="rightmenu_area">
          <HeaderRightMenu {...props} />
        </div>
      </div>
    </header>
  );
};

export default Header;
