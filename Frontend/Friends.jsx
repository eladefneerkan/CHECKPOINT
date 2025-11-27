import React, { useEffect, useState } from "react";

export default function Friends({ token }) {
  const [data, setData] = useState(null);

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

  const action = async (url, method = "POST") => {
    await fetch(url, {
      method,
      headers: { Authorization: "Bearer " + token },
    });
    fetchMe(); //fresh
  };

  if (!data) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div style={{ color: "white", maxWidth: 600 }}>
      <h2>Friends</h2>

      {/* friend lsit */}
      <div style={{ marginBottom: 24 }}>
        <h3>Your Friends ({data.friends.length})</h3>
        {data.friends.length === 0 && <p>No friends yet.</p>}

        {data.friends.map((f) => (
          <div key={f._id} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />
            <div>
              <p style={{ margin: 0 }}>{f.username}</p>
              <button
                onClick={() => action(`/users/friends/remove/${f._id}`, "DELETE")}
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
          </div>
        ))}
      </div>

      {/* incoming request */}
      <div style={{ marginBottom: 24 }}>
        <h3>Incoming Friend Requests</h3>
        {data.friendRequestsReceived.length === 0 && <p>No incoming requests.</p>}

        {data.friendRequestsReceived.map((f) => (
          <div key={f._id} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />
            <div>
              <p style={{ margin: 0 }}>{f.username}</p>
              <button
                onClick={() => action(`/users/friends/accept/${f._id}`)}
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
                onClick={() => action(`/users/friends/reject/${f._id}`)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#b91c1c",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3>Sent Friend Requests</h3>
        {data.friendRequestsSent.length === 0 && <p>No pending requests.</p>}

        {data.friendRequestsSent.map((f) => (
          <div key={f._id} style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <img
              src={f.profilePicture}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }}
            />
            <div>
              <p style={{ margin: 0 }}>{f.username}</p>
              <button
                onClick={() => action(`/users/friends/cancel/${f._id}`)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "#d97706",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
