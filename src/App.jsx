import { Routes, Route } from "react-router-dom";
import GlobalUI from "./Global.jsx"; 
import List from "../Frontend/List.jsx";
import Profile from "../Frontend/Profile.jsx";
//need to add other pages here as we go

export default function App() {
  return (
    <Routes>
      {/* GlobalUI wraps all pages */}
      <Route path="/" element={<GlobalUI />}>
        <Route index element={<h1>Welcome Home</h1>} />
        <Route path="list" element={<List />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
