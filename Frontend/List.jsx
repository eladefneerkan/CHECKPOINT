import React, { useState, useEffect } from 'react';
import GameComp from './GameObj.jsx'
import GameObj from './models/GameObj.js'
import AddToListModal from './AddToListModal.jsx'

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
  const [showAddToListModal, setShowAddToListModal] = useState(false)
  const [selectedGameForList, setSelectedGameForList] = useState(null)
  const [userLists, setUserLists] = useState([])
  const [successMessage, setSuccessMessage] = useState("")

  const token = localStorage.getItem("token")

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

  const fetchUserLists = async () => {
    try {
      const response = await fetch("http://localhost:3000/gameLists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      setUserLists(data)
    } catch (err) {
      console.error("Error fetching lists:", err)
    }
  }

  const handleAddToListClick = (game) => {
    setSelectedGameForList(game)
    fetchUserLists()
    setShowAddToListModal(true)
  }

  const handleAddGameToLists = async (selectedListIds, game) => {
    try {
      const gameToAdd = {
        _id: game.id,
        name: game.name,
        slug: game.slug,
        released: game.released,
        rating: game.rating,
        description: game.description,
        background_image: game.background_image,
        genres: game.genres,
      }

      // Add game to backend first
      for (const listId of selectedListIds) {
        const response = await fetch(`http://localhost:3000/gameLists/${listId}/games`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gameId: game.id }),
        })

        if (!response.ok) {
          console.error("Error adding game to list")
        }
      }

      // Get the list name(s) for the success message
      const listNames = userLists
        .filter(list => selectedListIds.includes(list._id))
        .map(list => list.title)
        .join(", ")

      setSuccessMessage(`Successfully added to ${listNames}`)
      setTimeout(() => setSuccessMessage(""), 3000)
      setShowAddToListModal(false)
      setSelectedGameForList(null)
    } catch (err) {
      console.error("Error adding game to lists:", err)
      alert("Failed to add game to list")
    }
  }

  const handleCreateNewList = async (title) => {
    try {
      const response = await fetch("http://localhost:3000/gameLists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description: "",
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        alert(err.error || err.message || "Failed to create list")
        return null
      }

      const result = await response.json()
      const newList = result.list
      setUserLists([newList, ...userLists])
      return newList
    } catch (err) {
      console.error("Error creating list:", err)
      alert("Failed to create list")
      return null
    }
  }

  return (
    <div className="SearchRender">
      {successMessage && (
        <div
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
            textAlign: "center",
            maxWidth: "650px",
            margin: "0 auto 20px",
          }}
        >
          {successMessage}
        </div>
      )}

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
                <GameComp 
                  key={game.id || game.slug || index} 
                  game={game}
                  onAddToList={handleAddToListClick}
                /> 
              ))}
          </div>
      )}

      {showAddToListModal && selectedGameForList && (
        <AddToListModal
          lists={userLists}
          game={selectedGameForList}
          onClose={() => {
            setShowAddToListModal(false)
            setSelectedGameForList(null)
          }}
          onAddToLists={handleAddGameToLists}
          onCreateNewList={handleCreateNewList}
        />
      )}
    </div>
  );
}

export default SearchRender;
