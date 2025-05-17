const { override, addBabelPlugins, useBabelRc } = require("customize-cra");
module.exports = override(useBabelRc());
