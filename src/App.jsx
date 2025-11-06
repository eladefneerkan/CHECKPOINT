import { Routes, Route } from "react-router-dom";
import GlobalUI from "./Global.jsx"; 
import List from "../Frontend/List.jsx";
import Profile from "../Frontend/Profile.jsx";
import Home from "../Frontend/Home.jsx";

export default function App() {
  return (
    <Routes>
      {/* GlobalUI */}
      <Route path="/" element={<GlobalUI />}>
        <Route index element={<Home />} />
        <Route path="list" element={<List />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}


/* -------------------------------------------------------------------------------- */
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
