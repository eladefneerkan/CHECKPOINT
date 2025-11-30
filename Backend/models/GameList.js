const mongoose = require("mongoose");

const gameListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  coverImage: {
    type: String,
    default: "", // URL or base64 of custom cover image
  },
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GameList", gameListSchema);
