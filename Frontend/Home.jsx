import grassBg from "../assets/grass_bg.avif";
import {useNavigate} from 'react-router-dom';
import Flag from '../assets/Flag.png';
function PotionBackground() {
  const bubbles = Array.from({ length: 10 }, (_, i) => 10 + Math.random() * 10);

const [currentSlide, setCurrentSlide] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  }, 3000); // 3 seconds

  return () => clearInterval(interval);
}, []);


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

        {/* ⭐ IMAGE CAROUSEL ⭐ */}
      <div
        style={{
          marginTop: "2rem",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          position: "relative",
          overflow: "hidden",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.4)"
        }}
      >
        <div
          className="carousel-track"
          style={{
            display: "flex",
            width: "300%",
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: "transform 0.8s ease-in-out"
          }}
        >
          <img
            src="https://via.placeholder.com/1200x400/ff4444/ffffff?text=Banner+1"
            alt="banner1"
            style={{ width: "100%", objectFit: "cover" }}
          />
          <img
            src="https://via.placeholder.com/1200x400/44ff44/ffffff?text=Banner+2"
            alt="banner2"
            style={{ width: "100%", objectFit: "cover" }}
          />
          <img
            src="https://via.placeholder.com/1200x400/4444ff/ffffff?text=Banner+3"
            alt="banner3"
            style={{ width: "100%", objectFit: "cover" }}
          />
        </div>

        <button
          onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
          style={navBtnStyle}
        >
          ◀
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))}
          style={{ ...navBtnStyle, right: 0 }}
        >
          ▶
        </button>
      </div>

       {/*<button className="btn-secondary"  onClick={() => navButtonToPage('/login')}>LOGIN</button>
        <button className="btn-secondary" onClick={() => navButtonToPage('/signup')}>SIGN UP</button>    */   } 
      </div>
    </section>
  );
}