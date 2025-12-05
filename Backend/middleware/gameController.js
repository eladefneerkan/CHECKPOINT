// links routes to service layer for game search

const gameService = require('../services/gameService'); 

const searchGames = async (req, res) => {
    const { q, genres, minRating, maxRating } = req.query; 

    try {
        const results = await gameService.searchGames(q, genres, minRating, maxRating); 
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ 
            error: "Internal Server Error during search.",
            message: error.message 
        }); 
    }
};

// Controller: fetch games by an array of numeric ids (POST body { ids: [1,2,3] })
const getGamesByIds = async (req, res) => {
    try {
        const { ids } = req.body || {};
        if (!Array.isArray(ids) || ids.length === 0) return res.json([]);

        const results = await gameService.getGamesByIds(ids);
        return res.json(results);
    } catch (error) {
        console.error('Error in getGamesByIds:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

module.exports = { searchGames, getGamesByIds };