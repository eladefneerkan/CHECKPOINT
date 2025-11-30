import React from 'react'
import {useNavigate} from 'react-router-dom'
function RatingFlag(rating) {
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  // convert 0-5 rating → 0-120 hue (red → yellow → green)`hsl(${hue}, 100%, 45%)`
  const hue = clamp((rating / 5) * 120, 0, 120);}
  
const GameComp = ({game, onAddToList}) =>{

    const navigate = useNavigate();
    const imageUrl = game.getImageDisplay()
    //some games don't have genres, so use if/else to see if the games.genre exists
    let genreList = "N/A";
    if(game.genres && Array.isArray(game.genres))
    {
        genreList = game.genres.map(genre => genre.name).join(', ')
    }

    const parseDate = (dateStr) => {

        if(!dateStr) return 'Unknown'

        const yr = dateStr.substring(0,4)
        const m = dateStr.substring(5,7)
        const d = dateStr.substring(8,10)
        let m_str = ''
        switch(m){
            case '01': m_str = 'Jan'; break;
            case '02': m_str = 'Feb'; break;
            case '03': m_str = 'Mar'; break;   
            case '04': m_str = 'Apr'; break;
            case '05': m_str = 'May'; break;
            case '06': m_str = 'Jun'; break;
            case '07': m_str = 'Jul'; break;
            case '08': m_str = 'Aug'; break;
            case '09': m_str = 'Sep'; break;
            case '10': m_str = 'Oct'; break;
            case '11': m_str = 'Nov'; break;
            case '12': m_str = 'Dec'; break;
            default: m_str = '';    
        }
        return m_str + ' ' + d + ', ' + yr
    }

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
