import React, { useState, useEffect } from "react";
import GameObj from "./models/GameObj.js";
import GameComp from "./GameObj.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function PublicListDetail() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const { user: authUser } = useAuth();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwner =
    authUser && list && list.userId === authUser._id;

  const defaultImages = [
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png",
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_green.png",
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_purple.png",
    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_red.png",
  ];

  const getCoverImage = (list) => {
    if (list.coverImage) return list.coverImage;
    if (list.games?.length > 0 && list.games[0].background_image)
      return list.games[0].background_image;

    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  useEffect(() => {
    fetchList();
  }, [listId]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Try PRIVATE route (owner only + public lists)
      if (token) {
        const privateRes = await fetch(
          `http://localhost:3000/gameLists/${listId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (privateRes.ok) {
          const privateData = await privateRes.json();
          setList(privateData);
          setLoading(false);
          return;
        }
      }

      // 2️⃣ Fallback to PUBLIC route
      const publicRes = await fetch(
        `http://localhost:3000/gameLists/public/${listId}`
      );

      if (publicRes.ok) {
        const publicData = await publicRes.json();
        setList(publicData);
      } else {
        setList(null);
      }

    } catch (err) {
      console.error("Error loading list:", err);
      setList(null);
    }

    setLoading(false);
  };

  if (loading)
    return <h2 style={{ color: "white", textAlign: "center" }}>Loading...</h2>;

  if (!list)
    return (
      <h2 style={{ color: "white", textAlign: "center" }}>
        List not found or private
      </h2>
    );

  const gameObjects = (list.games || []).map((game) => {
    return new GameObj(
      game.id ?? 0,
      game.name ?? "Unknown Game",
      game.slug ?? "",
      game.released ?? "",
      game.rating ?? 0,
      game.description ?? "No description available.",
      game.background_image ?? "",
      game.genres ?? []
    );
  });

  return (
    <div style={{ color: "white", maxWidth: "650px", margin: "auto" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        ← Back
      </button>

      <div style={{ marginBottom: "20px" }}>
        <img
          src={getCoverImage(list)}
          alt="List Cover"
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        />

        <h1 style={{ marginTop: 0 }}>{list.title}</h1>
        <p style={{ fontSize: "16px", color: "#bbb" }}>
          {list.description || "No description"}
        </p>

        <p style={{ fontSize: "14px", color: "#999" }}>
          {list.games.length} game{list.games.length !== 1 ? "s" : ""}
        </p>

        {/* ✨ Owner-only buttons */}
        {isOwner && (
          <div style={{ marginTop: "15px" }}>
            <button
              onClick={() => navigate(`/profile/lists/${list._id}`)}
              style={{
                padding: "10px 20px",
                marginRight: "10px",
                backgroundColor: "#0d6efd",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ✏ Edit List
            </button>
          </div>
        )}
      </div>

      <hr style={{ borderColor: "#444", margin: "30px 0" }} />

      <h2>Games in this list</h2>

      {gameObjects.length === 0 ? (
        <p style={{ color: "#999" }}>No games in this list.</p>
      ) : (
        <div style={{ gap: "15px" }}>
          {gameObjects.map((game) => (
            <div
              key={game.id}
              style={{
                background: "rgba(255,255,255,0.02)",
                padding: 8,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <GameComp game={game} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
