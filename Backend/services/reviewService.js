const Review = require("../models/review");

const reviewService = {
    // Get all reviews for a specific game
    async getReviewsByGame(gameId) {
        const reviews = await Review.find({ gameId: Number(gameId) })
            .populate("user", "username profilePicture")
            .sort({ score: -1, createdAt: -1 });
        return reviews;
    },

    // Get recent reviews with optional limit
    async getRecentReviews(limit = 6) {
        const reviews = await Review.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        return reviews;
    },

    // Get average rating for a specific game
    async getAverageRating(gameId) {
        const reviews = await Review.find({ gameId: Number(gameId) });

        if (reviews.length === 0) {
            return { average: null, count: 0 };
        }

        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const average = sum / reviews.length;
        
        return {
            average: Math.round(average * 10) / 10,
            count: reviews.length,
        };
    },

    // Get all reviews by a specific user
    async getReviewsByUser(userId) {
        const reviews = await Review.find({ user: userId })
            .sort({ createdAt: -1 });
        return reviews;
    },
    // Create a new review
    async createReview(userId, { gameId, gameName, rating, reviewText }) {
        // Validation
        if (!gameId || !gameName || rating === undefined || !reviewText) {
            throw {
                status: 400,
                message: "Missing required fields: gameId, gameName, rating, reviewText",
            };
        }
        if (rating < 0 || rating > 5) {
            throw { status: 400, message: "Rating must be between 0 and 5" };
        }

        if (reviewText.length > 1000) {
            throw { status: 400, message: "Review text must be 1000 characters or less" };
        }

        // Check for duplicate review
        const existingReview = await Review.findOne({
            user: userId,
            gameId: Number(gameId),
        });

        if (existingReview) {
            throw {
                status: 409,
                message: "You have already reviewed this game. You can edit your review instead.",
            };
        }

        // Create new review
        const newReview = new Review({
            user: userId,
            gameId: Number(gameId),
            gameName,
            rating: Number(rating),
            reviewText,
        });
        await newReview.save();
        await newReview.populate("user", "username profilePicture");

        return newReview;
    },

    // Update an existing review
    async updateReview(reviewId, userId, { rating, reviewText }) {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw { status: 404, message: "Review not found" };
        }
        // Check ownership
        if (review.user.toString() !== userId) {
            throw { status: 403, message: "You can only edit your own reviews" };
        }
        // Validation
        if (rating !== undefined && (rating < 0 || rating > 5)) {
            throw { status: 400, message: "Rating must be between 0 and 5" };
        }
        if (reviewText && reviewText.length > 1000) {
            throw { status: 400, message: "Review text must be 1000 characters or less" };
        }

        // Update fields
        if (rating !== undefined) review.rating = Number(rating);
        if (reviewText) review.reviewText = reviewText;
    review.updatedAt = Date.now();

        await review.save();
        await review.populate("user", "username profilePicture");
        return review;
    },

    // Delete a review
    async deleteReview(reviewId, userId) {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw { status: 404, message: "Review not found" };
        }
        // Check ownership
        if (review.user.toString() !== userId) {
            throw { status: 403, message: "You can only delete your own reviews" };
        }
        await Review.findByIdAndDelete(reviewId);
    },

    // Upvote a review
    async upvoteReview(reviewId, userId) {
        const review = await Review.findById(reviewId);
        if (!review) {
            throw { status: 404, message: "Review not found" };
        }

        const alreadyUpvoted = review.upvotedBy.includes(userId);
        const alreadyDownvoted = review.downvotedBy.includes(userId);
        if (alreadyUpvoted) {
        // Remove upvote
            review.upvotedBy = review.upvotedBy.filter((id) => id.toString() !== userId);
            review.score -= 1;
        } else {
        // Add upvote
            review.upvotedBy.push(userId);
            review.score += 1;

            // Remove downvote if exists
            if (alreadyDownvoted) {
                review.downvotedBy = review.downvotedBy.filter((id) => id.toString() !== userId);
                review.score += 1;
            }
        }
        await review.save();
        await review.populate("user", "username profilePicture");

        return review;
    },
    // Downvote a review
    async downvoteReview(reviewId, userId) {
        const review = await Review.findById(reviewId);

        if (!review) {
            throw { status: 404, message: "Review not found" };
        }
        const alreadyUpvoted = review.upvotedBy.includes(userId);
        const alreadyDownvoted = review.downvotedBy.includes(userId);

        if (alreadyDownvoted) {
        // Remove downvote
            review.downvotedBy = review.downvotedBy.filter((id) => id.toString() !== userId);
            review.score += 1;
        } else {
        // Add downvote
            review.downvotedBy.push(userId);
            review.score -= 1;

        // Remove upvote if exists
            if (alreadyUpvoted) {
                review.upvotedBy = review.upvotedBy.filter((id) => id.toString() !== userId);
                review.score -= 1;
            }
        }

        await review.save();
        await review.populate("user", "username profilePicture");

        return review;
    },
};

module.exports = reviewService;
