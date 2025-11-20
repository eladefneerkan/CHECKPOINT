const express = require("express");
const router = express.Router();
const Game = require("../models/Games");

router.get("/Games", async (req, res) => {

    const query = req.query.q || "";

    if (!query.trim()) return res.json([]);

    try {
    
        // return games that start with that letter and increase the result limit.
        const isSingleChar = query.length === 1;
        const regex = isSingleChar
            ? new RegExp(`^${query}`, "i")
            : new RegExp(query, "i");
        const limit = isSingleChar ? 100 : 10;

        const results = await Game.find(
            { name: regex },
            { id: 1, name: 1 } // only returns name and id fields
        ).limit(limit);

    res.json(results);
    }catch (error) {
        res.status(500).json({ error: "server error"});
    }
});

module.exports = router;