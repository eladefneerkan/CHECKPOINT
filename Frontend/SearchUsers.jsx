// Frontend/SearchUsers.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./Auth";

export default function SearchUsers() {
  const { user: authUser } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/users");
      const data = await res.json();

      const filtered = data.filter(
        (u) =>
          u.username.toLowerCase().includes(query.toLowerCase()) &&
          u.username !== authUser.username
      );

      setResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  };

  const friendAction = async (url, method = "POST") => {
    const token = localStorage.getItem("token");
    return fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  };

  const getStatus = (target) => {
    const me = authUser;

    if (me.friends?.some((f) => f._id === target._id)) return "friends";
    if (me.friendRequestsSent?.some((id) => id === target._id)) return "sent";
    if (me.friendRequestsReceived?.some((id) => id === target._id)) return "received";

    return "none";
  };

  return (
    <div style={{ color: "white", padding: "2rem" }}>
      <h1>User Search</h1>

      <input
        type="text"
        placeholder="Search usernames…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && searchUsers()}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #555",
          marginRight: "10px",
        }}
      />

      <button
        onClick={searchUsers}
        style={{
          padding: "10px 14px",
          borderRadius: "6px",
          background: "#2563eb",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Search
      </button>

      <div style={{ marginTop: "2rem" }}>
        {loading && <p>Searching...</p>}

        {results.map((u) => {
          const status = getStatus(u);

          return (
            <div
              key={u._id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                background: "rgba(255,255,255,0.06)",
                padding: "1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                width: "400px",
              }}
            >
              <img
                src={u.profilePicture}
                alt="pfp"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid white",
                }}
              />

              <strong>{u.username}</strong>

              {status === "none" && (
                <button
                  onClick={() =>
                    friendAction(`/users/friends/request/${u._id}`).then(() =>
                      alert("Friend request sent")
                    )
                  }
                  style={{
                    marginLeft: "auto",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Add Friend
                </button>
              )}

              {status === "sent" && (
                <button
                  onClick={() =>
                    friendAction(`/users/friends/cancel/${u._id}`).then(() =>
                      alert("Friend request canceled")
                    )
                  }
                  style={{
                    marginLeft: "auto",
                    background: "#gray",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel Request
                </button>
              )}

              {status === "received" && (
                <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={() =>
                      friendAction(`/users/friends/accept/${u._id}`).then(() =>
                        alert("Friend request accepted")
                      )
                    }
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      friendAction(`/users/friends/reject/${u._id}`).then(() =>
                        alert("Friend request rejected")
                      )
                    }
                    style={{
                      background: "#cc0000",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {status === "friends" && (
                <button
                  onClick={() =>
                    friendAction(`/users/friends/remove/${u._id}`, "DELETE").then(() =>
                      alert("Friend removed")
                    )
                  }
                  style={{
                    marginLeft: "auto",
                    background: "#cc0000",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
