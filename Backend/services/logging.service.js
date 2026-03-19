const moment = require("moment-timezone");
const BackendLog = require("../models/backend-log.model");

const dbStream = {
  write: async (message) => {
    if (message.startsWith("OPTIONS")) return; // remove preflight logs with OPTIONS method

    console.log(message.replace("\n", "")); // Server logs

    // Example: "GET /user/login 200 68.474 ms - 6351"
    const regex = /^(\w+)\s(.+?)\s(\d{3})\s([\d.]+)\sms\s-\s(.*)$/;
    const match = message.trim().match(regex);

    if (match) {
      const [, method, path, status, responseTime, contentLength] = match;
      const log = {
        method,
        url: message.replace("\n", ""),
        path,
        status: parseInt(status),
        responseTime: parseFloat(responseTime),
        contentLength,
        formattedTimestamp: moment().tz("Asia/Kolkata").format("MMM DD hh:mm:ss A"),
      };
      try {
        await BackendLog.create(log);
      } catch (error) {
        console.log("Error occured while adding backend log");
      }
    }
  },
};

module.exports = dbStream;
