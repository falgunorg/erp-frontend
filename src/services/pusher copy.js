import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echoInstance = new Echo({
  broadcaster: "pusher",
  key: process.env.REACT_APP_PUSHER_APP_KEY, // Make sure to use your environment variable for the key
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || "mt1",
  wsHost: process.env.REACT_APP_PUSHER_APP_HOST || window.location.hostname,
  wsPort: process.env.REACT_APP_PUSHER_APP_PORT || 6001,
  forceTLS: process.env.REACT_APP_PUSHER_APP_USE_TLS === "true", // Use TLS based on environment variable
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

export default echoInstance;
