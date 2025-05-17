import React, { useEffect } from "react";

import ChatBot from "../../elements/chatbot/ChatBot";

export default function Chat(props) {
  useEffect(async () => {
    props.setHeaderData({
      pageName: "Chats",
      isModalButton: false,
      modalButtonRef: "",
      isNewButton: false,
      newButtonLink: "",
      isInnerSearch: false,
      innerSearchValue: "",
      isDropdown: false,
      DropdownMenu: [],
    });
  }, []);
  return <ChatBot />;
}
