// Frontend/Profile.jsx (or Review.jsx)

import React from 'react'
import ReviewClass from '../Backend/Review.js'

export default function ReviewModel() {
  
    //mock review
    const myReview = new ReviewClass(
        1,                         // ID
        "Great game!",             // comment
        5,                         // rating
        123                        // gameID
    );

    return (
        <div className="review-page-container">
            <h2>This is the Review page</h2>
            <p>Review ID: {myReview.ID}</p>
      
            <img 
                src={myReview.displayGameImage()} 
                alt={`Image for Game ID ${myReview.gameID}`} 
                className="review-game-image"
            />
            <p>Comment: {myReview.comment}</p>
        </div>
    )
}
