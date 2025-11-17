import React, { useState } from 'react';

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



function SearchBar() {
  const [userSearch, setUserSearch] = useState('');
  const [matchedResults, setMatchedResults] = useState([]);
  
  const handleInputChange = async (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
    
    if (currInput.length < 1) {
      setMatchedResults([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/search/Games?q=${encodeURIComponent(currInput)}`);
      const data = await response.json();
      setMatchedResults(data);   
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

  const handleGameSelect = (gameName) => {
    setUserSearch(gameName); 
    setMatchedResults([]);
  };

  return (
    // Outer div for page centering (Flexbox)
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px' 
    }}>
      
      <h1>Search for Games to add to your List!</h1>
    
      <div style={{ position: 'relative', width: '650px' }}> 

        <input
          type="search"
          placeholder="Type to Search Games..."
          value={userSearch}    
          onChange={handleInputChange} 
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
        
        {matchedResults.length > 0 && (
          <div style={{
            position: 'absolute', 
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
  );
}

function SearchRender() {
  return (
    <div className="SearchRender">
      <h1>Search</h1>
      <SearchBar /> 
    </div>
  );
}

export default SearchRender;
