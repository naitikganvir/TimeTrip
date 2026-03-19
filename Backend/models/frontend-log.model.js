const mongoose = require("mongoose");

const FrontendLogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  formattedTimestamp: {
    type: String,
  },
  params: {
    type: [
      {
        _id: false,
        key: String,
        value: String,
      },
    ],
    default: undefined,
  },
});

const FrontendLog = mongoose.model("FrontendLog", FrontendLogSchema);

module.exports = FrontendLog;
