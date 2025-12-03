import GameObj from '../../Backend/models/GameObj.js';

// converts raw game data from API into GameObj instances
const hydrateGame = (rawGame) => {
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
}

// API call to fetch final search results based on user query & selected filters
export const fetchFinalGames = async ({ query = '', genres = [], minRating = '', maxRating = ''}) => {
    try {
        const params = new URLSearchParams();
        const safeQuery = String(query || "").trim();

        // qParam: optimization logic for autocomplete
        // '^' added to start of query if it's 1 character long and a letter,
        // allowing for queries that are one letter to return results starting with that letter.
        // otherwise (if query is not a single letter) the query is used as is.
        const qParam = safeQuery.length === 1 && /^[a-z]$/i.test(safeQuery)
            ? `^${safeQuery}`
            : safeQuery;
        
        if (qParam) params.append('q', qParam);
        if (genres.length > 0) params.append('genres', genres.join(','));
        if (minRating) params.append('minRating', minRating);
        if (maxRating) params.append('maxRating', maxRating);
        
        const url = `http://localhost:3000/search/Games?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        const data = await response.json();
        
        // converts array of raw JSON data matching query from db into hydrated GameObjs
        return data.map(hydrateGame); 
    } 
    catch (error) {
        console.error('Error fetching final search results:', error);
        return [];
    }
};

// API call to fetch auto-complete suggestions for dropdown as the user types in query
export const fetchAutoCompleteGames = async (query, selectedGenres) => {
    if (query.length < 1) return [];

    const qParam = query.length === 1 && /^[a-z]$/i.test(query)
        ? `^${query}`
        : query;
        
    try {
        let url = `http://localhost:3000/search/Games?q=${encodeURIComponent(qParam)}`;
        if (selectedGenres.length > 0) {
            url += `&genres=${selectedGenres.join(',')}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) return [];
        
        const data = await response.json();
        return data.map(hydrateGame);
    } catch (error) {
        console.error('Error fetching auto-complete results:', error);
        return [];
    }
};