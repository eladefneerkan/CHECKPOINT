
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authorize");
const reviewController = require("../controller/reviewController");

// Review routes
router.get("/game/:gameId", reviewController.getReviewsByGame);
router.get("/", reviewController.getRecentReviews);
router.get("/game/:gameId/average", reviewController.getAverageRating);
router.get("/user/:userId", reviewController.getReviewsByUser);

// Create, update, delete review routes
router.post("/", auth, reviewController.createReview);
router.put("/:reviewId", auth, reviewController.updateReview);
router.delete("/:reviewId", auth, reviewController.deleteReview);

// Voting routes
router.post("/:reviewId/upvote", auth, reviewController.upvoteReview);
router.post("/:reviewId/downvote", auth, reviewController.downvoteReview);

module.exports = router;
