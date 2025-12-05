import React, { useState, useEffect, useCallback } from 'react';
import GameComp from './GameObj.jsx'
import AddToListModal from './AddToListModal.jsx'
import { fetchAutoCompleteGames, fetchFinalGames } from './services/gameApi.js'
import {fetchUserLists, createNewList, addGameToList } from './services/listApi.js'
import { useLocation, useNavigate } from 'react-router-dom'

function SearchBar({ onFinalSearch, selectedGenres, clearDropdownTrigger, initialQuery }) {
  const [userSearch, setUserSearch] = useState('')
  const [matchedResults, setMatchedResults] = useState([])
  const [timeoutId, setTimeoutId] = useState(null)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleInputChange = (event) => {
    const currInput = event.target.value;
    setUserSearch(currInput);
    if (currInput.length > 0) {
    setDropdownVisible(true);
    } else {
    setDropdownVisible(false);
    }
  };

  useEffect(() => {
      setMatchedResults([]);
  }, [clearDropdownTrigger]);


  useEffect(() => {
      setUserSearch(initialQuery || '');
  }, [initialQuery])

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
        const data = await fetchAutoCompleteGames(query, selectedGenres);
        setMatchedResults(data);

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
    setDropdownVisible(false)
  }
  const handleGameSelect = (gameName) => {
    if (timeoutId) clearTimeout(timeoutId)
    setUserSearch(gameName)
    setDropdownVisible(false)
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
      
      <h1 id="bum"  >Search for Games to Add to Your List!</h1>
    
      <div style={{ position: 'relative', width: '650px', display: 'flex' }}> 

        <input
          type="search"
          placeholder="Type to Search Games..."
          value={userSearch}    
          onChange={handleInputChange} 
          onKeyDown={handleUserEnter}
          className={`search-bar-base ${matchedResults.length > 0 ? 'search-bar-active' : ''}`}
        />
      
        <button
            onClick={() => handleSearchRes()}
            className='search-button'>
            Search
        </button>
        {matchedResults.length > 0 && dropdownVisible && (
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
} //refactor this into game section

function SearchRender() {
  const navigate = useNavigate()
  const location = useLocation()

  const [finalSearchRes, setFinalSearchRes] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddToListModal, setShowAddToListModal] = useState(false)
  const [selectedGameForList, setSelectedGameForList] = useState(null)
  const [userLists, setUserLists] = useState([])
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const urlParams = new URLSearchParams(location.search)

  const initialQuery = urlParams.get('q') || ''
  const initialGenres = urlParams.get('genres')?.split(',') || []
  const initialMinRating = urlParams.get('minRating') || ''
  const initialMaxRating = urlParams.get('maxRating') || ''
  const initialSortOption = urlParams.get('sortOption') || ''
  
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [selectedGenres, setSelectedGenres] = useState(initialGenres)
  const [minRating, setMinRating] = useState(initialMinRating)
  const [maxRating, setMaxRating] = useState(initialMaxRating)
  const [sortOption, setSortOption] = useState(initialSortOption)
  const [clearSearchbarDropdown, setClearSearchbarDropdown] = useState(0)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const loadUserLists = async () => {
      if (!token) {
        setUserLists([]);
        return;
      }
      try {
        const listData = await fetchUserLists(token);
        setUserLists(listData);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };
    loadUserLists();
  }, [token])

  const handleSortChange = (value) => {
  setSortOption(value)
  }

  const sortResults = useCallback((results, option) => {
  if (!option || results.length === 0) return results;
  const sorted = [...results]; // Create a shallow copy

  sorted.sort((a, b) => {
    switch (option) {
      case 'released-desc': 
        // if statements handle null/undef cases where release is undefined
        if (!a.released && !b.released) return 0;
        if (!a.released) return 1; 
        if (!b.released) return -1;
        return b.released.localeCompare(a.released)
      case 'released-asc': 
        if (!a.released && !b.released) return 0;
        if (!a.released) return 1; 
        if (!b.released) return -1;
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
  }, [])

  // Common genres for filtering
  const availableGenres = [
    "Action", "Adventure", "RPG", "Strategy", "Shooter", 
    "Puzzle", "Simulation", "Sports", "Racing", "Platformer",
    "Fighting", "Indie", "Casual", "Arcade", "Massively Multiplayer"
  ]

  const handleFinalSearchRes = useCallback(async (query = currentQuery, genres = selectedGenres, minR = minRating, maxR = maxRating, sortO = sortOption) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (genres.length > 0) params.append('genres', genres.join(','));
    if (minR) params.append('minRating', minR);
    if (maxR) params.append('maxRating', maxR);
    if (sortO) params.append('sortOption', sortO);
    
    navigate({ search: params.toString() }, { replace: true });
    
    setCurrentQuery(query);
    setSelectedGenres(genres);
    setMinRating(minR);
    setMaxRating(maxR);
    setSortOption(sortO);

    const results = await fetchFinalGames({query, genres, minRating: minR, maxRating: maxR});
    setFinalSearchRes(results);
    setFilteredResults(sortResults(results, sortO)); 
    setIsLoading(false);
    setClearSearchbarDropdown(prev => prev + 1); 
  }, [navigate]);

    useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    const genres = urlParams.get('genres')?.split(',') || [];
    const minR = urlParams.get('minRating') || '';
    const maxR = urlParams.get('maxRating') || '';
    const sortO = urlParams.get('sortOption') || '';
    
    if (query && finalSearchRes.length === 0) { 
        handleFinalSearchRes(query, genres, minR, maxR, sortO);
    }
  }, [location.search]);

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

  const getUserLists = async () => {
    if (!token) {
    console.log("No token found, cannot fetch user lists.")
    setUserLists([])
    return;
    }

    try {
      const listData = await fetchUserLists(token);
      setUserLists(listData);
    } catch (err) {
      console.error("Error fetching lists:", err); 
 }
  }

  const handleAddToListClick = (game) => {
    setSelectedGameForList(game)
    getUserLists()
    setShowAddToListModal(true)
  }

  const handleAddGameToLists = async (selectedListIds, game) => {
    try {
      if (!token) {
        alert("Please log in to add games to lists!");
        return;
      }

      const listsToUpdate = []
      const listsWithDuplicates = []
      const authErrors = []
      // Add game to backend first
      for (const listId of selectedListIds) {
        try{
        const response = await addGameToList(listId, game.id, token);
        const list = userLists.find(l => l._id === listId);

        listsToUpdate.push(list.title)
        }
        catch(err) {
          const list = userLists.find(l => l._id === listId)
          if (err.status === 401 || err.status === 403) {
            authErrors.push(list.title)
          } else if (err.status === 400 && err.message?.includes("already")) {
            listsWithDuplicates.push(list.title)
          } 
          else {
            console.error("Error adding game to list", err.message || err.status)
          }
        }
      }

      if (authErrors.length > 0) {
        alert("Please log in to add games to lists!");
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
    if (!token) {
        alert("Please log in to create lists!");
        return null;
      }

    const defaultImages = [
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_green.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_purple.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_red.png",
    ];
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    const defaultCoverImage = defaultImages[randomIndex];
    
    try {

      const result = await createNewList({
        title,
        description: "",
        coverImage: defaultCoverImage,
        isPublic: false,
      }, token)

      if(result)
      {
        const newList = result.list || result
        if(!newList.games)
          newList.games = []
        setUserLists([newList, ...userLists])
        return newList
      }
      return null 

    } catch (err) {
      console.error("Error creating list:", err)
      if (err.status === 401 || err.status === 403) 
        alert("Please log in to create lists!")
      else
        alert(err.message || "Failed to create new list")
    }
  }

  const filterSelected = selectedGenres.length > 0 || minRating || maxRating || sortOption

  return (
  <section  style={{backgroundImage: "linear-gradient(to top, #003632ff, #000000ff)"}}>
  <div 
    className="SearchRender"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: "20px",
      padding: "20px"
    }}>
    <div style={{ flex: 1 }}>
      <SearchBar onFinalSearch={handleFinalSearchRes} initialQuery={currentQuery} selectedGenres={selectedGenres} clearDropdownTrigger={clearSearchbarDropdown} />

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
        <h2 style={{ marginTop: "5px", marginBottom: "5px", fontStyle: "italic", color: "white" }}>
          Number of Games Matched: ({filteredResults.length})
        </h2>
      )}

      {isLoading && <p className='search-load-msg'>Loading games...</p>}

      {!isLoading && filteredResults.length === 0 && finalSearchRes.length === 0 && (
        <p className='search-load-msg'>No games found. Try searching above!</p>
      )}

      {!isLoading && filteredResults.length === 0 && finalSearchRes.length > 0 && (
        <p className='search-load-msg'>No games match the selected filters. Try different settings!</p>
      )}

      {!isLoading && filteredResults.length > 0 && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "20px",
          backgroundImage: "linear-gradient(to top, #003632ff, #000000ff)",
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
      backgroundImage: "linear-gradient(to top, #37189eff, #0c0425ff)",
      backgroundSize: "cover",
      position: 'relative',
      overflow: 'hidden',
    }}>

      
      <div style={{ position: 'relative', zIndex: 1, color: "#a9d4ff" }}>
        <h3 style={{ marginTop: 0, color: "#a9d4ff", textAlign: "center" }}>Filters</h3>

        <h4 style={{ marginTop: "15px", color: "#a9d4ff" }}>Genre:</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {availableGenres.map(genre => (
            <label
              key={genre}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                backgroundColor: selectedGenres.includes(genre) ? "#a9d4ff" : "white",
                color: /*selectedGenres.includes(genre) ? "white" :*/ "#333",
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
                className="custom-checkbox"
                style={{ marginRight: "6px" }}
              />
              {genre}
            </label>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <h4 style={{ color: "#a9d4ff" }}>Rating Range:</h4>
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
          <h4 style={{ color: "#a9d4ff" }}>Sort By:</h4>
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
            const queryFromInput = document.querySelector('input[type="search"]')?.value || '';
            handleFinalSearchRes(
            queryFromInput, 
            selectedGenres, 
            minRating, 
            maxRating, 
            sortOption);
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
            onClick={() => {
            handleClearFilters();
            const queryFromInput = document.querySelector('input[type="search"]')?.value || '';
            handleFinalSearchRes(
            queryFromInput, // keep the current search query
            [], // to ensure filter reset, pass empty default values to bypass async state updates
            '',
            '',
            '');
            setClearSearchbarDropdown(prev => prev + 1);
            }}
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
  </section>
  );
}


export default SearchRender;
