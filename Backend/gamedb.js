const axios = require("axios");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db";

async function fetchGame() {
  await mongoose.connect(uri)
    .then(() => console.log("mdb connected"))
    .catch((err) => {
      console.error("mdb connection error:", err);
      process.exit(1);
    });

  const gameSchema = new mongoose.Schema({
    id: Number,
    name: String,
    slug: String,
    games_counts: Number,
    released: String,
    rating: Number
  });

  const Game = mongoose.model("Game", gameSchema);  // ✅ Mongoose model

  const apiKey = process.env.API_KEY;
  const url = `https://api.rawg.io/api/games?key=${apiKey}&page=5`;

  try {
    const gameData = (await axios.get(url)).data.results;  // ✅ API results

    for (const g of gameData) {
      await Game.updateOne(
        { id: g.id },
        {
          id: g.id,
          name: g.name,
          released: g.released,
          rating: g.rating
        },
        { upsert: true }
      );
    }

    console.log("🎮 Games added/updated successfully!");
  } catch (error) {
    console.error("❌ Error fetching or saving data:", error.message);
  }

  mongoose.connection.close();
}

fetchGame();


