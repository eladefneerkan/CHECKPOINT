import React, { useState, useEffect } from "react";
import GameListDetail from "./GameListDetail.jsx";

export default function GameListManager() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch("http://localhost:3000/gameLists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setLists(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching lists:", err);
      setLoading(false);
    }
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) {
      alert("Please enter a list title");
      return;
    }

    // Generate a default cover image
    const defaultImages = [
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_green.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_purple.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_red.png",
    ];
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    const defaultCoverImage = defaultImages[randomIndex];

    try {
      const response = await fetch("http://localhost:3000/gameLists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newListTitle,
          description: "",
          coverImage: defaultCoverImage,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        alert(err.error || err.message || "Failed to create list");
        return;
      }

      const result = await response.json();
      setLists([result.list, ...lists]);
      setNewListTitle("");
      setShowCreateForm(false);
      setSuccessMessage("List created successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error creating list:", err);
      alert("Failed to create list");
    }
  };

  const getListCoverImage = (list) => {
    if (list.coverImage) return list.coverImage;
    if (list.games && list.games.length > 0) {
      return list.games[0].background_image;
    }
    const defaultImages = [
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_green.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_purple.png",
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_red.png",
    ];
  
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
  };
  

  if (selectedListId) {
    return (
      <GameListDetail
        listId={selectedListId}
        onBack={() => {
          setSelectedListId(null);
          fetchLists();
        }}
      />
    );
  }

  if (loading) {
    return <div style={{ color: "white", textAlign: "center" }}>Loading lists...</div>;
  }

  return (
    <div style={{ color: "white" }}>
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

      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: "12px 24px",
            marginBottom: "30px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          + Add a New List
        </button>
      ) : (
        <div
          style={{
            backgroundColor: "#333",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Create a New List</h2>
          <input
            type="text"
            placeholder="Enter list name (e.g., Favorites, Completed, Wishlist)"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateList();
              }
            }}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "15px",
              border: "1px solid #555",
              borderRadius: "4px",
              backgroundColor: "#222",
              color: "white",
              boxSizing: "border-box",
              fontSize: "14px",
            }}
            autoFocus
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleCreateList}
              style={{
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewListTitle("");
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

      {lists.length === 0 ? (
        <div style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
          <p>No lists yet. Create one to get started!</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {lists.map((list) => (
            <div
              key={list._id}
              onClick={() => setSelectedListId(list._id)}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
              }}
            >
              <img
                src={getListCoverImage(list)}
                alt={list.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "5px" }}>
                  {list.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  {list.games.length} game{list.games.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
