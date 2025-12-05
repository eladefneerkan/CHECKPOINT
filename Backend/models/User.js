const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  bio: String,
  profilePicture: String,
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameList",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  emailVerificationCode: String,
  emailVerificationExpiry: Date,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]


});

// Add index on username for faster searches
UserSchema.index({ username: 1 });

module.exports = mongoose.model("User", UserSchema);
