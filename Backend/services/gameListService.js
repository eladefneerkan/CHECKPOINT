const GameList = require("../models/GameList");
const User = require("../models/User");
const Game = require("../models/Games");

// Service functions
const gameListService = {
    // Create a new game list for the logged-in user
    async createGameList(userId, { title, description, isPublic }) {

        if (!title || title.trim() === "") {
            throw { status: 400, message: "Title is required" };
        }

        const newList = new GameList({
            userId,
            title,
            description: description || "",
            isPublic: isPublic ?? false,
            games: [],
        });

        await newList.save();

        // Add list reference to user's lists array
        await User.findByIdAndUpdate(
            userId,
            { $push: { lists: newList._id } },
            { new: true }
        );
        
        return newList;
    },

    // Fetch all lists for a current user
    async getGameListsForUser(userId) {
        const lists = await GameList.find({ userId }).populate("games").sort({ createdAt: -1 });
        return lists;
    },

    // Fetch all public lists for a specific user
    async getPublicListsForUser(userId) {
        const lists = await GameList.find({
            userId,
            isPublic: true
        }).populate("games").sort({ createdAt: -1 });

        return lists;
    },

    // Fetch a specific game list by its ID
    async getGameListById(listId, userId) {
        const list = await GameList.findById(listId).populate("games");

        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }
        if (!list.isPublic && list.userId.toString() !== userId) {
            throw { status: 403, message: "List is private" };
        }

        return list;
    },

    // Update list title, description, and/or cover image
    async updateGameList(listId, userId, { title, description, coverImage }) {
        const list = await GameList.findById(listId);
        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }

        if (list.userId.toString() !== userId) {
            throw { status: 403, message: "Unauthorized" };
        }

        if (title !== undefined) list.title = title;
        if (description !== undefined) list.description = description;
        if (coverImage !== undefined) list.coverImage = coverImage;
        list.updatedAt = Date.now();

        await list.save();
        // Populate games before responding so frontend has complete data
        const populatedList = await GameList.findById(listId).populate("games");

        return populatedList;
    },

    // Delete a game list
    async deleteGameList(listId, userId) {
        const list = await GameList.findById(listId);

        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }

        // Check ownership
        if (list.userId.toString() !== userId) {
            throw { status: 403, message: "Unauthorized" };
        }

        await GameList.findByIdAndDelete(listId);

        // Remove list reference from user's lists array
        await User.findByIdAndUpdate(
            userId,
            { $pull: { lists: listId } },
            { new: true }
        );
    },

    // Add a game to a list
    async addGameToList(listId, userId, gameId) {
        if (!gameId) {
            throw { status: 400, message: "Game ID is required" };
        }

        const list = await GameList.findById(listId);

        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }

        // Check ownership
        if (list.userId.toString() !== userId) {
            throw { status: 403, message: "Unauthorized" };
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
            throw { status: 400, message: "Game already in list" };
        }

        list.games.push(game._id);
        list.updatedAt = Date.now();

        await list.save();

        const updatedList = await GameList.findById(listId).populate("games");

        return updatedList;
    },

    // Remove a game from a list
    async removeGameFromList(listId, userId, gameId) {
        const list = await GameList.findById(listId);

        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }

        // Check ownership
        if (list.userId.toString() !== userId) {
            throw { status: 403, message: "Unauthorized" };
        }
        
        let gameToRemove = null;

        // First, try to match by MongoDB ObjectId
        try {
            gameToRemove = await Game.findById(gameId);
        } catch (e) {
            // Not a valid ObjectId, continue
        }

        // If not found by _id, try to find by numeric id field
        if (!gameToRemove) {
            const numericId = Number(gameId);
            if (!Number.isNaN(numericId)) {
                gameToRemove = await Game.findOne({ id: numericId });
            }
        }
   
        if (!gameToRemove) {
            throw { status: 404, message: "Game not found" };
        }
    
        // Remove game from list using the MongoDB _id
        list.games = list.games.filter((id) => id.toString() !== gameToRemove._id.toString());
    
        list.updatedAt = Date.now();
        await list.save();

        const updatedList = await GameList.findById(listId).populate("games");

        return updatedList;
    },

    // Update list privacy
    async updateListPrivacy(listId, userId, isPublic) {
        const list = await GameList.findById(listId);
        if (!list) {
            throw { status: 404, message: "Game list not found" };
        }

        if (list.userId.toString() !== userId) {
            throw { status: 403, message: "Unauthorized" };
        }

        list.isPublic = isPublic;
        await list.save();

        return list;
    }
};

module.exports = gameListService;





