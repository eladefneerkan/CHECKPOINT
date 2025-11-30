const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/checkpoint";

if (!process.env.MONGODB_URI) {
  console.warn(
    "MONGODB_URI not set in environment - falling back to local MongoDB at",
    uri
  );
}

mongoose
  .connect(uri)
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => {
    console.error("connection error:", err && err.message ? err.message : err);
    process.exit(1);
  });

module.exports = mongoose;
