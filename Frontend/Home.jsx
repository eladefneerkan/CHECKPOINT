import grassBg from "../assets/grass_bg.avif";
import {useNavigate} from 'react-router-dom';
import Flag from '../assets/Flag.png';
function PotionBackground() {
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
export default function Home() {
  const navButtonToPage = useNavigate()
  return (
    
    <section
      className="fade-in"
      style={{
        /*backgroundImage: `url(${grassBg})`,*/
        backgroundImage: "linear-gradient(to top, #5c2affff, black)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        position: "relative",
        width: "100vw"
      }}
    >
      <PotionBackground />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          CHECKPOINT
        </h1>
        <p style={{ fontSize: "1.5rem" }}>
          Track, share, and discover your <i>new</i> favorite games
        </p>
        <h2 className='section-heading'>Rising games...</h2>
        <ul class="poster-list -p70 -grid">
          <li class="posteritem"> <img src={Flag} class="posterimg"/></li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
          <li class="posteritem">AAA</li>
        </ul>
       {/*<button className="btn-secondary"  onClick={() => navButtonToPage('/login')}>LOGIN</button>
        <button className="btn-secondary" onClick={() => navButtonToPage('/signup')}>SIGN UP</button>    */   } 
      </div>
    </section>
  );
}