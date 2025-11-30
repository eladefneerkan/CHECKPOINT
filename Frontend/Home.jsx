import grassBg from "../assets/grass_bg.avif";
import {useNavigate} from 'react-router-dom';

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
        <button className="btn-secondary"  onClick={() => navButtonToPage('/login')}>LOGIN</button>
        <button className="btn-secondary" onClick={() => navButtonToPage('/signup')}>SIGN UP</button>        
      </div>
    </section>
  );
}