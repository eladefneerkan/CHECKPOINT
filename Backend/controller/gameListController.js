const gameListService = require("../services/gameListService");

const gameListController = {
    // Create a new game list
    async createGameList(req, res) {
        try {
            const userId = req.user.id;
            const { title, description, isPublic } = req.body;

            const newList = await gameListService.createGameList(userId, { title, description, isPublic });

            res.status(201).json({
                message: "Game list created successfully",
                list: newList,
            });
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Get all lists for the logged-in user
    async getGameListsForUser(req, res) {
        try {
            const userId = req.user.id;
            const lists = await gameListService.getGameListsForUser(userId);

            res.json(lists);
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
    // Get all public lists for a specific user

    async getPublicListsForUser(req, res) {
        try {
            const { userId } = req.params;
            const lists = await gameListService.getPublicListsForUser(userId);

            res.json(lists);
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Get a specific game list by its ID
    async getGameListById(req, res) {
        try {
            const { listId } = req.params;
            const userId = req.user.id;
            const list = await gameListService.getGameListById(listId, userId);

            res.json(list);
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Udate title, description, or privacy of a game list
    async updateGameList(req, res) {
        try {
            const { listId } = req.params;
            const userId = req.user.id;
            const { title, description, coverImage } = req.body;

            const updatedList = await gameListService.updateGameList(listId, userId, { title, description, coverImage });

            res.json({
                message: "Game list updated successfully",
                list: updatedList,
            });
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    //delete a game list
    async deleteGameList(req, res) {
        try {
            const { listId } = req.params;
            const userId = req.user.id;

            await gameListService.deleteGameList(listId, userId);

            res.json({ message: "Game list deleted successfully" });
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Add a game to a list
    async addGameToList(req, res) {
        try {
            const { listId } = req.params;
            const userId = req.user.id;
            const { gameId } = req.body;
        
            const updatedList = await gameListService.addGameToList(listId, userId, gameId);

            res.json({
                message: "Game added to list successfully",
                list: updatedList,
            });

        } catch (err) {
            res.status(err.status || 500).json({ error: err.message }); 
        }

    },

    // Remove a game from a list
    async removeGameFromList(req, res) {
        try {
            const { listId, gameId } = req.params;
            const userId = req.user.id; 

            const updatedList = await gameListService.removeGameFromList(listId, userId, gameId);

            res.json({
                message: "Game removed from list successfully",
                list: updatedList,
            });
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    //update list privacy
    async updateListPrivacy(req, res) {
        try {   
            const { listId } = req.params;
            const userId = req.user.id;
            const { isPublic } = req.body;

            const updatedList = await gameListService.updateListPrivacy(listId, userId, isPublic);

            res.json({
                message: "Game list privacy updated successfully",
                list: updatedList,
            });
        }
        catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};

module.exports = gameListController;