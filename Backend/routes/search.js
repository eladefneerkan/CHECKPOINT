const express = require("express");
const router = express.Router();
const Game = require("../gamedb");

router.get("/Games", async (req, res) => {

    const query = req.query.q || "";

    if (!query.trim()) return res.json([]);

    try {
        const results = await Game.find(
        {name: new RegExp(query, "i" )},
        { id: 1, name: 1} // only returns name and id fields
    ).limit(10);

    res.json(results);
    }catch (error) {
        res.status(500).json({ error: "server error"});
    }
});

module.exports = router;