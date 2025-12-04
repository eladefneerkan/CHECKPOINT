import { useEffect, useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export default function SearchUsers() {
  const { user: authUser } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const searchUsers = async () => {
    if (!authUser) {
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/users/search?q=${encodeURIComponent(query.trim())}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      
      if (!res.ok) {
        throw new Error("Search failed");
      }
      
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }

    setLoading(false);
  };

  const friendAction = async (e, url, method = "POST") => {
    e.stopPropagation();

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

    if (!me) return "none";

    if (me.friends?.some((f) => f._id === target._id)) return "friends";
    if (me.friendRequestsSent?.includes(target._id)) return "sent";
    if (me.friendRequestsReceived?.includes(target._id)) return "received";

    return "none";
  };

  return (
    <section style={{ backgroundImage: "linear-gradient(to top, #000000ff, #003632ff)", minHeight: "100vh" }}>
      <div style={{ alignItems: 'center', color: "white", padding: "2rem", display: 'flex', flexDirection: 'column' }}>
        <h1>User Search</h1>
        
        <div style={{ position: 'relative', width: '650px', display: 'flex' }}>
          <input
            type="text"
            placeholder="Search usernames…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            className={`search-bar-base${results.length > 0 ? ' search-bar-active' : ''}`}
          />

          <button
            onClick={searchUsers}
            className='search-button'
          >
            Search
          </button>
        </div>

        <div style={{ marginTop: "2rem" }}>
          {!authUser && (
            <p style={{ color: "#cccccc", fontSize: "1.1rem", marginTop: "1rem" }}>
              Please log in to search users.
            </p>
          )}

          {loading && <p>Searching...</p>}

          {authUser && !loading && hasSearched && results.length === 0 && (
            <p style={{ color: "#cccccc", fontSize: "1.1rem" }}>No results</p>
          )}

          {results.map((u) => {
            const status = getStatus(u);

            return (
              <div
                key={u._id}
                onClick={() => navigate(`/user/${u._id}`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  background: "rgba(255,255,255,0.06)",
                  padding: "1rem",
                  borderRadius: "10px",
                  marginBottom: "1rem",
                  width: "400px",
                  cursor: "pointer",
                  transition: "0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
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

                {/* FRIEND BUTTONS */}
                {status === "none" && (
                  <button
                    onClick={(e) =>
                      friendAction(e, `/users/friends/request/${u._id}`).then(() =>
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
                    onClick={(e) =>
                      friendAction(e, `/users/friends/cancel/${u._id}`).then(() =>
                        alert("Friend request canceled")
                      )
                    }
                    style={{
                      marginLeft: "auto",
                      background: "gray",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}

                {status === "received" && (
                  <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={(e) =>
                        friendAction(e, `/users/friends/accept/${u._id}`).then(() =>
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
                      onClick={(e) =>
                        friendAction(e, `/users/friends/reject/${u._id}`).then(() =>
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
                    onClick={(e) =>
                      friendAction(e, `/users/friends/remove/${u._id}`, "DELETE").then(() =>
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
    </section>
  );
}
