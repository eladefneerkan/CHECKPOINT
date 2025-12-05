// controllers/searchController.js

const gameService = require("../services/gameService");

//GET /search-games?q=...&genres=...&minRating=..
//Controller → Service → Model
exports.searchGames = async (req, res) => {
  const { q, genres, minRating, maxRating } = req.query;

  try {
    const results = await gameService.searchGames(
      q,
      genres,
      minRating,
      maxRating
    );

    return res.json(results);
  } catch (error) {
    console.error("Error in searchGames:", error);
    return res.status(500).json({
      error: "Internal Server Error during search.",
      message: error.message,
    });
  }
};

//POST /search-games/by-ids
//Body: { ids: [1,2,3] }
exports.getGamesByIds = async (req, res) => {
  try {
    const { ids } = req.body || {};

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json([]); //safe and fast
    }

    const results = await gameService.getGamesByIds(ids);
    return res.json(results);
  } catch (error) {
    console.error("Error in getGamesByIds:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
