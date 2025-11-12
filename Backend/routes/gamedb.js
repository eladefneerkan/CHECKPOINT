import mongoose from "mongoose"
import axios from "axios"
import dotenv from "dotenv"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/checkpoint_db";

mongoose.connect(uri)
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
});

const games = mongoose.model("Game", gameSchema);
const apiKey = process.env.API_KEY

const url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=5`;

try {
  const response = await axios.get(url);
  const games = response.data.results;

  // Insert or update games in MongoDB
  for (const g of games) {
    await Game.updateOne(
      { id: g.id },
      {
        name: g.name,
        released: g.released,
        rating: g.rating,
        id: g.id,
      },
      { upsert: true }
    );
  }

  console.log("🎮 Games added/updated successfully!");
} catch (error) {
  console.error("❌ Error fetching or saving data:", error.message);
}

mongoose.connection.close();



