import React, { useState, useEffect } from "react";
import api from "services/api";
import ls from "services/ls";
import auth from "services/auth";
import Spinner from "elements/Spinner";
import Chat from "elements/Chat";
import swal from "sweetalert";
import { Redirect, Route, Link, useLocation } from "react-router-dom";
import {
  isMobile,
  isMobileByViewPort,
  cauculateLandScape,
} from "services/isMobile";

import socket from "services/socket";

const FullLayout = ({ children, ...rest }) => {
  const [spinner, setSpinner] = useState(false);

  const [isLandscape, setIsLandscape] = useState(cauculateLandScape());
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isMobileDeviceByViewPort, setIsMobileDeviceByViewPort] = useState(
    false
  );
  const [supportSidebarOpen, setSupportSidebarOpen] = useState(false);

  const showAlert = (title, message, isError, callback) => {
    swal({
      title: title,
      text: message,
      icon: isError ? "warning" : "success",
    }).then((value) => {
      if (callback) {
        callback(value);
      }
    });
  };

  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);
  const [userDetails, setUserDetails] = useState(auth.getUser);

  //Get user balance functionality
  const [userBalance, setUserBalance] = useState({
    cash_balance: 0,
    bonus_balance: 0,
    total_balance: 0,
    wallets: [],
    rates: [],
  });
  const getUserBalance = async (ev) => {
    var response = await api.get("/get-balance");
    console.log(response);
    ls.set("conversionRates", response.data.rates);
    setUserBalance(response.data);
  };

  const setUsersWallet = async (currency) => {
    var response = await api.post("/set-wallet", { currency });
    console.log(response);
    if (response.status === 200) {
      setUserBalance(response.data);
      ls.set("conversionRates", response.data.rates);
    }
  };

  const [accountProgress, setAccountProgress] = useState(0);
  const getAccountProgress = async (ev) => {
    var response = await api.get("/account-progress");
    console.log("accountProgress", response);
    setAccountProgress(response.data);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsLandscape(cauculateLandScape());
    });
    setIsMobileDevice(isMobile());
    setIsMobileDeviceByViewPort(isMobileByViewPort());

    var interval;
    if (isAuthenticated) {
      getAccountProgress();
      getUserBalance();
      setUserDetails(auth.getUser());
    }

    interval = setInterval(() => {
      if (isAuthenticated) {
        getUserBalance();
      }
    }, 15000);
    return () => {
      try {
        clearInterval(interval);
      } catch (ex) {}
    };
  }, []);

  const [searchStr, setSearchStr] = useState(""); //Used in Header.js and Games.js
  const [providers, setProviders] = useState([]); //Used in Header.js and Games.js
  const [selectedProviders, setSelectedProviders] = useState([]); //Used in Header.js and Games.js
  const getProviders = async () => {
    var response = await api.get("/games/providers");
    if (response.status === 200) {
      setProviders(response.data);
    }
  };
  useEffect(() => {
    getProviders();
  }, []);

  const [openWalletModalTab, setOpenWalletModalTab] = useState(null);
  const [showVaultModal, setShowVaultModal] = useState(false);

  const [isChatVisible, setIsChatVisible] = useState(true);
  const [chatInPopup, setChatInPopup] = useState(null);

  const passableParams = {
    showAlert,
    isMobileDevice,
    isMobileDeviceByViewPort,
    isLandscape,
    isAuthenticated,
    setSpinner,
    userDetails,
    userBalance,
    getUserBalance,
    setUsersWallet,
    accountProgress,
    getAccountProgress,
    searchStr,
    setSearchStr,
    providers,
    selectedProviders,
    setSelectedProviders,
    openWalletModalTab,
    setOpenWalletModalTab,
    isChatVisible,
    setIsChatVisible,
    showVaultModal,
    setShowVaultModal,
    supportSidebarOpen,
    setSupportSidebarOpen,
    socket,
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, passableParams);
    }
    return child;
  });

  const location = useLocation();
  const [inPlay, setInPlay] = useState(false);
  const playPath = location.pathname.split("/");

  useEffect(() => {
    setInPlay(playPath.includes("play"));
    setIsMobileDevice(isMobile());
  }, [playPath]);

  return (
    <>
      {spinner && <Spinner />}
      {isAuthenticated && <Chat {...passableParams} fullLayout={true} />}
    </>
  );
};

export default FullLayout;
