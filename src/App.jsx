import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import GlobalUI from "./Global.jsx";
import Home from "../Frontend/Home.jsx";
import List from "../Frontend/List.jsx";
import Profile from "../Frontend/Profile.jsx";
import SignInPg from "../Frontend/SignInPg.jsx";
import SignUpPg from "../Frontend/SignUpPg.jsx";
import VerifyEmail from "../Frontend/VerifyEmail.jsx";
import "./styles.css";
import PageTransition from "../Frontend/PageTransition.jsx";
import ReviewModel from "../Frontend/Review.jsx";

export default function App() {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    //http://localhost:3000/users
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  return (
    <Routes location={location} key={location.pathname}>
      {/* GlobalUI provides shared layout, navbar, etc. */}
      <Route path="/" element={<GlobalUI users={users} />}>
        <Route index element={<PageTransition><Home users={users} /></PageTransition>} />
        <Route path="list" element={<PageTransition><List users={users} /></PageTransition>} />
        <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="login" element={<PageTransition><SignInPg /></PageTransition>} />
        <Route path="signup" element={<PageTransition><SignUpPg /></PageTransition>} />
        <Route path="verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
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

