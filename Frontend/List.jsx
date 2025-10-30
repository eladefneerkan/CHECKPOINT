import React, { useState } from 'react';

const MOCK_GAMES_LIST = [
  'Ghost of Yotei',
  'Sally Face',
  'Five Nights at Freddy\'s',
  'Genshin Impact',
  'Overwatch',
  'Valorant',
  'The Legend of Zelda: Breath of the Wild',
  'Among Us',
  'Afterworld'
];

function SearchBar() {
  const [userSearch, setUserSearch] = useState('');
  const [matchedResults, setMatchedResults] = useState([]);
  
  const handleInputChange = (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
    
    if (currInput.length > 0) {
      const matched = MOCK_GAMES_LIST.filter(game =>
        game.toLowerCase().startsWith(currInput.toLowerCase())
      );
      setMatchedResults(matched);
    } else {
      setMatchedResults([]);
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
            {matchedResults.map((game, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '10px', 
                  cursor: 'pointer', 
                  borderBottom: '1px solid #eee',
                }}
                onClick={() => handleGameSelect(game)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
              >
                {game}
              </div>
            ))}
          </div>
        )}
      </div>
      

      <p style={{ marginTop: '20px' }}>{userSearch}</p>

    </div>
  );
}

export default SearchBar;