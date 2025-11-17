const express = require("express");
const router = express.Router();
const game = require("../gamedb");

router.get("/search", async (req, res) => {

    const query = req.query.q || "";

    if (!query) return res.status(400).json({ error: "query undefined"});

    try {
        const results = await game.find(
        {name: new RegExp(`^${query}`, "i" )}
    ).limt(10);

    res.json(results);
    }catch (error) {
        res.status(500).json({ error: "server error"});
    }
});

module.exports = router;
