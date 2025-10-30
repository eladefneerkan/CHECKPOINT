import { Outlet, Link } from "react-router-dom";
// Link = single-page navigation
// Outlet = placeholder for routed pages

export default function GlobalUI() {
  return ( 
    <div>
      <header
        style={{
        background: "#123",
        color: "red",
        padding: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
        }}
      >
    {/* Left side — site name */}
    <h1 style={{ margin: 0, fontSize: "1.5rem" }}>🎮 CHECKPOINT</h1>
    {/* Right side — navigation */}
    
  <nav style={{ display: "flex", gap: "2rem" }}>
    <Link to="/">Home Page</Link>
    <Link to="/list">Search Games</Link>
    <Link to="/profile">Profile</Link>
  </nav>
</header>


      <main style={{ padding: 0, margin: 0 }}>
        <Outlet />
      </main>

      <footer style={{ 
        background: "#123",
        color: "red",
        padding: "1rem",
        marginTop: "2rem",
        width: "100%",
      }}>
        <p>This is our footer! Gonna write our names here</p>
      </footer>
    </div>
  );
}
