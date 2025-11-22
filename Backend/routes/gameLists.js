const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");
const GameList = require("../models/GameList");
const User = require("../models/User");
const Game = require("../models/Games");

// POST: Create a new game list for the logged-in user
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const newList = new GameList({
      userId: req.user.id,
      title,
      description: description || "",
      games: [],
    });

    await newList.save();

    // Add list reference to user's lists array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { lists: newList._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Game list created successfully",
      list: newList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all lists for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const lists = await GameList.find({ userId: req.user.id })
      .populate("games")
      .sort({ createdAt: -1 });

    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch a specific list by ID (with populated games)
router.get("/:listId", auth, async (req, res) => {
  try {
    const list = await GameList.findById(req.params.listId).populate("games");

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update list title, description, and/or cover image
router.put("/:listId", auth, async (req, res) => {
  try {
    const { title, description, coverImage } = req.body;

    const list = await GameList.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (title) list.title = title;
    if (description !== undefined) list.description = description;
    if (coverImage !== undefined) list.coverImage = coverImage;
    list.updatedAt = Date.now();

    await list.save();

    res.json({
      message: "List updated successfully",
      list,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Delete a list
router.delete("/:listId", auth, async (req, res) => {
  try {
    const list = await GameList.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await GameList.findByIdAndDelete(req.params.listId);

    // Remove list reference from user's lists array
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { lists: req.params.listId } },
      { new: true }
    );

    res.json({ message: "List deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a game to a list
router.post("/:listId/games", auth, async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({ error: "Game ID is required" });
    }

    const list = await GameList.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Check if game exists
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Check if game is already in the list
    if (list.games.includes(gameId)) {
      return res.status(400).json({ error: "Game already in list" });
    }

    list.games.push(gameId);
    list.updatedAt = Date.now();

    await list.save();

    const updatedList = await GameList.findById(req.params.listId).populate(
      "games"
    );

    res.json({
      message: "Game added to list successfully",
      list: updatedList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a game from a list
router.delete("/:listId/games/:gameId", auth, async (req, res) => {
  try {
    const list = await GameList.findById(req.params.listId);

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Remove game from list
    list.games = list.games.filter(
      (id) => id.toString() !== req.params.gameId
    );
    list.updatedAt = Date.now();

    await list.save();

    const updatedList = await GameList.findById(req.params.listId).populate(
      "games"
    );

    res.json({
      message: "Game removed from list successfully",
      list: updatedList,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
