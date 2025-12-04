import grassBg from "../assets/grass_bg.avif";
import FrogBanner from "../assets/ad_banner_green.png";
import {useNavigate} from 'react-router-dom';
import Flag from '../assets/Flag.png';
import GameComp from "./GameObj.jsx";
import GameObj from "./models/GameObj.js";
import React, { useState, useEffect } from 'react';



function PotionBackground() {
  const bubbles = Array.from({ length: 10 }, (_, i) => 10 + Math.random() * 10);

  return (
    <div className="potion-background">
      {bubbles.map((_, i) => (
        <div

          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${bubbles[i]}px`,
            height: `${bubbles[i]}px`,
            animationDuration: `${10 + Math.random() *15}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
export default function Home() {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    let mounted = true; //limit determines how many reviews will be read in
    async function loadReviews(limit = 4) {
      try {
        setLoadingReviews(true);
        setReviewsError(null);
        const res = await fetch(`/reviews?limit=${limit}`); 
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (mounted) setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
        if (mounted) setReviewsError(err.message);
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    }
    loadReviews();
    return () => { mounted = false; };
  }, []);
  if (loadingReviews) return <div>Loading reviews...</div>;
  if (reviewsError) return <div>Error: {reviewsError}</div>;
    
  return (
    
    <section
      className="fade-in"
      style={{
        /*backgroundImage: `url(${grassBg})`,*/
        backgroundImage: "linear-gradient(to top, #4117cdff, black)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        position: "relative",
        width: "100%"
      }}
    >
      <PotionBackground />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          CHECKPOINT
        </h1>
        <p style={{ fontSize: "1.5rem" }}>
          Track, share, and discover your <i>new</i> favorite games
        </p>
        <h2 className='section-heading'>New reviews...</h2>
        <ul className="poster-list -p70 -grid">
          <li className="posteritem"> <img src={Flag} className="posterimg"/></li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
        </ul>
        <PosterList reviews={reviews} loading={loadingReviews} error={reviewsError} />
      <div 
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        
        <button
          onClick={() => window.open("https://agsiddiqui.itch.io/afterworld", "_blank")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
          }}
        >
     
          <img 
            src={FrogBanner} 
            alt="Frog Banner"
            style={{
              width: "90%",
              maxWidth: "800px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </button>
        
      </div>
         

       {/*<button className="btn-secondary"  onClick={() => navButtonToPage('/login')}>LOGIN</button>
        <button className="btn-secondary" onClick={() => navButtonToPage('/signup')}>SIGN UP</button>    */   } 
      </div>
    </section>
  );
}

function PosterList({ reviews = [], loading, error }){
  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div>Error loading reviews: {error}</div>;
  if (!reviews.length) return <div>No recent reviews yet.</div>;
  return (
    <div className="poster-list -p70 -grid" style={{width: '100%', background: 'white', height: '500px', position: 'relative', margin: 'auto'}}>
      <div className="posteritem" style={{width: '100%', background: 'white', margin: 'auto', display: 'flex', flexDirection: 'row'}}>
        {reviews.map((r) => (
          <PosterCard user={r.user} gameName={r.gameName} rating={r.rating} reviewText={r.reviewText}/>
        ))}
      </div>
    </div>
  );
}

// This component represents a single poster and its review box.
function PosterCard({ user, gameName, rating, reviewText }) {
//we track whether the mouse is over it and that will determine if we show the review box
  const [isHovered, setIsHovered] = useState(false);
 // const imageUrl = game.getImageDisplay()
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };


  return (
    <div
      className="poster-card-container" style={{position: 'relative'}}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
    
      <img src={Flag} alt={gameName} className="poster-image" />

      {/* 2. This code actually renders the review box */}
      {isHovered && (
        <div className="reviews-section dark-gray-background" style={{width:'200%', position: 'absolute', top: '100%'}}>
          <h5>{user}: {rating}★</h5>
          <p>{reviewText}</p>
        </div>)}
    </div>
  );
}

