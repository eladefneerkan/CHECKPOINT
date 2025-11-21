import React, { useState, useEffect } from 'react';
import GameComp from './GameObj.jsx'
import GameObj from './models/GameObj.js'

/*
const MOCK_GAMES_LIST = [
  'Ghost of Yotei',
  'Sally Face',
  'Five Nights at Freddy\'s',
  'Genshin Impact',
  'Overwatch',
  'It Takes Two',
  'Valorant',
  'The Legend of Zelda: Breath of the Wild',
  'Among Us',
  'Afterworld'
];
*/

const fetchGamesByQuery = async (query) => {
    try {
        const response = await fetch(`/search/Games?q=${encodeURIComponent(query)}`)
        if (!response.ok) return []
         const data = await response.json()
        
        console.log("RAW API DATA:", JSON.stringify(data, null, 2))

        
        const hydratedData = data.map(rawGame => {
            return new GameObj(
                rawGame.id, 
                rawGame.name, 
                rawGame.slug, 
                rawGame.released, 
                rawGame.rating, 
                rawGame.description, 
                rawGame.background_image, 
                rawGame.genres
            )
        })
        return hydratedData
        
    } 
    catch (error) {
        console.error('Error fetching final search results:', error);
        return [];
    }
}

function SearchBar({ onFinalSearch }) {
  const [userSearch, setUserSearch] = useState('')
  const [matchedResults, setMatchedResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)

  const handleInputChange = (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
  };

  // Debounce fetch: wait 300ms after typing stops
  useEffect(() => {
    const query = userSearch.trim()

    if (query.length < 1) {
      setMatchedResults([])
      return;
    }

    const handler = setTimeout(async () => {
      try {
        // If user typed exactly one character, ask backend for games
        // that start with that character by sending a start-anchored regex.
        const qParam = query.length === 1 && /^[a-z]$/i.test(query)
          ? `^${query}`
          : query;
        const response = await fetch(`/search/Games?q=${encodeURIComponent(qParam)}`);
        if (!response.ok) {
          console.error('Search request failed:', response.status);
          return;
        }
        const data = await response.json();
        setMatchedResults( data.map(rawGame => new GameObj(
          rawGame.id,
          rawGame.name,
          rawGame.slug,
          rawGame.released,
          rawGame.rating,
          rawGame.description,
          rawGame.background_image,
          rawGame.genres
        )));  
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    }, 300);

    setTimeoutId(handler)
    return () => clearTimeout(handler);
  }, [userSearch]);


  const handleSearchRes = (query = userSearch) => {
    if (timeoutId) clearTimeout(timeoutId)
    onFinalSearch(query.trim())
    setMatchedResults([])
  }
  const handleGameSelect = (gameName) => {
    if (timeoutId) clearTimeout(timeoutId)
    setUserSearch(gameName)
    setMatchedResults([])
    handleSearchRes(gameName)
  }

  const handleUserEnter = (event) => {
    if (event.key === 'Enter') 
    {
      event.preventDefault();
      handleSearchRes();
    }
  }

  return (
    // Outer div for page centering (Flexbox)
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px' 
    }}>
      
      <h1>Search for Games to add to your List!</h1>
    
      <div style={{ position: 'relative', width: '650px', display: 'flex' }}> 

        <input
          type="search"
          placeholder="Type to Search Games..."
          value={userSearch}    
          onChange={handleInputChange} 
          onKeyDown={handleUserEnter}
          style={{ 
            padding: '10px', 
            borderRadius: '5px', 
            border: '1px solid #ccc', 
            width: '100%', 
            borderBottomLeftRadius: matchedResults.length > 0 ? '0' : '5px',
            borderBottomRightRadius: matchedResults.length > 0 ? '0' : '5px',
            outline: 'none'
          }}
        />
      
        <button
            onClick={() => handleSearchRes()}
            style={{
                padding: '10px 15px',
                border: '1px solid #ccc',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '5px',
                borderTopLeftRadius: '0',
                borderBottomLeftRadius: '0',
            }}>
            Search
        </button>
        {matchedResults.length > 0 && (
          <div style={{
            position: 'absolute', 
            top: '100%',
            left: 0,
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            borderTop: 'none',
            backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10 
          }}>
            {matchedResults.map((game) => (
              <div 
                key={game._id || game.id} 
                style={{ 
                  padding: '10px', 
                  cursor: 'pointer', 
                  borderBottom: '1px solid #eee',
                }}
                onClick={() => handleGameSelect(game.name)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                {game.name}
              </div>
            ))}
          </div>
        )}
      </div>
      

      <p style={{ marginTop: '20px' }}>{userSearch}</p>

    </div>
  )
}

function SearchRender() {
  const [finalSearchRes, setFinalSearchRes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const handleFinalSearchRes = async (query) => {
        if (!query) {
            setFinalSearchRes([]);
            return;
        }
        setIsLoading(true);
        const results = await fetchGamesByQuery(query);
        setFinalSearchRes(results);
        setIsLoading(false);
    }
  return (
    <div className="SearchRender">
      <h1>Search</h1>
      <SearchBar onFinalSearch={handleFinalSearchRes}/> 
      <hr style={{ width: '650px', margin: '30px auto' }} />

      <h2>Number of Games Matched: ({finalSearchRes.length})</h2>
      {isLoading && <p>Loading games...</p>}
      
      {!isLoading && finalSearchRes.length === 0 && (
          <p>No games found. Try searching above!</p>
      )}

      {!isLoading && finalSearchRes.length > 0 && (
          <div style={{
              display: 'flex',
              flexDirection: 'column', 
              gap: '15px', 
              width: '650px', 
              margin: '20px auto'}}>
              {finalSearchRes.map((game, index) => ( 
                <GameComp key={game.id || game.slug || index} game={game} /> 
              ))}
          </div>
      )}
    </div>
  );
}

export default SearchRender;
