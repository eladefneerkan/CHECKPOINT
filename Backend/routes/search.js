const express = require("express");
const router = express.Router();
const { searchGames, getGamesByIds } = require("../controller/gameController");

// Search routes
router.get("/Games", searchGames);
router.post("/GamesByIds", getGamesByIds);

module.exports = router;