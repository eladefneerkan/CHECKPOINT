import React from 'react'
import {useNavigate} from 'react-router-dom'
import {parseDate, formatGenres} from './services/gameUtil'

const GameComp = ({game, onAddToList}) =>{

    const navigate = useNavigate();
    const imageUrl = game.getImageDisplay()
    const genreList = formatGenres(game.genres)

    const handleGameClick = () => {
        navigate(`/game/${game.id}`, { state: { game } });
    };

    return(
        <div 
            className="game-obj"
            onClick={handleGameClick}
            style={{ cursor: 'pointer' }}
        >            
            <div className="game-obj-img-display">
                <img src={imageUrl} alt={game.name} className="game-image" />
            </div>
            <div className="game-obj-contents">

                <h3 className="game-obj-title">{game.name}</h3>

                <p className="game-obj-detail">
                    <b>Released:</b> {parseDate(game.released) || 'Unknown'}
                </p>
                
                <p className="game-obj-detail">
                    <b>Rating:</b> <span className={`rating-badge rating-${Math.floor(game.rating)}`}>
                        {game.rating || 'N/A'} 
                    </span>
                </p>
                
                <p className="game-obj-detail">
                    <b>Genres:</b> {genreList}
                </p>

                {onAddToList && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToList(game);
                        }}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: "#10b981",
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                        }}
                    >
                        + Add to List
                    </button>
                )}
            </div>
        </div>
    )
}

export default GameComp
