// Frontend/Profile.jsx (or Review.jsx)

import React from 'react'
import ReviewClass from '../Backend/Review.js'

function displayStars(star){
        var count = "";
        while (star > 0.5){
            
            count = count.concat("☀️");
            star = star -1;
        }
        if (star > 0){
            count = count.concat("🔅");
        }
        return(count);
        
    }
export default function AW() {
    
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
    )];
    
    const items = ["a", "b"];
    return (
        <div className="review-page-container">
            <h2 style={{ color: 'white'}}>Afterworld Page</h2>
            <> {myReviews.map((item) => (
                <div >
                    <p className="review">Review ID: {item.ID} Stars: {displayStars(item.rating)}</p>
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