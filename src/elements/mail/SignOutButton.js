import React from "react";
import { useMsal } from "@azure/msal-react";

const SignOutButton = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  return (
    <button
      style={{
        width: "100%",
        background: "none",
        border: "none",
        boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.3)",
        padding: "5px 12px",
      }}
      onClick={handleLogout}
    >
      Mail Sign Out
    </button>
  );
};

export default SignOutButton;
