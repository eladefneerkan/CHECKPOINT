import GameObj from '../models/GameObj.js';

// converts raw game data from API into GameObj instances
export const hydrateGame = (rawGame) => {
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

