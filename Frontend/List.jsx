import React, { useState, useEffect } from 'react';
import GameComp from './GameObj.jsx'
import GameObj from './models/GameObj.js'
import AddToListModal from './AddToListModal.jsx'


const fetchGames = async (query = '', genres = [], minRating = '', maxRating = '', sortOption = '') => {
    try {

        // Build URL with query and genres
        let url = '/search/Games?';
        const params = new URLSearchParams();
        
        if (query) params.append('q', query);
        if (genres.length > 0) params.append('genres', genres.join(','));
        if (minRating) params.append('minRating', minRating);
        if (maxRating) params.append('maxRating', maxRating);
        if (sortOption) params.append('sortOption', sortOption);
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

function SearchBar({ onFinalSearch, selectedGenres, clearDropdownTrigger }) {
  const [userSearch, setUserSearch] = useState('')
  const [matchedResults, setMatchedResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)

  const handleInputChange = (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
  };

  useEffect(() => {
      setMatchedResults([]);
  }, [clearDropdownTrigger]);


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
  const [minRating, setMinRating] = useState("")
  const [maxRating, setMaxRating] = useState("")
  const [sortOption, setSortOption] = useState("")
  const [clearSearchbarDropdown, setClearSearchbarDropdown] = useState(0)

  const token = localStorage.getItem("token")

  const handleSortChange = (value) => {
  setSortOption(value)
  }

  const sortResults = (results, option) => {
if (!option || results.length === 0) return results;
  const sorted = [...results]; // Create a shallow copy

  sorted.sort((a, b) => {
    switch (option) {
      case 'released-desc': 
        return b.released.localeCompare(a.released)
      case 'released-asc': 
        return a.released.localeCompare(b.released)
      case 'rating-desc':
        return b.rating - a.rating;
      case 'rating-asc':
                return a.rating - b.rating;
            default:
                return 0;
        }
    })
    return sorted;  
  }
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
            return;
        }
        setIsLoading(true);
        const results = await fetchGames(query, selectedGenres, minRating, maxRating, "");
        setFinalSearchRes(results);
        setIsLoading(false);
    }
  
    useEffect(() => {
    if (finalSearchRes.length > 0) {
      const sorted = sortResults(finalSearchRes, sortOption);
      setFilteredResults(sorted);
    } else {
      setFilteredResults([]);
    }
  }, [sortOption, finalSearchRes]);
  // When genres or other filters change, automatically trigger new search if there are already results

  const handleGenreToggle = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleClearFilters = () => {
    setSelectedGenres([])
    setMinRating('')
    setMaxRating('')
    setSortOption('')
  }

  const getSortLabel = () => {
    const labels = [];
    
    switch(sortOption)
    {
      case 'rating-desc':
        labels.push('Rating: High to Low');
        break;
      case 'rating-asc':
        labels.push('Rating: Low to High');
        break;
      case 'released-desc':
        labels.push('Release: Newest to Oldest');
        break;
      case 'released-asc':
        labels.push('Release: Oldest to Newest');
        break;
      default:
        break;
    }

    return labels.length > 0 ? labels.join(' → ') : '';
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

  const filterSelected = selectedGenres.length > 0 || minRating || maxRating || sortOption

  return (
  <div 
    className="SearchRender"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
      padding: "20px"
    }}>
    <div style={{ flex: 1 }}>
      <h1>Search</h1>
      <SearchBar onFinalSearch={handleFinalSearchRes} selectedGenres={selectedGenres} clearDropdownTrigger={clearSearchbarDropdown} />

      {successMessage && (
        <div style={{
          backgroundColor: "#28a745",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          marginTop: "20px",
          textAlign: "center"
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: "#dc3545",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          marginTop: "20px",
          textAlign: "center"
        }}>
          {errorMessage}
        </div>
      )}

      {finalSearchRes.length > 0 && (
        <h2 style={{ marginTop: "20px" }}>
          Number of Games Matched: ({filteredResults.length})
        </h2>
      )}

      {isLoading && <p>Loading games...</p>}

      {!isLoading && filteredResults.length === 0 && finalSearchRes.length === 0 && (
        <p>No games found. Try searching above!</p>
      )}

      {!isLoading && filteredResults.length === 0 && finalSearchRes.length > 0 && (
        <p>No games match the selected filters. Try different settings!</p>
      )}

      {!isLoading && filteredResults.length > 0 && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px"
        }}>
          {filteredResults.map((game, index) => (
            <GameComp
              key={game.id || game.slug || index}
              game={game}
              onAddToList={handleAddToListClick}
            />
          ))}
        </div>
      )}
    </div>

    <div style={{
      width: "250px",
      padding: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa"
    }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <h4 style={{ marginTop: "15px" }}>Genre</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {availableGenres.map(genre => (
          <label
            key={genre}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 12px",
              backgroundColor: selectedGenres.includes(genre) ? "#007bff" : "white",
              color: selectedGenres.includes(genre) ? "white" : "#333",
              border: "1px solid #ccc",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreToggle(genre)}
              style={{ marginRight: "6px" }}
            />
            {genre}
          </label>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Rating Range</h4>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            placeholder="Min"
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            min="0"
            max="5"
            step="0.1"
            style={{ flex: 1, padding: "6px" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxRating}
            onChange={(e) => setMaxRating(e.target.value)}
            min="0"
            max="5"
            step="0.1"
            style={{ flex: 1, padding: "6px" }}
          />
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Sort By</h4>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        >
          <option value="">None</option>
          <option value="released-desc">Release Date (Newest)</option>
          <option value="released-asc">Release Date (Oldest)</option>
          <option value="rating-desc">Rating (High → Low)</option>
          <option value="rating-asc">Rating (Low → High)</option>
        </select>
      </div>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            const currentQuery = document.querySelector('input[type="search"]')?.value || '';
            handleFinalSearchRes(currentQuery);
            setClearSearchbarDropdown(prev => prev + 1);
          }}
          style={{
            padding: "6px 10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
            fontWeight: "bold"
          }}
        >
          Apply
        </button>
        <button
          onClick={handleClearFilters}
          style={{
            padding: "6px 10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Clear
        </button>
      </div>
    </div>

    {showAddToListModal && selectedGameForList && (
      <AddToListModal
        lists={userLists}
        game={selectedGameForList}
        onClose={() => {
          setShowAddToListModal(false);
          setSelectedGameForList(null);
        }}
        onAddToLists={handleAddGameToLists}
        onCreateNewList={handleCreateNewList}
      />
    )}

  </div>
  );
}

export default SearchRender;
