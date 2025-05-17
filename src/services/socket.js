import config from "configs/config";
import auth from "services/auth";
import api from "services/api";
import io from "socket.io-client";

class Socket {
  constructor() {
    this.connect();
  }

  async ping() {
    if (this.isOpen()) {
      var accessToken = auth.getAccessToken();
      if (accessToken) {
        if (auth.isTokenExpired()) {
          console.log(
            "Access token present but expired. Need to refresh the token"
          );
          await api.refreshToken();
          accessToken = auth.getAccessToken();
        }
      }
      var data = { type: "ping", token: accessToken };
      this.client.emit("ping", accessToken);
      setTimeout(async () => {
        this.ping();
      }, 10000);
    } else {
      // console.log("Socket::Reconnecting");
      // this.connect();
      // this.ping();
    }
  }

  isOpen() {
    return this.client.connected;
  }

  addEventListeners() {
    this.client.on("connect", () => {
      this.clearTimeout();
      console.log("Socket::Connected ", this.client.id);
      this.ping();
    });

    this.client.on("connect_error", (error) => {
      console.log("Socket::Connection failed");
      // console.log(error);
      this.reconnect();
    });

    this.client.on("disconnect", (event) => {
      console.log("Socket::Close");
      this.reconnect();
    });
  }

  clearTimeout() {
    try {
      clearTimeout(this.timeout);
    } catch (ex) {}
  }

  reconnect() {
    console.log("Socket::Reconnecting");
    try {
      this.client.close();
    } catch (ex) {
      console.log("Closing attempt failed on previous connection");
    }
    this.timeout = setTimeout(() => {
      this.connect();
    }, 5000);
  }

  connect() {
    this.client = io(config.socketUrl, {
      transports: ["websocket"],
    });
    this.addEventListeners();
  }
}

var socket = new Socket();

export default socket;
