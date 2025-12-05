const reviewService = require('../services/reviewServices');

// Controller functions
const reviewController = {
    // Get all reviews for a specific game
    async getReviewsByGame(req, res) {
        try {
            const { gameId } = req.params;
            const reviews = await reviewService.getReviewsByGame(gameId);
            res.json(reviews);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Get recent reviews
    async getRecentReviews(req, res) {
        try {
            const reviews = await reviewService.getRecentReviews();
            res.json(reviews);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Get average rating for a specific game
    async getAverageRating(req, res) {
        try {
            const { gameId } = req.params;
            const averageData = await reviewService.getAverageRating(gameId);
            res.json(averageData);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Get all reviews by a specific user
    async getReviewsByUser(req, res) {
        try {
            const { userId } = req.params;
            const reviews = await reviewService.getReviewsByUser(userId);
            res.json(reviews);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Create a new review
    async createReview(req, res) {
        try {
            const userId = req.user.id;
            const { gameId, gameName, rating, reviewText } = req.body;
            const newReview = await reviewService.createReview(userId, { gameId, gameName, rating, reviewText });

            res.status(201).json(newReview);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Update an existing review
    async updateReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            const { rating, reviewText } = req.body;
            const updatedReview = await reviewService.updateReview(userId, reviewId, { rating, reviewText });

            res.json(updatedReview);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Delete a review
    async deleteReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            await reviewService.deleteReview(userId, reviewId);

            res.status(204).end();
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Upvote a review
    async upvoteReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            const updatedReview = await reviewService.upvoteReview(reviewId, userId);
            res.json(updatedReview);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },

    // Downvote a review
    async downvoteReview(req, res) {
        try {
            const userId = req.user.id;
            const { reviewId } = req.params;
            const updatedReview = await reviewService.downvoteReview(reviewId, userId);
            res.json(updatedReview);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.message });
        }
    },
};

module.exports = reviewController;