import React, { useState, useEffect } from 'react';
import GameComp from './GameObj.jsx'
import GameObj from './models/GameObj.js'
import AddToListModal from './AddToListModal.jsx'


const fetchGamesByQuery = async (query, genres = []) => {
    try {
        // Build URL with query and genres
        let url = '/search/Games?';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (genres.length > 0) params.append('genres', genres.join(','));
        
        url += params.toString();
        
        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
        
        console.log("RAW API DATA:", JSON.stringify(data, null, 2));

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

function SearchBar({ onFinalSearch, selectedGenres }) {
  const [userSearch, setUserSearch] = useState('')
  const [matchedResults, setMatchedResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)

  const handleInputChange = (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
  };

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
        
        // Build URL with query and genres if any are selected
        let url = `/search/Games?q=${encodeURIComponent(qParam)}`;
        if (selectedGenres.length > 0) {
          url += `&genres=${selectedGenres.join(',')}`;
        }
        
        const response = await fetch(url);
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
  }, [userSearch, selectedGenres]);


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
  const [filteredResults, setFilteredResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddToListModal, setShowAddToListModal] = useState(false)
  const [selectedGameForList, setSelectedGameForList] = useState(null)
  const [userLists, setUserLists] = useState([])
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [selectedGenres, setSelectedGenres] = useState([])

  const token = localStorage.getItem("token")

  // Common genres for filtering
  const availableGenres = [
    "Action", "Adventure", "RPG", "Strategy", "Shooter", 
    "Puzzle", "Simulation", "Sports", "Racing", "Platformer",
    "Fighting", "Indie", "Casual", "Arcade", "Massively Multiplayer"
  ]

  const handleFinalSearchRes = async (query) => {
        // Allow search with just genres or just query or both
        if (!query && selectedGenres.length === 0) {
            setFinalSearchRes([]);
            setFilteredResults([]);
            return;
        }
        setIsLoading(true);
        const results = await fetchGamesByQuery(query, selectedGenres);
        setFinalSearchRes(results);
        setFilteredResults(results);
        setIsLoading(false);
    }

  // When genres change, automatically trigger new search if there are already results
  useEffect(() => {
    if (finalSearchRes.length > 0) {
      const currentQuery = document.querySelector('input[type="search"]')?.value || '';
      handleFinalSearchRes(currentQuery);
    }
  }, [selectedGenres])

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleClearGenres = () => {
    setSelectedGenres([])
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

      const listsToUpdate = []
      const listsWithDuplicates = []
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

        const list = userLists.find(l => l._id === listId);

        if (response.ok)
          listsToUpdate.push(list.title)
        else {
          const result = await response.json()
          if (response.status === 400 && result.error?.includes("already")) {
            listsWithDuplicates.push(list.title)
          } 
          else {
            console.error("Error adding game to list")
          }
        }
      }

      if (listsToUpdate.length > 0) {
      setSuccessMessage(`Successfully added "${game.name}" to ${listsToUpdate.join(", ")}`)
      setTimeout(() => setSuccessMessage(""), 3000)
      }
      if (listsWithDuplicates.length > 0) {
        setErrorMessage(`"${game.name}" is already in ${listsWithDuplicates.join(", ")}`)
        setTimeout(() => setErrorMessage(""), 3000)
      }
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
      
      {errorMessage && (
        <div
          style={{
          backgroundColor: "#dc3545",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center",
          maxWidth: "650px",
          margin: "0 auto 20px",
        }}
      >
        {errorMessage}
      </div>
    )}

      <h1>Search</h1>
      <SearchBar onFinalSearch={handleFinalSearchRes} selectedGenres={selectedGenres}/> 

      <div style={{
        width: '650px',
        margin: '20px auto',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h3 style={{ margin: 0 }}>Filter by Genre</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedGenres.length > 0 && (
              <>
                <button
                  onClick={() => handleFinalSearchRes('')}
                  style={{
                    padding: '5px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  Search by Genre
                </button>
                <button
                  onClick={handleClearGenres}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Clear All
                </button>
              </>
            )}
          </div>
        </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            {availableGenres.map(genre => (
              <label
                key={genre}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 12px',
                  backgroundColor: selectedGenres.includes(genre) ? '#007bff' : 'white',
                  color: selectedGenres.includes(genre) ? 'white' : '#333',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  userSelect: 'none',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  style={{ marginRight: '6px' }}
                />
                {genre}
              </label>
            ))}
          </div>
        {selectedGenres.length > 0 && (
          <p style={{ 
            marginTop: '10px', 
            marginBottom: '0',
            fontSize: '14px',
            color: '#666'
          }}>
            Active filters: <strong>{selectedGenres.join(', ')}</strong>
          </p>
        )}
      </div>

      <hr style={{ width: '650px', margin: '20px auto' }} />

      {finalSearchRes.length > 0 && (
        <h2>Number of Games Matched: ({filteredResults.length})</h2>
      )}
      {isLoading && <p>Loading games...</p>}
      
      {!isLoading && filteredResults.length === 0 && finalSearchRes.length === 0 && (
          <p>No games found. Try searching above!</p>
      )}

      {!isLoading && filteredResults.length === 0 && finalSearchRes.length > 0 && (
          <p>No games match the selected genres. Try different filters!</p>
      )}

      {!isLoading && filteredResults.length > 0 && (
          <div style={{
              display: 'flex',
              flexDirection: 'column', 
              gap: '15px', 
              width: '650px', 
              margin: '20px auto'}}>
              {filteredResults.map((game, index) => ( 
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
