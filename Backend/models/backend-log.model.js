const mongoose = require("mongoose");

const BackendLogSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  contentLength: {
    type: String,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  formattedTimestamp: {
    type: String,
  },
});

const BackendLog = mongoose.model("BackendLog", BackendLogSchema);

module.exports = BackendLog;
