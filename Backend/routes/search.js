const express = require("express");
const router = express.Router();
const { searchGames } = require("../middleware/gameController");

router.get("/Games", searchGames);

module.exports = router;