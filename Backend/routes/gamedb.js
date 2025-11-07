import axios from 'axios';

const BASE_URL = "api.thegamesdb.net/";
const API_KEY = import.meta.env.VITE_GAMESDB_KEY;

export async function searchGames(query) {
    if(!name) return [];

    try {
        const response = await axios.get(`https://${BASE_URL}Games/ByGameName`, {
            params: {
                apikey: API_KEY,
                name:
            },
        });

        const games = response.data?.data?.games;
        if (!games) return [];

        return Object.values(games);
    } catch (error) {
        console.error("Error fetching from gamesdb:", error);
        return [];
    }
}
