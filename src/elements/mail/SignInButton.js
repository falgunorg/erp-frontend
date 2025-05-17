import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "services/authConfig";

const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch((e) => {
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
      onClick={handleLogin}
    >
      Mail Sign In
    </button>
  );
};

export default SignInButton;
