
//component that returns the bubble potion effect in the background
export default function PotionBubbles() {
  const bubbles = Array.from({ length: 10 }, (_, i) => 10 + Math.random() * 10);

  return (
    <div className="potion-background">
      {bubbles.map((_, i) => (
        <div

          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${bubbles[i]}px`,
            height: `${bubbles[i]}px`,
            animationDuration: `${10 + Math.random() *15}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>
  );
}

