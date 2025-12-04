import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import GlobalUI from "./Global.jsx";
import Home from "../Frontend/Home.jsx";
import GameSearch from "../Frontend/GameSearch.jsx";
import Profile from "../Frontend/Profile.jsx";
import SignInPg from "../Frontend/SignInPg.jsx";
import SignUpPg from "../Frontend/SignUpPg.jsx";
import VerifyEmail from "../Frontend/VerifyEmail.jsx";
import "./styles.css";
import PageTransition from "../Frontend/PageTransition.jsx";
import GamePage from "../Frontend/GamePage.jsx"
import SearchUsers from "../Frontend/SearchUsers.jsx";
import OtherUserProfile from "../Frontend/OtherUserProfile.jsx";
import GameListDetail from "../Frontend/GameListDetail.jsx";



export default function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* GlobalUI provides shared layout, navbar, etc. */}
      <Route path="/" element={<GlobalUI />}>
        <Route index element={<PageTransition><Home /></PageTransition>} />
        <Route path="gameSearch" element={<PageTransition><GameSearch /></PageTransition>} />
        <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="login" element={<PageTransition><SignInPg /></PageTransition>} />
        <Route path="signup" element={<PageTransition><SignUpPg /></PageTransition>} />
        <Route path="verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="game/:id" element={<PageTransition><GamePage /></PageTransition>} />
        <Route path="searchUsers" element={<PageTransition><SearchUsers /></PageTransition>} />
        <Route path="user/:id" element={<PageTransition><OtherUserProfile /></PageTransition>} />
        <Route path="lists/:listId" element={<PageTransition><GameListDetail /></PageTransition>} />
        {/* <Route path="review" element={<ReviewModel />} /> */}
      </Route>
    </Routes>
  );
}
