import React, { useState, useEffect } from "react";

export default function UserReviews({ userId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserReviews();
  }, [userId]);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/user/${userId}`);
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
      setLoading(false);
    }
  };



  const formatReviewDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#ffc107" : "#555",
            fontSize: "20px",
            marginRight: "2px",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "40px" }}>
        Loading reviews...
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div style={{ color: "#999", textAlign: "center", padding: "40px" }}>
        <p>No reviews yet. Start reviewing games to see them here!</p>
      </div>
    );
  }

  return (
    <div style={{ color: "white" }}>
      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            backgroundColor: "#2a2a2a",
            borderRadius: "8px",
            padding: "20px",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Game Name */}
          <h3
            style={{
              marginTop: 0,
              marginBottom: "12px",
              color: "#ffffff",
              fontSize: "1.3rem",
            }}
          >
            {review.gameName}
          </h3>

          {/* Rating */}
          <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            {renderStars(review.rating)}
            <span style={{ color: "#ffc107", fontSize: "16px", fontWeight: "bold" }}>
              {review.rating}/5
            </span>
          </div>

          {/* Review Text */}
          <p
            style={{
              color: "#e0e0e0",
              fontSize: "14px",
              lineHeight: "1.6",
              marginBottom: "12px",
              whiteSpace: "pre-wrap",
            }}
          >
            {review.reviewText}
          </p>

          {/* Review Date */}
          <div style={{ fontSize: "12px", color: "#999" }}>
            {review.updatedAt && review.updatedAt !== review.createdAt
              ? `Edited ${formatReviewDate(review.updatedAt)}`
              : formatReviewDate(review.createdAt)}
          </div>

          {/* Score */}
          <div
            style={{
              marginTop: "12px",
              fontSize: "13px",
              color: "#bbb",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>Score: {review.score}</span>
            <span style={{ color: "#666" }}>|</span>
            <span>{review.upvotedBy?.length || 0} upvotes</span>
            <span style={{ color: "#666" }}>|</span>
            <span>{review.downvotedBy?.length || 0} downvotes</span>
          </div>
        </div>
      ))}
    </div>
  );
}
