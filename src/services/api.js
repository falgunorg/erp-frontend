import axios from "axios";
import auth from "services/auth";
import ls from "services/ls";
import config from "configs/config.js";
class Api {
  constructor() {
    this.apiurl = config.apiUrl;
  }

  firstTouch(url) {
    if (url.indexOf("http") !== 0) {
      url = this.apiurl + url;
    }
    return url;
  }

  finalTouch(url) {
    return url;
    // if (config.debug) {
    //   return url + "?XDEBUG_SESSION_START=netbeans-xdebug";
    // } else {
    //   return url;
    // }
  }

  async attachAuthorizeHeader(headers) {
    if (typeof headers !== "object") {
      headers = {};
    }
    var accessToken = auth.getAccessToken();
    if (accessToken) {
      if (auth.isTokenExpired()) {
        await this.refreshToken();
        accessToken = auth.getAccessToken();
      }
      headers.Authorization = "Bearer " + accessToken;
    }
    var language = ls.get("language");
    if (!language) {
      language = config.defaultLanguage;
    }
    headers["X-Request-Language"] = language?.code;

    var geoexception = ls.get("geoexception");
    if (geoexception) {
      headers["X-GeoRestriction-Exception-Accepted"] = geoexception;
    }
    return headers;
  }

  parseParams(url, params) {
    url = this.firstTouch(url);
    let regexp;
    if (typeof params !== "object") {
      return url;
    }
    for (let [key, value] of Object.entries(params)) {
      if ((value || value === 0) && value.toString().length) {
        regexp = new RegExp("/:" + key + "(/|$)", "g");
        url = url.replace(regexp, "/" + value + "$1");
      }
    }
    //remove the trailing slash
    if (url.substr(-1, 1) === "/") {
      url = url.substr(0, url.length - 1);
    }

    //remove trailing variables if they are not already filled
    regexp = new RegExp("/:([^/])+($)", "g");
    while (url.match(regexp)) {
      url = url.replace(regexp, "");
    }
    //if any variable in the middle of url is not set, then replace with null
    regexp = new RegExp("/:([^/])+/", "g");
    while (url.match(regexp)) {
      url = url.replace(regexp, "/null/");
    }

    return url;
  }

  async get(url, getParams, headers, retrying) {
    if (retrying === undefined) {
      retrying = false;
    }
    try {
      headers = await this.attachAuthorizeHeader(headers);
      url = this.firstTouch(url);
      url = this.finalTouch(url);
      const response = await axios.get(url, {
        params: getParams,
        headers: headers,
      });
      return response;
    } catch (error) {
      if (!retrying && error.response && error.response.status === 401) {
        await this.refreshToken();
        return await this.get(url, getParams, headers, true);
      }
      return this.formatErrorResponse(error);
    }
  }
  //
  async post(url, postData, headers, onProgress, getParams, retrying) {
    if (retrying === undefined) {
      retrying = false;
    }
    try {
      headers = await this.attachAuthorizeHeader(headers);
      url = this.firstTouch(url);
      url = this.finalTouch(url);
      const response = await axios.post(url, postData, {
        params: getParams,
        headers: headers,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent);
          }
        },
      });
      return response;
    } catch (error) {
      if (!retrying && error.response && error.response.status === 401) {
        await this.refreshToken();
        return await this.post(
          url,
          postData,
          headers,
          onProgress,
          getParams,
          true
        );
      }
      return this.formatErrorResponse(error);
    }
  }

  async download(url) {
    try {
      var accessToken = auth.getAccessToken();
      if (accessToken) {
        if (auth.isTokenExpired()) {
          console.log(
            "Access token present but expired. Need to refresh the token"
          );
          await this.refreshToken();
          accessToken = auth.getAccessToken();
        }
      }
      if (accessToken) {
        url = this.firstTouch(url);
        url = this.finalTouch(url);
        if (url.indexOf("?") !== -1) {
          url = url + "&rnd=" + accessToken;
        } else {
          url = url + "?rnd=" + accessToken;
        }
        var newWindow = window.open(url, "_blank");
        // newWindow.close();
        return true;
      }
    } catch (error) {
      return error;
    }
  }

  formatErrorResponse(error) {
    console.log("error", error);
    if (error.response) {
      return error.response;
    } else {
      return {
        status: 503,
        data: {
          error: "Service unavailable",
          details: "The API server is not reachable or not responding",
        },
      };
    }
  }

  async refreshToken() {
    try {
      var refreshToken = auth.getRefreshToken();

      if (refreshToken) {
        var url = "/refresh_token";
        url = this.firstTouch(url);
        url = this.finalTouch(url);
        var postData = { token: refreshToken };
        var response = await axios.post(url, postData); //cannot use this.post. Will create infinite loop
        if (response.status === 200) {
          auth.login(response.data);
          return true;
        } else if (response.status === 401) {
          console.log("Refresh token invalid or expired");
          auth.logout();
          return false;
        }
      } else {
        console.log("Refresh token not found");
        auth.logout();
        return false;
      }
    } catch (error) {
      console.log("Error refreshing token");
      console.log(error);
      if (error.response.status === 401) {
        auth.logout();
      }
      return false;
    }
  }
}

export default new Api();
