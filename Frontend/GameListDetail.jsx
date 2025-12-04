import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./Auth";
import GameComp from "./GameObj.jsx";
import GameObj from "./models/GameObj.js";

export default function GameListDetail() {
  const { listId } = useParams();                 // ✅ FIXED — get from URL
  const { user: authUser } = useAuth();           // ✅ current logged in user
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");

  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteListConfirm, setDeleteListConfirm] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  // ✅ REAL OWNER CHECK
  const isOwner = authUser && list && authUser._id === list.userId;

  useEffect(() => {
    fetchListDetail();
  }, [listId]);

  const fetchListDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3000/gameLists/${listId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) {
        setList(null);
        setLoading(false);
        return;
      }

      setList(data);
      setEditTitle(data.title);
      setEditDescription(data.description || "");
      setEditCoverImage(data.coverImage || "");

      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveListChanges = async () => {
    try {
      const updateData = {
        title: editTitle,
        description: editDescription,
      };

      if (coverImagePreview) updateData.coverImage = coverImagePreview;
      else updateData.coverImage = editCoverImage;

      const res = await fetch(`http://localhost:3000/gameLists/${listId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const json = await res.json();
      setList(json.list);
      setEditMode(false);
      setCoverImageFile(null);
      setCoverImagePreview("");

      setSuccessMessage("List updated!");
      setTimeout(() => setSuccessMessage(""), 2000);

    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/gameLists/${listId}/games/${gameId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      setList(json.list);

      setSuccessMessage("Game removed!");
      setTimeout(() => setSuccessMessage(""), 2000);

    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteList = async () => {
    try {
      await fetch(`http://localhost:3000/gameLists/${listId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/profile");
      setTimeout(() => window.dispatchEvent(new Event("openProfileListsTab")), 150);

    } catch (e) {
      console.error(e);
    }
  };

  const getCoverImage = () => {
    if (coverImagePreview) return coverImagePreview;
    if (editCoverImage) return editCoverImage;

    if (list?.games?.length > 0) {
      return list.games[0].background_image;
    }

    const defaults = [
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_green.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_purple.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_red.png",
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  if (loading)
    return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;

  if (!list)
    return <div style={{ color: "white", textAlign: "center" }}>List not found</div>;

  const gameObjects = (list.games || []).map((g) =>
    new GameObj(
      g.id,
      g.name,
      g.slug,
      g.released,
      g.rating,
      g.description,
      g.background_image,
      g.genres
    )
  );

  return (
    <div style={{ color: "white", maxWidth: "650px", margin: "auto" }}>

      {successMessage && (
        <div style={{
          backgroundColor: "#10b981",
          color: "white",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px",
          textAlign: "center",
        }}>
          {successMessage}
        </div>
      )}

      <button
        onClick={() => navigate("/profile")}
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

      {/* ---------------------- OWNER VIEW ---------------------- */}
      {!editMode && isOwner && (
        <>
          <img
            src={getCoverImage()}
            alt="List cover"
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "15px",
            }}
          />

          <h1>{list.title}</h1>
          <p style={{ fontSize: "16px", color: "#bbb" }}>
            {list.description || "No description"}
          </p>

          <p style={{ fontSize: "14px", color: "#999" }}>
            {list.games.length} game{list.games.length !== 1 ? "s" : ""}
          </p>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Edit List
            </button>

            <button
              onClick={() => navigate(`/list?addToList=${listId}`)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              + Add Game
            </button>

            <button
              onClick={async () => {
                const res = await fetch(
                  `http://localhost:3000/gameLists/${listId}/privacy`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isPublic: !list.isPublic }),
                  }
                );

                const json = await res.json();
                setList({ ...list, isPublic: json.isPublic });

                setSuccessMessage(
                  json.isPublic ? "List is now PUBLIC" : "List is now PRIVATE"
                );
                setTimeout(() => setSuccessMessage(""), 2000);
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: list.isPublic ? "#e52f3e" : "#22c55e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {list.isPublic ? "Make Private" : "Make Public"}
            </button>

            <button
              onClick={() => setDeleteListConfirm(true)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#e52f3e",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Delete List
            </button>
          </div>
        </>
      )}

      {/* ---------------------- GAMES ---------------------- */}
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
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 8px",
                borderRadius: 8,
                background: "rgba(255,255,255,0.02)",
                width: "100%",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <GameComp game={game} />
              </div>

              {/* DELETE BUTTON ONLY IF OWNER */}
              {isOwner && (
                <button
                  onClick={() => setDeleteConfirm(game.id)}
                  style={{
                    backgroundColor: "#e52f3e",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    width: "36px",
                    height: "36px",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------------------- DELETE GAME MODAL ---------------------- */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              backgroundColor: "#222",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "400px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "white" }}>Delete Game?</h2>
            <p style={{ color: "#bbb" }}>Remove this game from your list?</p>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                No
              </button>

              <button
                onClick={() => handleDeleteGame(deleteConfirm)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e52f3e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- DELETE LIST MODAL ---------------------- */}
      {deleteListConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setDeleteListConfirm(false)}
        >
          <div
            style={{
              backgroundColor: "#222",
              borderRadius: "8px",
              padding: "30px",
              maxWidth: "420px",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "white" }}>Delete List?</h2>
            <p style={{ color: "#bbb" }}>
              This will permanently delete the list. Are you sure?
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteListConfirm(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                No
              </button>

              <button
                onClick={() => handleDeleteList()}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#e52f3e",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
