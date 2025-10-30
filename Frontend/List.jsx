// Frontend/List.jsx

  import React, { useState } from 'react';

function SearchBar() {

  const [userSearch, setUserSearch] = useState('');

  const handleInputChange = (event) => {
    setUserSearch(event.target.value);
  };

  return (
    <div>
      <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '20px' 
    }}>
    
      <h1>Search for Games to add to your List!</h1>
    
    
      <input
        type="search"
        placeholder="Type to Search Games..."
        
        value={userSearch}     
        onChange={handleInputChange} 
        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '650px' }}
      />
      <p>{userSearch}</p>
    </div>
    </div>
  );
}

// Example usage:
export default SearchBar;