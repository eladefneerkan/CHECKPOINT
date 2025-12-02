import grassBg from "../assets/grass_bg.avif";
import FrogBanner from "../assets/ad_banner_green.png";
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

      <div 
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <button
          onClick={() => window.open("https://agsiddiqui.itch.io/afterworld", "_blank")}
          style={{
            border: "none",
            background: "transparent",
            padding: 0,
            cursor: "pointer",
          }}
        >
          <img 
            src={FrogBanner} 
            alt="Frog Banner"
            style={{
              width: "90%",
              maxWidth: "800px",
              borderRadius: "10px",
              boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            }}
          />
        </button>
      </div>


       {/*<button className="btn-secondary"  onClick={() => navButtonToPage('/login')}>LOGIN</button>
        <button className="btn-secondary" onClick={() => navButtonToPage('/signup')}>SIGN UP</button>    */   } 
      </div>
    </section>
  );
}

/*import { useNavigate } from "react-router-dom";
import Flag from "../assets/Flag.png";
import { useState, useEffect } from "react";



export default function Home() {
  const navButtonToPage = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const navBtnStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: 0,
    background: "rgba(0,0,0,0.4)",
    color: "white",
    border: "none",
    fontSize: "2rem",
    padding: "0.3rem 0.6rem",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "0.2s",
    zIndex: 10
  };

  return (
    <section
      className="fade-in"
      style={{
        backgroundImage: "linear-gradient(to top, #5c2affff, black)",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textAlign: "center",
        position: "relative",
        width: "100vw",
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
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>CHECKPOINT</h1>
        <p style={{ fontSize: "1.5rem" }}>
          Track, share, and discover your <i>new</i> favorite games
        </p>

        <h2 className="section-heading">Rising games...</h2>
        <ul className="poster-list -p70 -grid">
          <li className="posteritem">
            <img src={Flag} className="posterimg" />
          </li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
          <li className="posteritem">AAA</li>
        </ul>

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
              flexWrap: 'nowrap',
              justifyContent: 'space-between',
              display: "flex",
              
              width: "300%",
              transform: `translateX(-${currentSlide * 100}%)`,
              transition: "transform 2s ease-in-out",
            }}
          >
            <img
              src="https://i.pinimg.com/736x/1b/f0/76/1bf0764da001f8914823615777ddce90.jpg"
              alt="b1"
              style={{ width: '50px', objectFit: "cover" }}
            />
            <img
              src="https://i.pinimg.com/736x/1b/f0/76/1bf0764da001f8914823615777ddce90.jpg"
              alt="b2"
              style={{ width: '50px', objectFit: "cover" }}
            />
            <img
              src="https://i.pinimg.com/736x/1b/f0/76/1bf0764da001f8914823615777ddce90.jpg"
              alt="b3"
              style={{ width: '50px', objectFit: "cover" }}
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
      </div>
    </section>
  );
}

function PotionBackground() {
  const bubbles = Array.from({ length: 10 }, () => 10 + Math.random() * 10);

  return (
    <div className="potion-background">
      {bubbles.map((size, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDuration: `${10 + Math.random() * 15}s`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        ></div>
      ))}
    </div>
  );
}*/