const express = require("express");
const router = express.Router();
const Game = require("../gamedb");

router.get("/Games", async (req, res) => {

    const query = req.query.q || "";

    if (!query) return res.status(400).json({ error: "query undefined"});

    try {
        const results = await Game.find(
        {name: new RegExp(`^${query}`, "i" )}
    ).limit(10);

    res.json(results);
    }catch (error) {
        res.status(500).json({ error: "server error"});
    }
});

module.exports = router;