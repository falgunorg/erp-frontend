// msalConfig.js
import { PublicClientApplication } from "@azure/msal-browser";
const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
    authority: process.env.REACT_APP_MICROSOFT_AUTHORITY,
    redirectUri: process.env.REACT_APP_MICROSOFT_REDIRECT_URL,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);
