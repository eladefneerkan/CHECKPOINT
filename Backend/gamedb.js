const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db";


async function fetchGame() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
    console.log("mdb connected");
  } catch (err) {
    console.error("mdb connection error:", err);
    process.exit(1);
  }

  // Schema
  const gameSchema = new mongoose.Schema({
    id: Number,
    name: String,
    released: String,
    rating: Number,
    description: String,
    background_image: String,
    slug: String,
    genres: [{id: Number, name: String}]
  });

  const Game = mongoose.models.Game || mongoose.model("Game", gameSchema);

  // Fetch data from RAWG API
  const apiKey = process.env.API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=40&page=1000`;

  try {
    const gameData = (await axios.get(url)).data.results;

    for (const g of gameData) {
      const detailUrl = `https://api.rawg.io/api/games/${g.id}?key=${apiKey}`;
      const detail = await axios.get(detailUrl).then(r => r.data);

      await Game.updateOne(
        { id: g.id },
        {
          id: g.id,
          name: g.name,
          slug: g.slug,
          released: g.released,
          rating: g.rating,
          background_image: g.background_image,
          genres: g.genres,
          description: detail.description_raw || "No description available."
        },
        { upsert: true }
      );

    }

    console.log(" Games added/updated successfully!");
  } catch (error) {
    console.error(" Error fetching or saving data:", error.message);
  }

  mongoose.connection.close();
}

fetchGame();


