import React, { useState } from "react";

export default function AddToListModal({
  lists,
  game,
  onClose,
  onAddToLists,
  onCreateNewList,
}) {
  const [selectedLists, setSelectedLists] = useState([]);
  const [showCreateNew, setShowCreateNewList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const handleListToggle = (listId) => {
    setSelectedLists((prev) =>
      prev.includes(listId)
        ? prev.filter((id) => id !== listId)
        : [...prev, listId]
    );
  };

  const handleConfirm = async () => {
    if (selectedLists.length === 0) {
      alert("Please select at least one list");
      return;
    }

    await onAddToLists(selectedLists, game);
    setSelectedLists([]);
    onClose();
  };

  const handleCreateNewListSubmit = async () => {
    if (!newListTitle.trim()) {
      alert("Please enter a list title");
      return;
    }

    const newList = await onCreateNewList(newListTitle);
    if (newList) {
      setNewListTitle("");
      setShowCreateNewList(false);
      // Auto-select the newly created list
      setSelectedLists([newList._id]);
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "400px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0, color: "#333" }}>Add "{game.name}" to List</h2>

        {!showCreateNew ? (
          <>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Select one or more lists:
            </p>

            {lists && lists.length > 0 ? (
              <div style={{ marginBottom: "20px" }}>
                {lists.map((list) => (
                  <label
                    key={list._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "4px",
                      backgroundColor: selectedLists.includes(list._id)
                        ? "#e3f2fd"
                        : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedLists.includes(list._id)}
                      onChange={() => handleListToggle(list._id)}
                      style={{ marginRight: "10px", cursor: "pointer" }}
                    />
                    <span style={{ color: "#333" }}>
                      {list.title} ({list.games.length} games)
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p style={{ color: "#999", marginBottom: "15px" }}>
                You don't have any lists yet. Create one below!
              </p>
            )}

            <button
              onClick={() => setShowCreateNewList(true)}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              + Create New List
            </button>

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={selectedLists.length === 0}
                style={{
                  padding: "10px 20px",
                  backgroundColor:
                    selectedLists.length === 0 ? "#ccc" : "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    selectedLists.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: "#666", marginBottom: "15px" }}>
              Enter the name of your new list:
            </p>
            <input
              type="text"
              placeholder="e.g., Favorites, Completed, Wishlist"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCreateNewListSubmit();
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                boxSizing: "border-box",
                fontSize: "14px",
              }}
              autoFocus
            />

            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowCreateNewList(false)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={handleCreateNewListSubmit}
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
