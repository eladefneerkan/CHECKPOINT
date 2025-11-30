import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import GameObj from './models/GameObj.js';

const GamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Review state
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editRating, setEditRating] = useState(0);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const gameData = location.state?.game;

  const game = gameData ? new GameObj(
    gameData.id,
    gameData.name,
    gameData.slug,
    gameData.released,
    gameData.rating,
    gameData.description,
    gameData.background_image,
    gameData.genres
  ) : null;

  if (!game) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        <h2>Game not found☹️</h2>
        <button 
          onClick={() => navigate('/list')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          Back to Search
        </button>
      </div>
    );
  }

  const imageUrl = game.getImageDisplay();

  let genreList = "N/A";
  if (game.genres && Array.isArray(game.genres)) {
    genreList = game.genres.map(genre => genre.name).join(', ');
  }

  const parseDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    
    const yr = dateStr.substring(0, 4);
    const m = dateStr.substring(5, 7);
    const d = dateStr.substring(8, 10);
    let m_str = '';
    
    switch (m) {
      case '01': m_str = 'Jan'; break;
      case '02': m_str = 'Feb'; break;
      case '03': m_str = 'Mar'; break;
      case '04': m_str = 'Apr'; break;
      case '05': m_str = 'May'; break;
      case '06': m_str = 'Jun'; break;
      case '07': m_str = 'Jul'; break;
      case '08': m_str = 'Aug'; break;
      case '09': m_str = 'Sep'; break;
      case '10': m_str = 'Oct'; break;
      case '11': m_str = 'Nov'; break;
      case '12': m_str = 'Dec'; break;
      default: m_str = '';
    }
    return m_str + ' ' + d + ', ' + yr;
  };

  const getFullDescription = () => {
    if (!game.description) return 'No description available.';
    return game.description.replace(/<[^>]*>/g, '');
  };

  // Get token and user info
  const getToken = () => localStorage.getItem('token');
  const getCurrentUser = () => {
    const token = getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  };

  // Fetch reviews and average rating
  useEffect(() => {
    if (game) {
      fetchReviews();
      fetchAverageRating();
    }
  }, [game]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/game/${game.id}`);
      const data = await response.json();
      
      // Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.error('Reviews data is not an array:', data);
        setReviews([]);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviews([]);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/game/${game.id}/average`);
      const data = await response.json();
      setAverageRating(data.average);
      setReviewCount(data.count);
    } catch (err) {
      console.error('Error fetching average:', err);
    }
  };

  // Star rating helpers
  const renderStars = (rating, interactive = false, onClick = null, onHover = null) => {
    const stars = [];
    const displayRating = interactive ? (onHover && hoverRating > 0 ? hoverRating : rating) : rating;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = displayRating >= i;
      const isHalf = displayRating >= i - 0.5 && displayRating < i;
      
      stars.push(
        <span
          key={i}
          className={`star ${interactive ? 'star-interactive' : ''}`}
          onClick={() => interactive && onClick && onClick(i)}
          onMouseEnter={() => interactive && onHover && onHover(i)}
          onMouseLeave={() => interactive && onHover && onHover(0)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          {isFilled ? '⭐' : isHalf ? '✨' : '☆'}
        </span>
      );
    }
    return stars;
  };

  // Submit new review
  const handleSubmitReview = async () => {
    const token = getToken();
    if (!token) {
      setError('Please log in to leave a review');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!newReviewText.trim()) {
      setError('Please write a review');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (newReviewRating === 0) {
      setError('Please select a rating');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: game.id,
          gameName: game.name,
          rating: newReviewRating,
          reviewText: newReviewText
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Review submitted successfully!');
        setNewReviewText('');
        setNewReviewRating(0);
        fetchReviews();
        fetchAverageRating();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to submit review');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Error submitting review');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Edit review
  const handleEditReview = async (reviewId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reviewText: editText, rating: editRating })
      });

      if (response.ok) {
        setSuccess('Review updated!');
        setEditingReviewId(null);
        setEditText('');
        setEditRating(0);
        fetchReviews();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update review');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Error updating review');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setSuccess('Review deleted!');
        setShowDeleteConfirm(null);
        fetchReviews();
        fetchAverageRating();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete review');
        setTimeout(() => setError(''), 3000);
      }
    } catch (err) {
      setError('Error deleting review');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Upvote/Downvote
  const handleVote = async (reviewId, voteType) => {
    const token = getToken();
    if (!token) {
      setError('Please log in to upvote/downvote');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/reviews/${reviewId}/${voteType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  // Format date
  const formatReviewDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const currentUser = getCurrentUser();

  return (
    <section  style={{backgroundImage: "linear-gradient(to top, #430000ff, #000000ff)"}}>
    <div id="gamePage" className="fade-in" style={{ 
      
      padding: '0px',
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: '100vh',

      backgroundImage: "linear-gradient(to top, #430000ff, #000000ff)",
      color: 'white'
    }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          opacity: '1',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '20px'
        }}
      >
        ← Back
      </button>

      <div style={{
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)', //turn these red for a fun time
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          gap: '30px',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '0 0 300px' }}>
            <img 
              src={imageUrl} 
              alt={game.name} 
              style={{
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ 
              fontSize: '2.5rem', 
              marginTop: 0,
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              {game.name}
            </h1>

            <div style={{ fontSize: '1.1rem', lineHeight: '2' }}>
              <p>
                <b>Released:</b> {parseDate(game.released) || 'Unknown'}
              </p>
              
              <p>
                <b>Rating:</b> <span className={`rating-badge rating-${Math.floor(game.rating)}`}>
                  {game.rating || 'N/A'}
                </span>
              </p>
              
              <p>
                <b>Genres:</b> {genreList}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '30px'
        }}>
          <h2 style={{ 
            fontSize: '1.8rem',
            marginBottom: '15px',
            color: '#ffffff'
          }}>
            Description
          </h2>
          <p style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#e0e0e0',
            whiteSpace: 'pre-wrap'
          }}>
            {getFullDescription()}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews</h2>
          <div className="average-rating">
            {averageRating !== null ? (
              <>
                <span>Average User Rating: </span>
                {renderStars(averageRating)}
                <span className="rating-number">{averageRating}/5</span>
                <span className="review-count">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
              </>
            ) : (
              <span>Average User Rating: N/A</span>
            )}
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="submit-review-form">
          <h3>Leave a Review</h3>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="rating-input">
            <label>Your Rating:</label>
            <div className="star-rating-input">
              {renderStars(newReviewRating, true, setNewReviewRating, setHoverRating)}
              {newReviewRating > 0 && <span className="rating-label">{newReviewRating}/5</span>}
            </div>
          </div>

          <textarea
            className="review-text-input"
            placeholder="Write your review here... (max 1000 characters)"
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            maxLength={1000}
          />
          <div className="char-count">{newReviewText.length}/1000</div>

          <button className="submit-review-btn" onClick={handleSubmitReview}>
            Submit Review
          </button>
        </div>

        {/* Reviews List */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                {/* Review Header */}
                <div className="review-header">
                  <div className="review-user-info">
                    <img 
                      src={review.user.profilePicture} 
                      alt={review.user.username}
                      className="review-avatar"
                    />
                    <div>
                      <div className="review-username">{review.user.username}</div>
                      <div className="review-date">
                        {review.updatedAt && review.updatedAt !== review.createdAt 
                          ? `Edited ${formatReviewDate(review.updatedAt)}`
                          : formatReviewDate(review.createdAt)
                        }
                      </div>
                    </div>
                  </div>

                  {/* Three Dots Menu for Own Reviews */}
                  {currentUser && currentUser.id === review.user._id && (
                    <div className="review-menu">
                      <button 
                        className="menu-dots"
                        onClick={() => setShowMenu(showMenu === review._id ? null : review._id)}
                      >
                        ⋮
                      </button>
                      {showMenu === review._id && (
                        <div className="menu-dropdown">
                          <button onClick={() => {
                            setEditingReviewId(review._id);
                            setEditText(review.reviewText);
                            setEditRating(review.rating);
                            setShowMenu(null);
                          }}>
                            Edit
                          </button>
                          <button onClick={() => {
                            setShowDeleteConfirm(review._id);
                            setShowMenu(null);
                          }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Star Rating */}
                <div className="review-rating">
                  {renderStars(review.rating)}
                  <span className="rating-number">{review.rating}/5</span>
                </div>

                {/* Review Text */}
                {editingReviewId === review._id ? (
                  <div className="edit-review-form">
                    <div className="rating-input">
                      <label>Update Rating:</label>
                      <div className="star-rating-input">
                        {renderStars(editRating, true, setEditRating, setEditHoverRating)}
                        {editRating > 0 && <span className="rating-label">{editRating}/5</span>}
                      </div>
                    </div>
                    <textarea
                      className="review-text-input"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      maxLength={1000}
                    />
                    <div className="edit-actions">
                      <button 
                        className="save-btn"
                        onClick={() => handleEditReview(review._id)}
                      >
                        Save
                      </button>
                      <button 
                        className="cancel-btn"
                        onClick={() => {
                          setEditingReviewId(null);
                          setEditText('');
                          setEditRating(0);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="review-text">{review.reviewText}</p>
                )}

                {/* Vote Buttons */}
                <div className="review-votes">
                  <button 
                    className={`vote-btn upvote ${currentUser && review.upvotedBy?.includes(currentUser.id) ? 'active' : ''}`}
                    onClick={() => handleVote(review._id, 'upvote')}
                    disabled={currentUser && currentUser.id === review.user._id}
                    style={{ opacity: currentUser && currentUser.id === review.user._id ? 0.5 : 1, cursor: currentUser && currentUser.id === review.user._id ? 'not-allowed' : 'pointer' }}
                  >
                    ▲
                  </button>
                  <span className="vote-score">{review.score}</span>
                  <button 
                    className={`vote-btn downvote ${currentUser && review.downvotedBy?.includes(currentUser.id) ? 'active' : ''}`}
                    onClick={() => handleVote(review._id, 'downvote')}
                    disabled={currentUser && currentUser.id === review.user._id}
                    style={{ opacity: currentUser && currentUser.id === review.user._id ? 0.5 : 1, cursor: currentUser && currentUser.id === review.user._id ? 'not-allowed' : 'pointer' }}
                  >
                    ▼
                  </button>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm === review._id && (
                  <div className="delete-modal">
                    <div className="delete-modal-content">
                      <p>Are you sure you want to delete this review?</p>
                      <div className="delete-modal-actions">
                        <button 
                          className="confirm-delete-btn"
                          onClick={() => handleDeleteReview(review._id)}
                        >
                          Yes, Delete
                        </button>
                        <button 
                          className="cancel-delete-btn"
                          onClick={() => setShowDeleteConfirm(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </section>
  );
};

export default GamePage;
