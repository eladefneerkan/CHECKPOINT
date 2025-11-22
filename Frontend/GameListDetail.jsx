import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameComp from "./GameObj.jsx";
import GameObj from "./models/GameObj.js";

export default function GameListDetail({ listId, onBack }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchListDetail();
  }, [listId]);

  const fetchListDetail = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/gameLists/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setList(data);
      setEditTitle(data.title);
      setEditDescription(data.description);
      setEditCoverImage(data.coverImage || "");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching list detail:", err);
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please select a valid image file");
    }
  };

  const handleSaveListChanges = async () => {
    try {
      const updateData = {
        title: editTitle,
        description: editDescription,
      };

      // If a new cover image was selected, use it, otherwise use existing
      if (coverImageFile) {
        updateData.coverImage = coverImagePreview;
      } else if (editCoverImage !== list.coverImage) {
        updateData.coverImage = editCoverImage;
      }

      const response = await fetch(
        `http://localhost:3000/gameLists/${listId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const updatedList = await response.json();
      setList(updatedList.list);
      setEditMode(false);
      setCoverImageFile(null);
      setCoverImagePreview("");
      setSuccessMessage("List updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating list:", err);
      alert("Failed to update list");
    }
  };

  const handleDeleteGame = async (gameId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/gameLists/${listId}/games/${gameId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedList = await response.json();
      setList(updatedList.list);
      setDeleteConfirm(null);
      setSuccessMessage("Game removed from list!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting game:", err);
      alert("Failed to remove game");
    }
  };

  const getCoverImage = () => {
    if (coverImagePreview) return coverImagePreview;
    if (editCoverImage) return editCoverImage;
    if (list && list.games && list.games.length > 0) {
      return list.games[0].background_image;
    }
    return "/grass_bg.avif";
  };

  if (loading) {
    return <div style={{ color: "white", textAlign: "center" }}>Loading...</div>;
  }

  if (!list) {
    return (
      <div style={{ color: "white", textAlign: "center" }}>
        List not found
      </div>
    );
  }

  const gameObjects = list.games.map((game) => {
    return new GameObj(
      game._id,
      game.name,
      game.slug,
      game.released,
      game.rating,
      game.description,
      game.background_image,
      game.genres
    );
  });

  return (
    <div style={{ color: "white", maxWidth: "650px", margin: "auto" }}>
      {successMessage && (
        <div
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          {successMessage}
        </div>
      )}

      <button
        onClick={onBack}
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
        ← Back to Lists
      </button>

      {!editMode ? (
        <>
          <div style={{ marginBottom: "20px" }}>
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
            <h1 style={{ marginTop: 0 }}>{list.title}</h1>
            <p style={{ fontSize: "16px", color: "#bbb" }}>
              {list.description || "No description"}
            </p>
            <p style={{ fontSize: "14px", color: "#999" }}>
              {list.games.length} game{list.games.length !== 1 ? "s" : ""} in
              this list
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
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
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                + Add Game
              </button>
            </div>
          </div>

          <hr style={{ borderColor: "#444", margin: "30px 0" }} />

          <h2>Games in this list</h2>
          {gameObjects.length === 0 ? (
            <p style={{ color: "#999" }}>
              No games in this list yet. Click "Add Game" to get started!
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {gameObjects.map((game) => (
                <div key={game.id} style={{ position: "relative" }}>
                  <GameComp game={game} />
                  <button
                    onClick={() => setDeleteConfirm(game.id)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      cursor: "pointer",
                      fontSize: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                    title="Remove game"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ marginBottom: "20px" }}>
          <h2>Edit List</h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px" }}>
              Cover Image:
            </label>
            <img
              src={getCoverImage()}
              alt="Cover preview"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "10px",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              style={{ marginBottom: "15px" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Title:
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #444",
                borderRadius: "4px",
                backgroundColor: "#333",
                color: "white",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Description:
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #444",
                borderRadius: "4px",
                backgroundColor: "#333",
                color: "white",
                boxSizing: "border-box",
                minHeight: "100px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSaveListChanges}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save Changes
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setCoverImageFile(null);
                setCoverImagePreview("");
                setEditTitle(list.title);
                setEditDescription(list.description);
                setEditCoverImage(list.coverImage);
              }}
              style={{
                padding: "10px 20px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "white", marginTop: 0 }}>Delete Game?</h2>
            <p style={{ color: "#bbb" }}>
              Do you want to delete this game from your list?
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
              <button
                onClick={() => handleDeleteGame(deleteConfirm)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
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
