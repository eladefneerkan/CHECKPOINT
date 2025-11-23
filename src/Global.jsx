import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../Frontend/Auth.jsx";

export default function GlobalUI() {
  const { user } = useAuth();

  return (
    <div>
      <header
        style={{
          background: "linear-gradient(90deg,#0f1724,#071126)",
          color: "red",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#ffffff" }}>
          🎮 CHECKPOINT
        </h1>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link to="/">Home Page</Link>
          <Link to="/list">Search Games</Link>
          <Link to="/profile" onClick={() => window.dispatchEvent(new Event('resetProfileToProfileTab'))}>Profile</Link>

          {user ? (
            <Link to="/profile">
              <img
                src={user.profilePicture}
                alt="pfp"
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />
            </Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      <main style={{ padding: 0, margin: 0 }}>
        <Outlet />
      </main>

      <footer
        style={{
          background: "#000000",
          color: "white",
          padding: "1rem",
          marginTop: "2rem",
          width: "100%",
        }}
      >
        <p>Development Team: Vaishnavi Sam, Ela Defne Erkan, Anam Siddiqui, Jeffrey Joseph, Allison Gao</p>
      </footer>
    </div>
  );
}
