const axios = require("axios");

const SERVER_URL = process.env.SERVER_URL;
const interval = process.env.RELOAD_INTERVAL;

function reloadWebsite() {
  axios
    .get(SERVER_URL + "/reload")
    .then((response) => {})
    .catch((error) => {
      console.log("Error reloading server");
    });
}

function keepServerRunning() {
  setInterval(reloadWebsite, 60000 * interval);
}

module.exports = keepServerRunning;
