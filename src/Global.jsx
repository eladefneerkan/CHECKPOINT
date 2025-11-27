import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../Frontend/Auth.jsx";
import { useState } from "react";

export default function GlobalUI() {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div>
      <header
        style={{
          background: "linear-gradient(90deg,#0f1724,#071126)",
          color: "white",
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
          <Link to="/" style={{ color: "white" }}>Home Page</Link>
          <div style={{ position: "relative" }}>
            <span
              style={{ cursor: "pointer", color: "white" }}
              onClick={() => setShowSearch(prev => !prev)}
            >
              Search ▾
            </span>

            {showSearch && (
              <div
                style={{
                  position: "absolute",
                  top: "2.3rem",
                  left: "-0.8rem",
                  background: "rgba(0,0,0,0.85)",
                  padding: "1rem 1.4rem",
                  borderRadius: 10,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                  zIndex: 50,
                  minWidth: "140px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(6px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <Link
                  to="/list"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                  onClick={() => setShowSearch(false)}
                >
                  Search Games
                </Link>

                <Link
                  to="/search-users"
                  style={{
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                  onClick={() => setShowSearch(false)}
                >
                  Search Users
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/profile"
            onClick={() =>
              window.dispatchEvent(new Event("resetProfileToProfileTab"))
            }
            style={{ color: "white" }}
          >
            Profile
          </Link>

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
            <Link to="/login" style={{ color: "white" }}>Login</Link>
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
        <p>
          Development Team: Vaishnavi Sam, Ela Defne Erkan, Anam Siddiqui,
          Jeffrey Joseph, Allison Gao
        </p>
      </footer>
    </div>
  );
}
