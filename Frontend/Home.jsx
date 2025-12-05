import React, { useState, useEffect } from 'react';
import { fetchGamesByIds } from './services/gameApi.js'

//component imports
import { PotionBubbles, PosterList, Advertisement } from './components';



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
    <PotionBubbles />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          CHECKPOINT
        </h1>
        <p style={{ fontSize: "1.5rem" }}>
          Track, share, and discover your <i>new</i> favorite games
        </p>
        <h2 className='section-heading'>New reviews...</h2>

    <PosterList reviews={reviews} games={games} loading={loading} error={error} />

    <Advertisement num={3}/>
    </div>
    </section>
  );
}
