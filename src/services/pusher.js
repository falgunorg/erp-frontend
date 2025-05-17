import Echo from "laravel-echo";
import Pusher from "pusher-js";
import finalConfig from "../configs/config";
import auth from "./auth";

window.Pusher = Pusher;
const accessToken = auth.getAccessToken();

const echoInstance = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_PUSHER_APP_KEY,
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
  wsHost: process.env.REACT_APP_PUSHER_APP_HOST || window.location.hostname,
  wsPort: process.env.REACT_APP_PUSHER_APP_PORT || 6001,
  forceTLS: process.env.REACT_APP_PUSHER_APP_USE_TLS === "true",
  disableStats: true,
  authEndpoint: finalConfig.apiUrl + "/broadcasting/auth",
  auth: {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  },
});

export default echoInstance;
