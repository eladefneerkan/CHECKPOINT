// Frontend/Profile.jsx (or Review.jsx)

import React from 'react'
import ReviewClass from '../Backend/Review.js'


export default function ReviewModel() {
    
    //mock review list
    const myReviews= [new ReviewClass(
        1,                         // ID
        "Great game!a aaaasdfds fdsfdsafdsadsfd fdsa fdsf dsfadsf sdf sdf sdf sd afdasfdsaasdfsadfdasf dfdsa fdsa",             // comment
        5,                         // rating
        123                        // gameID
    ),
    new ReviewClass(
        2,                         // ID
        "Ok game!",             // comment
        3,                         // rating
        123                        // gameID
    ),
    new ReviewClass(
        3,                         // ID
        "Great game!",             // comment
        4.5,                         // rating
        123                        // gameID
    )];
    
    const items = ["a", "b"];
    return (
        <div className="review-page-container">
            <h2 style={{ color: 'white'}}>This is the Review page</h2>
            <> {myReviews.map((item) => (
                <div >
                    <p className="review">Review ID: {item.ID} Stars: {item.displayStars(item.rating)}</p>
                    <>
                        <img 
                        src={item.displayGameImage()} 
                        alt={`Image for Game ID ${item.gameID}`} 
                        className="review-game-image"
                        />
                    
                        <p className="reviewTxt">Comment: {item.comment}</p>
                        <p>/n</p>
                    </>
                    
                </div>))}
            </>
            </div>
  
    )
}

/**/