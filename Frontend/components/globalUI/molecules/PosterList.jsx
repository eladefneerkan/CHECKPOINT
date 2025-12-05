//component returns multiple recent review objects named PosterCard
import PosterCard from '../atoms/PosterCard.jsx';

export default function PosterList({ reviews = [], games = [], loading, error }){
  if (loading) return <div>Loading reviews...</div>; 
  if (error) return <div>Error loading reviews: {error}</div>;
  if (!reviews.length) return <div>No recent reviews yet.</div>;

  return (
    <div className= "posterList" >

        {reviews.map((r) => {
          const game = games.find(g => Number(g.id) === Number(r.gameId));
          return (
            <PosterCard game={game} gameName={r.gameName} rating={r.rating} reviewText={r.reviewText}/>
          );
        })}
    </div>
  );
}
