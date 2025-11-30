const axios = require("axios");
const mongoose = require("./mongo");
const Game = require("./models/Games");

const apiKey = process.env.API_KEY;
// Configurable seeder: fetch multiple pages from RAWG API and upsert into MongoDB
const PAGE_SIZE = parseInt(process.env.RAWG_PAGE_SIZE || "40", 10);
const PAGES_TO_FETCH = parseInt(process.env.RAWG_PAGES || "50", 10); // number of pages to fetch
const DETAIL_CONCURRENCY = parseInt(process.env.RAWG_CONCURRENCY || "6", 10); // concurrent detail requests
const PAGE_DELAY_MS = parseInt(process.env.RAWG_PAGE_DELAY_MS || "300", 10);

// Helper: split array into chunks
function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function fetchGame() {
  let totalImported = 0;
  try {
    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      const url = `https://api.rawg.io/api/games?key=${apiKey}&page_size=${PAGE_SIZE}&page=${page}`;
      console.log(`Fetching RAWG page ${page} (page_size=${PAGE_SIZE})`);

      const listResp = await axios.get(url);
      const gameData = listResp.data.results || [];

      // Process details in batches to limit concurrency
      const batches = chunkArray(gameData, DETAIL_CONCURRENCY);
      for (const batch of batches) {
        const promises = batch.map(async (g) => {
          try {
            const detailUrl = `https://api.rawg.io/api/games/${g.id}?key=${apiKey}`;
            const detail = await axios.get(detailUrl).then((r) => r.data);

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
            return { ok: true };
          } catch (innerErr) {
            return { ok: false, err: innerErr, id: g.id, name: g.name };
          }
        });

        const results = await Promise.allSettled(promises);
        for (const r of results) {
          if (r.status === 'fulfilled') {
            const val = r.value;
            if (val && val.ok) totalImported++;
            else if (val && !val.ok) console.warn(`Failed import id=${val.id} name=${val.name}:`, val.err && val.err.message);
          } else {
            console.warn('Detail fetch promise rejected:', r.reason && r.reason.message);
          }
        }

        // Small pause between batches to reduce burst pressure
        await new Promise((r) => setTimeout(r, 50));
      }

      // Delay between pages
      await new Promise((r) => setTimeout(r, PAGE_DELAY_MS));
    }

    console.log(`Imported/updated ${totalImported} games from RAWG.`);
  } catch (error) {
    console.error("Error fetching or saving data:", error.message);
  }

  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
}

// Run the seeder when executed directly
fetchGame();
