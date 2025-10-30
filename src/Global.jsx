import { Outlet, Link } from "react-router-dom"
//Link is single app behaviour
//Outler is just a prop :P for pages

export default function GlobalUI() {
    return ( //add stuff inside div to add global ui syntax
      <div>
        <header style {{background: "#123", color: "red", padding: "1rem"}}>
            <nav>
                <Link to "/">Home Page</Link> |{" "}
                <Link to "/list">Search Games</Link> |{" "}
                <Link to "/profile">Profile</Link>
            </nav>
        
      </div>  
    )
}