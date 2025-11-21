import React from 'react'

const GameObj = ({game}) =>{

    const imageUrl = game.getImageDisplay()
    //some games don't have genres, so use if/else to see if the games.genre exists
    let genreList = "NA";
    if(game.genres && Array.isArray(game.genres))
    {
        genreList = game.genres.map(genre => genre.name).join(', ')
    }
    return(
        <div className="game-obj">
            <div className="game-obj-img-display">
                <img src={imageUrl} alt={game.name} className="game-image" />
            </div>
            <div className="game-obj-contents">

                <h3 className="game-obj-title">{game.name}</h3>

                <p className="game-obj-detail">
                    **Released:** {game.released || 'Unknown'}
                </p>
                
                <p className="game-obj-detail">
                    **Rating:** <span className={`rating-badge rating-${Math.floor(game.rating)}`}>
                        {game.rating || 'N/A'} 
                    </span>
                </p>
                
                <p className="game-obj-detail">
                    **Genres:** {genreList}
                </p>
            </div>
        </div>
    )
}

export default GameObj
