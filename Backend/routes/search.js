const express = require("express");
const router = express.Router();
const { searchGames, getGamesByIds } = require("../middleware/gameController");

router.get("/Games", searchGames);
router.post("/GamesByIds", getGamesByIds);

module.exports = router;