import React from 'react'

const GameObj = ({game}) =>{
    return(
        <div className="game-obj">
            <img src={game.getImageDisplay()} alt={game.name} className="game-image" />
            <h3>{game.name}</h3>
            {/*To add later: display developer, genres*/}
        </div>
    )

}