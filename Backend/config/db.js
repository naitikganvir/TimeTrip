const mongoose = require("mongoose");

let MONGO_DB = {
  production: { url: process.env.MONGODB_PROD_URL, type: "Atlas" },
  development: { url: process.env.MONGODB_DEV_URL, type: "Compass" },
};

let environment = process.env.ENVIRONMENT;

mongoose
  .connect(MONGO_DB[environment].url)
  .then(() => {
    console.log("Connected to Mongo DB", MONGO_DB[environment].type);
  })
  .catch(() => {
    console.log("Failed to connect to MongoDB");
  });

module.exports = mongoose.connection;
