const express = require("express");
const router = express.Router();
const Game = require("../models/Games");

router.get("/Games", async (req, res) => {

    const query = req.query.q || "";
    const genres = req.query.genres || "";
    const minRating = req.query.minRating || "";
    const maxRating = req.query.maxRating || "";
    const sortByRating = req.query.sortByRating || "";
    const sortByDate = req.query.sortByDate || "";

    // If no query and no genres, return empty
    if (!query.trim() && !genres.trim()) return res.json([]);

    try {
        let searchCriteria = {};
    
        // Handle name search
        if (query.trim()) {
            const isSingleChar = query.length === 1;
            const regex = isSingleChar
                ? new RegExp(`^${query}`, "i")
                : new RegExp(query, "i");
            searchCriteria.name = regex;
        }

        // Handle genre filter
        if (genres.trim()) {
            const genreList = genres.split(',').map(g => g.trim());
            searchCriteria['genres.name'] = { $all: genreList };
        }

         // Handle rating filter
        if (minRating || maxRating) {
            searchCriteria.rating = {};
            if (minRating) searchCriteria.rating.$gte = parseFloat(minRating);
            if (maxRating) searchCriteria.rating.$lte = parseFloat(maxRating);
        }

        let sortOptions = {};
        
        if (sortByRating === 'desc') {
            sortOptions.rating = -1;
        } else if (sortByRating === 'asc') {
            sortOptions.rating = 1;
        }
        
        if (sortByDate === 'desc') {
            sortOptions.released = -1;
        } else if (sortByDate === 'asc') {
            sortOptions.released = 1;
        }

        const results = await Game.find(
            searchCriteria,
            { 
                id: 1, 
                name: 1, 
                slug: 1, 
                released: 1, 
                rating: 1, 
                description: 1, 
                background_image: 1, 
                genres: 1 
            }
        ).sort(sortOptions);

    res.json(results);
    }catch (error) {
        res.status(500).json({ error: "server error"});
    }
});

module.exports = router;