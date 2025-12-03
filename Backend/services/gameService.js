// handles game search logic and filtering

const Game = require("../models/Games"); 

// converts the user input into a valid regex expression for db search
function searchToRegex(text) {
    let prefix = '';
    
    // saves the ^ if present (for starts-with searches w/ one letter)
    if (text.startsWith('^')) {
        prefix = '^';
        text = text.substring(1);
    }
    
    const escapedText = text.replace(/[-[\]{}()*+?.\\^$|#]/g, '\\$&');
    
    return prefix + escapedText;
}

const searchGames = async (
    query = "", 
    genres = "", 
    minRating = "", 
    maxRating = ""
) => {
    const safeQuery = String(query || "").trim();
    const safeGenres = String(genres || "").trim();
    
    // If no query and no genres, return empty
    if (!safeQuery && !safeGenres) {
        return [];
    }

    try {
        let searchCriteria = {};
    
        // Handle name search 
        if (safeQuery) {
            const escapedQuery = searchToRegex(safeQuery);
            const regex = new RegExp(escapedQuery, "i"); 
            searchCriteria.name = regex;
        }

        // Handle genre filter
        if (safeGenres) {
            const genreList = safeGenres.split(',').map(g => g.trim()).filter(g => g.length > 0);
            if (genreList.length > 0) {
                searchCriteria['genres.name'] = { $all: genreList };
            }
        }

        // Handle rating filter
        if (minRating || maxRating) {
            searchCriteria.rating = {};
            if (minRating) searchCriteria.rating.$gte = parseFloat(minRating);
            if (maxRating) searchCriteria.rating.$lte = parseFloat(maxRating);
        }

        const results = await Game.find(
            searchCriteria,
            { 
                id: 1, 
                name: 1, 
                slug: 1, 
                released: 1, 
                rating: 1, 
                description: 1, 
                background_image: 1, 
                genres: 1 
            }
        )

        return results;
    } catch (error) {
       throw new Error(`Failed to execute game search query. Details: ${error.message}`);
    }
};

module.exports = { searchGames };