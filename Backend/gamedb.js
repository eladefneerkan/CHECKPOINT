const axios = require("axios");
const mongoose = require("./mongo");
const Game = require("./models/Games");

const apiKey = process.env.API_KEY;
const url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=40&page=50`;

async function fetchGame() {
  try {
  
  // Fetch data from RAWG API
    const gameData = (await axios.get(url)).data.results;

    for (const g of gameData) {
      const detailUrl = `https://api.rawg.io/api/games/${g.id}?key=${apiKey}`;
      const detail = await axios.get(detailUrl).then(r => r.data);

      await Game.updateOne(
        { id: g.id },
        {
          id: g.id,
          name: g.name,
          rating: g.rating,
          released: g.released,
          slug: g.slug,
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
   await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
}
fetchGame();
