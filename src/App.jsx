import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import GlobalUI from "./Global.jsx";
import Home from "../Frontend/Home.jsx";
import List from "../Frontend/List.jsx";
import Profile from "../Frontend/Profile.jsx";
import SignInPg from "../Frontend/SignInPg.jsx";
import SignUpPg from "../Frontend/SignUpPg.jsx";
import VerifyEmail from "../Frontend/VerifyEmail.jsx";
import "./styles.css";
import ReviewModel from "../Frontend/Review.jsx";

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
        <Route path="login" element={<SignInPg />} />
        <Route path="signup" element={<SignUpPg />} />
        <Route path="verify-email" element={<VerifyEmail />} />
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

