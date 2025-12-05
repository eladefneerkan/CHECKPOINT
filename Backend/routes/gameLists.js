const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");
const GameList = require("../models/GameList");
const User = require("../models/User");
const Game = require("../models/Games");

// POST: Create a new game list for the logged-in user
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const newList = new GameList({
      userId: req.user.id,
      title,
      description: description || "",
      isPublic: isPublic ?? false,
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
    console.error("Server Error:", err);
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

router.get("/public/user/:userId", async (req, res) => {
  try {
    const lists = await GameList.find({
      userId: req.params.userId,
      isPublic: true
    })
      .populate("games")
      .sort({ updatedAt: -1 });

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

    if (!list.isPublic && list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "List is private."})
    }

    /*
    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }*/

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
  // Populate games before responding so frontend has complete data
  const populatedList = await GameList.findById(req.params.listId).populate("games");


    res.json({
      message: "List updated successfully",
      list: populatedList,
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

    // Resolve Game document:
    // The frontend sends the external game `id` (number) from the RAW API,
    // while our Game documents use `_id` (ObjectId) as the primary key and
    // store the external id in the `id` field. Try to find by _id first,
    // then by numeric `id`. If not found, create a minimal Game doc so we
    // can reference it from the list.
    let game = null;
    try {
      game = await Game.findById(gameId);
    } catch (e) {
      // ignore invalid ObjectId cast errors
    }

    if (!game) {
      const numericId = Number(gameId);
      if (!Number.isNaN(numericId)) {
        game = await Game.findOne({ id: numericId });
      }
    }

    if (!game) {
      // create a minimal game record so lists can reference it
      const toCreate = {};
      const numericId = Number(gameId);
      if (!Number.isNaN(numericId)) toCreate.id = numericId;
      game = new Game(toCreate);
      await game.save();
    }

    // Check if game is already in the list (compare ObjectId strings)
    if (list.games.some((id) => id.toString() === game._id.toString())) {
      return res.status(400).json({ error: "Game already in list" });
    }

    list.games.push(game._id);
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

    // Try to find the game to remove by MongoDB _id or numeric id
    let gameToRemove = null;
    const gameIdParam = req.params.gameId;
    
    // First, try to match by MongoDB ObjectId
    try {
      gameToRemove = await Game.findById(gameIdParam);
    } catch (e) {
      // Not a valid ObjectId, continue
    }
    
    // If not found by _id, try to find by numeric id field
    if (!gameToRemove) {
      const numericId = Number(gameIdParam);
      if (!Number.isNaN(numericId)) {
        gameToRemove = await Game.findOne({ id: numericId });
      }
    }
    
    if (!gameToRemove) {
      return res.status(404).json({ error: "Game not found" });
    }

    // Remove game from list using the MongoDB _id
    list.games = list.games.filter(
      (id) => id.toString() !== gameToRemove._id.toString()
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

router.put("/:listId/privacy", auth, async (req, res) => {
  try {
    const { isPublic } = req.body;

    const list = await GameList.findById(req.params.listId);
    if (!list) return res.status(404).json({ error: "List not found" });

    if (list.userId.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    list.isPublic = isPublic;
    await list.save();

    res.json({ message: "Privacy updated", isPublic });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
