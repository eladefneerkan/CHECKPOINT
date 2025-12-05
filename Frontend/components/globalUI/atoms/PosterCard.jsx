
import React, { useState } from 'react';
import Flag from '../../../../assets/Flag.png';

// This component represents a single poster and its review box.
export default function PosterCard({ game, gameName, rating, reviewText }) {
//we track whether the mouse is over it and that will determine if we show the review box
  const [isHovered, setIsHovered] = useState(false);
 
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  
  return (
    <section>
    <div
      className="poster-card-container" style={{position: 'relative'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
    {/*takes image from game object passed in */}
  <img
    src={(game ? game.getImageDisplay() :  Flag)}
    alt={gameName}
    className="posterImg"
    style={{}}
    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = Flag; }}
  />

      {/*This code actually renders the review box */}
      
    </div>
    {isHovered && (
        <div className="posterReview" >
          <h5>{gameName}: {rating}★</h5>
          <p>{reviewText}</p>
        </div>)}
  </section>
  );
}

//these components need game objects