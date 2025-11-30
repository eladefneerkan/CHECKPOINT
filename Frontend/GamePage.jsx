import React from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import GameObj from './models/GameObj.js';
import ReviewClass from '../Backend/Review.js'

const GamePage = () => {
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

  const location = useLocation();
  const navigate = useNavigate();
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
  console.log("GamePage - game data:", game);

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
      <div id="reviewsOnGame">Reviews
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
      </div>
    </div>
  </section>
  );
};

export default GamePage;
