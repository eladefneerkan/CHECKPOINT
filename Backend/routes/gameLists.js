const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");
const gameListController = require("../controller/gameListController");

// Game list routes
router.post("/", auth, gameListController.createGameList);
router.get("/", auth, gameListController.getGameListsForUser);
router.get("/public/user/:userId", gameListController.getPublicListsForUser);
router.get("/:listId", auth, gameListController.getGameListById);

// Additional routes for updating, deleting, and managing games in lists
router.put("/:listId", auth, gameListController.updateGameList);
router.delete("/:listId", auth, gameListController.deleteGameList);
router.post("/:listId/games", auth, gameListController.addGameToList);
router.delete("/:listId/games/:gameId", auth, gameListController.removeGameFromList);
router.put("/:listId/privacy", auth, gameListController.updateListPrivacy);
 
module.exports = router;