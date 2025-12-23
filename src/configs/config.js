// var configEnv = "development";
// var configEnv = "staging";
var configEnv = "production";
// var configEnv = "orgserver";

var config = {
  //######### Staging config ##########
  orgserver: {
    appUrl: "https://erp.falgun.org",
    apiUrl: "https://erpapi.falgun.org/api",
    staticUrl: "https://erpapi.falgun.org/api",
    debug: true,
  },

  staging: {
    appUrl: "https://erp.falgun-garmenting.com",
    apiUrl: "https://erpapi.falgun-garmenting.com/api",
    staticUrl: "https://erpapi.falgun-garmenting.com/api",
    debug: true,
  },

  //######### Production Config ###########//
  production: {
    appUrl: "https://test.falgun-garmenting.com",
    apiUrl: "https://testapi.falgun-garmenting.com/api",
    staticUrl: "https://testapi.falgun-garmenting.com/api",
    debug: true,
  },
  //########## Local config ##########
  development: {
    appUrl: "http://localhost:3000",
    apiUrl: "http://localhost/erp-backend/public/api",
    staticUrl: "http://localhost/erp-backend/public/api",
    debug: true,
  },
};

var finalConfig = config[configEnv];
export default finalConfig;
