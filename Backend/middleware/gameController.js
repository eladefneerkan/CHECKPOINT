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

module.exports = { searchGames };