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
