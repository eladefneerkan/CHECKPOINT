import GameObj from '../../Backend/models/GameObj.js';

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
    );
};

export const fetchFinalGames = async ({ query = '', genres = [], minRating = '', maxRating = '', sortOption = '' }) => {
    try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (genres.length > 0) params.append('genres', genres.join(','));
        if (minRating) params.append('minRating', minRating);
        if (maxRating) params.append('maxRating', maxRating);
        if (sortOption) params.append('sortOption', sortOption);
        
        const url = `http://localhost:3000/search/Games?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) return [];
        const data = await response.json();
        
        return data.map(hydrateGame);
    } 
    catch (error) {
        console.error('Error fetching final search results:', error);
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