import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Friends({ token }) {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const fetchMe = async () => {
    const res = await fetch("/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const json = await res.json();
    if (res.ok) setData(json);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const action = async (e, url, method = "POST") => {
    e.stopPropagation();

    await fetch(url, {
      method,
      headers: { Authorization: "Bearer " + token },
    });

    fetchMe();
  };

  if (!data) return <p style={{ color: "white" }}>Loading...</p>;

  const cardStyle = {
    display: "flex",
    gap: 12,
    marginBottom: 8,
    padding: "10px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    cursor: "pointer",
    alignItems: "center",
    transition: "0.2s",
  };

  return (
    <div style={{ color: "white", maxWidth: 600 }}>
      {/* Friend List */}
      <div style={{ marginBottom: 24 }}>
        <h3>Your Friends ({data.friends.length})</h3>
        {data.friends.length === 0 && <p>No friends yet.</p>}

        {data.friends.map((f) => (
          <div
            key={f._id}
            style={cardStyle}
            onClick={() => navigate(`/user/${f._id}`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
            }
          >
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />

            <div style={{ flexGrow: 1 }}>
              <p style={{ margin: 0 }}>{f.username}</p>
            </div>

            <button
              onClick={(e) =>
                action(e, `/users/friends/remove/${f._id}`, "DELETE")
              }
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "#444",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Remove Friend
            </button>
          </div>
        ))}
      </div>

      {/* Incoming Requests */}
      <div style={{ marginBottom: 24 }}>
        <h3>Incoming Friend Requests</h3>
        {data.friendRequestsReceived.length === 0 && (
          <p>No incoming requests.</p>
        )}

        {data.friendRequestsReceived.map((f) => (
          <div
            key={f._id}
            style={cardStyle}
            onClick={() => navigate(`/user/${f._id}`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
            }
          >
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />

            <div style={{ flexGrow: 1 }}>
              <p style={{ margin: 0 }}>{f.username}</p>
            </div>

            <button
              onClick={(e) =>
                action(e, `/users/friends/accept/${f._id}`)
              }
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "#10b981",
                color: "white",
                border: "none",
                cursor: "pointer",
                marginRight: 8,
              }}
            >
              Accept
            </button>

            <button
              onClick={(e) =>
                action(e, `/users/friends/reject/${f._id}`)
              }
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "#e52f3e",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Reject
            </button>
          </div>
        ))}
      </div>

      {/* Sent Requests */}
      <div>
        <h3>Sent Friend Requests</h3>
        {data.friendRequestsSent.length === 0 && <p>No pending requests.</p>}

        {data.friendRequestsSent.map((f) => (
          <div
            key={f._id}
            style={cardStyle}
            onClick={() => navigate(`/user/${f._id}`)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
            }
          >
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />

            <div style={{ flexGrow: 1 }}>
              <p style={{ margin: 0 }}>{f.username}</p>
            </div>

            <button
              onClick={(e) =>
                action(e, `/users/friends/cancel/${f._id}`)
              }
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "#007bff",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Cancel Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
