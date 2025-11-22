import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GlobalUI() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/users/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setUser(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <header
        style={{
          background: "#000000",
          color: "red",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#ffffff" }}>
          🎮 CHECKPOINT
        </h1>

        <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <Link to="/">Home Page</Link>
          <Link to="/list">Search Games</Link>
          <Link to="/profile" onClick={() => window.dispatchEvent(new Event('resetProfileToProfileTab'))}>Profile</Link>

          {/*If logged in show PFP  else show Login */}
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
        <p>This is our footer! Gonna write our names here</p>
      </footer>
    </div>
  );
}
