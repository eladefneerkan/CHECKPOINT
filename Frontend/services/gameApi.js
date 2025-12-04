import { hydrateGame } from './gameHydration.js';


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

// API call to fetch games based off of a string of names
export const fetchGameFromName = async (names = []) => {
    if (!Array.isArray(names) || names.length === 0) return [];

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
export const fetchGamesByNames = async (names = []) => {

    try {
        // Convert ["Halo","DOOM"] → "Halo,DOOM"
        let url = `http://localhost:3000/search/Games?name=${encodeURIComponent(
            names.join(",")
        )}`;


        const response = await fetch(url);
        if (!response.ok) return [];
        const data = await response.json();
    // Debug: log raw game data (first item) to help diagnose missing images
    if (data && data.length > 0) console.debug('fetchGamesByIds raw[0]:', data[0]);
    const hydrated = data.map(hydrateGame);
    if (hydrated && hydrated.length > 0) console.debug('fetchGamesByIds hydrated[0]:', hydrated[0]);
    return hydrated;
    } catch (error) {
        console.error("Error fetching games by names:", error);
        return [];
    }
};




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

// Fetch games by an array of numeric ids (POST). Returns hydrated GameObjs.
export const fetchGamesByIds = async (ids = []) => {
    if (!Array.isArray(ids) || ids.length === 0) return [];

    try {
        const url = `http://localhost:3000/search/GamesByIds`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids }),
        });

        if (!response.ok) return [];
        const data = await response.json();
        return data.map(hydrateGame);
    } catch (error) {
        console.error('Error fetching games by ids:', error);
        return [];
    }
};