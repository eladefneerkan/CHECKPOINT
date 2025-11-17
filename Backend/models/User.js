const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  bio: String,
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
