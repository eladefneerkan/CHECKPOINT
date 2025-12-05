import grassBg from "../assets/grass_bg.avif";
import FrogBanner from "../assets/ad_banner_green.png";
import {useNavigate} from 'react-router-dom';
import Flag from '../assets/Flag.png';
import GameObj from "./models/GameObj.js";
import React, { useState, useEffect } from 'react';
import { fetchGamesByIds } from './services/gameApi.js'


//component that returns the bubble potion effect in the background
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
  //review call states
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  //game call states
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState(null);

  useEffect(() => {
    //limit determines how many reviews will be read in
    let mounted = true; //mounted variable to prevent state updates on unmounted component
    async function loadReviews(limit = 6) {
      try {
        setLoadingReviews(true);
        setReviewsError(null);
        const res = await fetch(`/reviews?limit=${limit}`); 
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (mounted) setReviews(data);

        // extract unique numeric game ids from reviews and fetch corresponding games
        try {
          const ids = Array.from(new Set(data.map(r => Number(r.gameId)).filter(id => !Number.isNaN(id))));
          if (ids.length > 0) {
            setLoadingGames(true);
            setGamesError(null);
            const gameResults = await fetchGamesByIds(ids);
            if (mounted) setGames(gameResults);
          } else {
            if (mounted) setGames([]);
          }
        } catch (gErr) {
          console.error('Failed to load games for reviews:', gErr);
          setGamesError(String(gErr));
        } finally {
          setLoadingGames(false);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setReviewsError(err.message);
      } finally {
        setLoadingReviews(false);
      }
    }
    loadReviews();
    return () => { mounted = false; };
  }, []);
  
  const loading = loadingReviews || loadingGames;
  const error = reviewsError || gamesError;

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

  <PosterList reviews={reviews} games={games} loading={loading} error={error} />
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
//component returns multiple recent review objects named PosterCard
function PosterList({ reviews = [], games = [], loading, error }){
  if (loading) return <div>Loading reviews...</div>; 
  if (error) return <div>Error loading reviews: {error}</div>;
  if (!reviews.length) return <div>No recent reviews yet.</div>;

  return (
    <div className= "posterList" >

        {reviews.map((r) => {
          const game = games.find(g => Number(g.id) === Number(r.gameId));
          return (
            <PosterCard game={game} gameName={r.gameName} rating={r.rating} reviewText={r.reviewText}/>
          );
        })}
    </div>
  );
}

// This component represents a single poster and its review box.
function PosterCard({ game, gameName, rating, reviewText }) {
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

