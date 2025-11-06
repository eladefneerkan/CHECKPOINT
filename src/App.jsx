import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import GlobalUI from "./Global.jsx";
import Home from "../Frontend/Home.jsx";
import List from "../Frontend/List.jsx";
import Profile from "../Frontend/Profile.jsx";
import Login from "../Frontend/Login.jsx";
import "./styles.css";

export default function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //http://localhost:3000/users
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <Routes>
      {/* GlobalUI provides shared layout, navbar, etc. */}
      <Route path="/" element={<GlobalUI users={users} />}>
        <Route index element={<Home users={users} />} />
        <Route path="list" element={<List users={users} />} />
        <Route path="profile" element={<Profile />} />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
}

/*
export default function List({ users }) {
  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
}
*/