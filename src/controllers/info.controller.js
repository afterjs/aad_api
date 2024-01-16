const envConfig = require("../config/envConfig");

const getApiVersion = (req, res) => {
  return res.status(200).json({
    title: "WEBUILD API",
    message: "API INFORMATION",
    version: envConfig.app.version,
  });
};

const isApiAlive = (req, res) => {
  return res.status(200).json({
    message: "API STATUS",
    status: {
      message: "OK",
      "status-code": 200,
      timestamp: new Date().toISOString(),
    },
  });
};

const getApiInfo = (req, res) => {
  return res.status(200).json({
    message: "API STATUS",
    info: {
      message: "Current verion of the API",
      version: envConfig.app.version,
    },
    status: {
      message: "OK",
      "status-code": 200,
      timestamp: new Date().toISOString(),
    },
  });
};

module.exports = {
  getApiVersion,
  isApiAlive,
  getApiInfo,
};
