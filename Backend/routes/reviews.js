
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/authorize");

// GET all reviews for a specific game
router.get("/game/:gameId", async (req, res) => {
  try {
    const { gameId } = req.params;

    const reviews = await Review.find({ gameId: Number(gameId) })
      .populate("user", "username profilePicture")
      .sort({ score: -1, createdAt: -1 }); // Highest score first, then most recent

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET average rating for a specific game
router.get("/game/:gameId/average", async (req, res) => {
  try {
    const { gameId } = req.params;

    const reviews = await Review.find({ gameId: Number(gameId) });

    if (reviews.length === 0) {
      return res.json({ average: null, count: 0 });
    }

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = sum / reviews.length;

    res.json({
      average: Math.round(average * 10) / 10, // Round to 1 decimal place
      count: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all reviews by a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create a new review (requires authentication)
router.post("/", auth, async (req, res) => {
  try {
    const { gameId, rating, reviewText } = req.body;

    // Validation
    if (!gameId || rating === undefined || !reviewText) {
      return res.status(400).json({
        error: "Missing required fields: gameId, rating, reviewText",
      });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 0 and 5",
      });
    }

    if (reviewText.length > 1000) {
      return res.status(400).json({
        error: "Review text must be 1000 characters or less",
      });
    }

    // Check if user already reviewed this game
    const existingReview = await Review.findOne({
      user: req.user.id,
      gameId: Number(gameId),
    });

    if (existingReview) {
      return res.status(409).json({
        error: "You have already reviewed this game. You can edit your review instead.",
      });
    }

    // Create new review
    const newReview = new Review({
      user: req.user.id,
      gameId: Number(gameId),
      rating: Number(rating),
      reviewText,
    });

    await newReview.save();

    // Populate user data before sending response
    await newReview.populate("user", "username profilePicture");

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update an existing review (requires authentication)
router.put("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;

    // Find the review
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You can only edit your own reviews",
      });
    }

    // Validation
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        error: "Rating must be between 0 and 5",
      });
    }

    if (reviewText && reviewText.length > 1000) {
      return res.status(400).json({
        error: "Review text must be 1000 characters or less",
      });
    }

    // Update fields
    if (rating !== undefined) review.rating = Number(rating);
    if (reviewText) review.reviewText = reviewText;
    review.updatedAt = Date.now();

    await review.save();
    await review.populate("user", "username profilePicture");

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a review (requires authentication)
router.delete("/:reviewId", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if the user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        error: "You can only delete your own reviews",
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upvote a review (requires authentication)
router.post("/:reviewId/upvote", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user already upvoted
    const alreadyUpvoted = review.upvotedBy.includes(userId);
    const alreadyDownvoted = review.downvotedBy.includes(userId);

    if (alreadyUpvoted) {
      // Remove upvote
      review.upvotedBy = review.upvotedBy.filter(id => id.toString() !== userId);
      review.score -= 1;
    } else {
      // Add upvote
      review.upvotedBy.push(userId);
      review.score += 1;

      // If user previously downvoted, remove downvote
      if (alreadyDownvoted) {
        review.downvotedBy = review.downvotedBy.filter(id => id.toString() !== userId);
        review.score += 1; // Remove the -1 from downvote
      }
    }

    await review.save();
    await review.populate("user", "username profilePicture");

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST downvote a review (requires authentication)
router.post("/:reviewId/downvote", auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user already downvoted
    const alreadyUpvoted = review.upvotedBy.includes(userId);
    const alreadyDownvoted = review.downvotedBy.includes(userId);

    if (alreadyDownvoted) {
      // Remove downvote
      review.downvotedBy = review.downvotedBy.filter(id => id.toString() !== userId);
      review.score += 1;
    } else {
      // Add downvote
      review.downvotedBy.push(userId);
      review.score -= 1;

      // If user previously upvoted, remove upvote
      if (alreadyUpvoted) {
        review.upvotedBy = review.upvotedBy.filter(id => id.toString() !== userId);
        review.score -= 1; // Remove the +1 from upvote
      }
    }

    await review.save();
    await review.populate("user", "username profilePicture");

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
