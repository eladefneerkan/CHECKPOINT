const mongoose = require("mongoose");

// Schema
const gameSchema = new mongoose.Schema({
  id: Number,
  name: String,
  slug: String,
  released: String,
  rating: Number,
  description: String,
  background_image: String,
  genres: [{id: Number, name: String}]
});

module.exports =  mongoose.models.Game || mongoose.model("Game", gameSchema);