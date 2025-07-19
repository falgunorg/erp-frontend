import React, { useState, useEffect } from "react";
import auth from "services/auth";
import ScrollTo from "elements/ScrollTo";
import Header from "elements/Header";
import Spinner from "elements/Spinner";
import api from "../services/api";
import Sidebar from "../elements/Sidebar";
import ls from "../services/ls";
import { useLocation, useHistory } from "react-router-dom";

const FullLayout = ({ children, ...rest }) => {
  const location = useLocation();

  const [rolePermission, setRolePermission] = useState({});
  const getRolePermission = async () => {
    var response = await api.get("/get_role_permission");
    if (response.status === 200 && response.data) {
      setRolePermission(response.data.data);
    } else {
      console.log(response.data.data);
    }
  };

  const [callNotifications, setCallNotifications] = useState(false);
  //Notifications
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const getNotifications = async () => {
    try {
      const response = await api.post("/notifications", { is_read: 0 });
      if (response.status === 200 && response.data) {
        setUnreadNotifications(response.data.notifications || []);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // useEffect(() => {
  //   if (auth.isAuthenticated()) {
  //     // Initial fetch of notifications when user logs in
  //     getNotifications();

  //     // Fetch notifications every 5 minutes
  //     const interval = setInterval(() => {
  //       getNotifications();
  //     }, 180000); // 5 minutes in milliseconds

  //     // Clean up interval on unmount or when auth state changes
  //     return () => clearInterval(interval);
  //   }
  // }, [auth.isAuthenticated()]);

  // useEffect(() => {
  //   if (auth.isAuthenticated()) {
  //     getNotifications();
  //   }
  // }, [callNotifications]);

  const [spinner, setSpinner] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated);
  const [userData, setUserData] = useState(auth.getUser);
  const [sidebar, setSideBar] = useState(true);
  const [section, setSection] = useState("dashboard");
  const [itemModal, setItemModal] = useState(false);
  const [callItems, setCallItems] = useState(false);
  const [buyerModal, setBuyerModal] = useState(false);
  const [callBuyers, setCallBuyers] = useState(false);
  const [styleModal, setStyleModal] = useState(false);
  const [callStyles, setCallStyles] = useState(false);
  const [colorModal, setColorModal] = useState(false);
  const [callColors, setCallColors] = useState(false);
  const [sizeModal, setSizeModal] = useState(false);
  const [callSizes, setCallSizes] = useState(false);
  const [unitModal, setUnitModal] = useState(false);
  const [callUnits, setCallUnits] = useState(false);
  const [partModal, setPartModal] = useState(false);
  const [callParts, setCallParts] = useState(false);

  //Header Parameters
  const [headerData, setHeaderData] = useState({
    pageName: "",
    isModalButton: false,
    modalButtonRef: "",
    isNewButton: false,
    newButtonLink: "",
    newButtonText: "",
    isInnerSearch: false,
    innerSearchValue: "",
    isDropdown: false,
    DropdownMenu: [],
    isBackBtn: false,
  });

  const [sidebarFilter, setSidebarFilter] = useState({
    department: "",
    purchase_contract_id: "",
    technical_package_id: "",
    date: "",
  });

  //MAIL COMPOSER AREA
  const [isComposing, setIsComposing] = useState(false);
  const [mailID, setMailID] = useState(0);

  // FOR MAIL DETAILS AND CHAIN MESSAGES
  const [selectedMail, setSelectedMail] = useState({});
  const [chainMessages, setChainMessages] = useState([]);

  const [mailFolder, setMailFolder] = useState({
    folderName: "",
    folderId: "",
  });
  const [emails, setEmails] = useState([]);
  const [selectedMailIds, setSelectedMailIds] = useState([]);

  const [mailSendType, setMailSendType] = useState("Send");

  //SUBSTORE ISSUE ON CANVAS
  const [substoreIssueCanvas, setSubstoreIssueCanvas] = useState(false);
  const [callSubstores, setCallSubstores] = useState(false);
  const [substoreCanvasId, setSubstoreCanvasId] = useState(null);

  //SUBSTORE RECEIVE ON CANVAS
  const [substoreReceiveCanvas, setSubstoreReceiveCanvas] = useState(false);
  const [requisitionItemId, setRequisitionItemId] = useState(null);
  const [callRequisition, setCallRequisition] = useState(false);

  const [sampleTypeModal, setSampleTypeModal] = useState(false);
  const [callSampleTypes, setCallSampleTypes] = useState(false);
  const [resizeToggle, setResizeToggle] = useState(ls.get("resizeToggle"));
  const [extendDetailsToggle, setExtendDetailsToogle] = useState(false);
  const [mailSearchData, setMailSearchData] = useState([]);

  //Editor instance
  const [editorInstance, setEditorInstance] = useState({
    actionHistory: "",
    toggleImportance: "normal",
    selectedFiles: [],
  });

  const [currentCommand, setCurrentCommand] = useState(null);
  //ZOOM IN-OUT AREA

  const [mailListWidth, setMailListWidth] = useState(38.27);
  const [mailDetailsWidth, setMailDetailsWidth] = useState(50.3);

  //mail markable functions

  const [markMail, setMarkMail] = useState(false);

  const passableParams = {
    isAuthenticated,
    setSpinner,
    spinner,
    userData,
    rolePermission,
    unreadNotifications,

    // sidebar
    sidebar,
    setSideBar,
    sidebarFilter,
    setSidebarFilter,

    // section
    section,
    setSection,
    // modals
    // items
    itemModal,
    setItemModal,
    callItems,
    setCallItems,
    // buyers
    buyerModal,
    setBuyerModal,
    callBuyers,
    setCallBuyers,
    // styles
    styleModal,
    setStyleModal,
    callStyles,
    setCallStyles,
    // colors
    colorModal,
    setColorModal,
    callColors,
    setCallColors,
    // sizes
    sizeModal,
    setSizeModal,
    callSizes,
    setCallSizes,
    // units
    unitModal,
    setUnitModal,
    callUnits,
    setCallUnits,
    // sampleTypes
    sampleTypeModal,
    setSampleTypeModal,
    callSampleTypes,
    setCallSampleTypes,
    partModal,
    setPartModal,
    callParts,
    setCallParts,

    //ISSUEcanvas
    substoreIssueCanvas,
    setSubstoreIssueCanvas,
    //ISSUEcanvasId
    substoreCanvasId,
    setSubstoreCanvasId,
    //receive canvas
    substoreReceiveCanvas,
    setSubstoreReceiveCanvas,
    requisitionItemId,
    setRequisitionItemId,
    callRequisition,
    setCallRequisition,
    //dfuifudiu
    callSubstores,
    setCallSubstores,
    callNotifications,
    setCallNotifications,
    //Mail Composing
    isComposing,
    setIsComposing,
    mailID,
    setMailID,
    //headeeData
    headerData,
    setHeaderData,
    mailFolder,
    setMailFolder,
    emails,
    setEmails,
    selectedMailIds,
    setSelectedMailIds,
    selectedMail,
    setSelectedMail,
    chainMessages,
    setChainMessages,
    mailSendType,
    setMailSendType,
    resizeToggle,
    setResizeToggle,
    extendDetailsToggle,
    setExtendDetailsToogle,
    mailSearchData,
    setMailSearchData,

    //editor
    currentCommand,
    setCurrentCommand,

    //zoomable
    mailListWidth,
    setMailListWidth,
    mailDetailsWidth,
    setMailDetailsWidth,

    editorInstance,
    setEditorInstance,

    // mark mail

    markMail,
    setMarkMail,
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, passableParams);
    }
    return child;
  });

  useEffect(async () => {
    if (isAuthenticated) {
      getRolePermission();
    }
  }, []);

  return (
    <>
      {spinner && <Spinner />}
      {location.pathname === "/login" ? (
        <main>{childrenWithProps}</main>
      ) : (
        <div className="falgun_app">
          <Header {...passableParams} />
          <div className="falgun_app_body">
            <Sidebar {...passableParams} />
            <div className="falgun_app_content">
              <div className="all_pages">
                <main>{childrenWithProps}</main>
              </div>
            </div>
          </div>
        </div>
      )}
      <ScrollTo />
    </>
  );
};

export default FullLayout;
