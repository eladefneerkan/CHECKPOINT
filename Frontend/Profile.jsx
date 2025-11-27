// Frontend/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";
import LogoutButton from "./LogoutButton";
import GameListManager from "./GameListManager";
import Friends from "./Friends";


export default function Profile() {
  const { user: authUser, updateProfile, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [deletePassword, setDeletePassword] = useState("");


  // Sync local state with auth context when authUser changes
  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email);
      setBio(authUser.bio);
      setProfilePicture(authUser.profilePicture);
    }
  }, [authUser]);

  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setActiveTab("profile");
    window.addEventListener("resetProfileToProfileTab", handler);
    const listsHandler = () => setActiveTab("lists");
    window.addEventListener("openProfileListsTab", listsHandler);
    return () => {
      window.removeEventListener("resetProfileToProfileTab", handler);
      window.removeEventListener("openProfileListsTab", listsHandler);
    };
  }, []);

  if (!authUser || isLoading)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <h2>Please log in to view your profile.</h2>
        <div style={{ marginTop: 12 }}>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#2563eb",
              color: "white",
              fontWeight: 600,
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result); // This is a base64 data URL
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      alert("Please select a valid image file.");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ email, bio, profilePicture: previewUrl ? previewUrl : profilePicture }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Save failed:", res.status, text);
        alert("Failed to save profile: " + (text || res.status));
        return;
      }

      const updated = await res.json();
      updateProfile(updated);
      setEditMode(false);
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving profile: " + err.message);
    }
  };

  const deleteAccount = async () => {
    if (!deletePassword) {
      alert("Please enter your password to delete your account.");
      return;
    }
  
    const res = await fetch("http://localhost:3000/users/me", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ password: deletePassword }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }
  
    localStorage.removeItem("token");
    alert("Account deleted.");
    navigate("/");
  };
  

  const colors = { accent: "#2563eb", muted: "#9ca3af", success: "#10b981", teal: "#008080" };
  const btnBase = { padding: "10px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 };

  return (
    <div style={{ color: "white", maxWidth: 720, margin: "32px auto", padding: 16 }}>
      {/* Nav */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 18,
          padding: 8,
          background: "#008080",
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
        }}
      >
        <button
          onClick={() => setActiveTab("lists")}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: activeTab === "lists" ? "rgba(255,255,255,0.08)" : "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          My Game Lists
        </button>

        <button
          onClick={() => (window.location.href = "/review")}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: activeTab === "reviews" ? "rgba(255,255,255,0.08)" : "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reviews
        </button>

        <button
          onClick={() => alert("Stats coming soon")}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: activeTab === "stats" ? "rgba(255,255,255,0.08)" : "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          style={{  
            padding: "8px 14px",
            borderRadius: 8,
            background: activeTab === "friends" ? "rgba(255,255,255,0.08)" : "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Friends
        </button>
      </div>

      {activeTab !== "lists" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <h1 style={{ margin: 0 }}>Welcome, {authUser.username}!</h1>

          <img
            src={previewUrl ? previewUrl : authUser.profilePicture}
            alt="Profile"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://via.placeholder.com/140/008080/ffffff?text=User`;
            }}
            style={{ width: 140, height: 140, borderRadius: 12, objectFit: "cover", border: `2px solid ${colors.teal}` }}
          />

          <h2 style={{ margin: 0 }}>{authUser.username}</h2>
          <p style={{ margin: "8px 0", color: colors.muted }}>{authUser.bio || "No bio yet"}</p>
          <p style={{ margin: 0, color: colors.muted }}>{authUser.email}</p>

          {!editMode && (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setEditMode(true)} style={{ ...btnBase, background: colors.teal, color: "white" }}>Edit Profile</button>
              <LogoutButton />
            </div>
          )}

        


          {editMode && (
            <>
              <div style={{ width: "100%", marginTop: 12 }}>
                <h3 style={{ marginTop: 0 }}>Edit Profile</h3>

                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Choose new profile picture</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
                </div>

                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", marginBottom: 6 }}>Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)} style={{ width: "100%", minHeight: 100 }} />
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleSaveChanges} style={{ ...btnBase, background: colors.success, color: "white" }}>Save</button>
                  <button
                    onClick={() => { setEditMode(false); setPreviewUrl(null); setImageFile(null); }}
                    style={{ ...btnBase, background: "transparent", border: `1px solid rgba(255,255,255,0.06)`, color: colors.muted }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 24, padding: 16, background: "#220000", borderRadius: 8 }}>
                <h3 style={{ color: "#ff6b6b", marginTop: 0 }}>Delete Account</h3>

                <p style={{ color: "#ddd" }}>Enter your password to permanently delete your account.</p>

                <input
                  type="password"
                  placeholder="Password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  style={{
                    width: "100%",
                    marginBottom: 8,
                    padding: 8,
                    borderRadius: 6,
                    border: "1px solid #555",
                  }}
                />

                <button
                  onClick={deleteAccount}
                  disabled={!deletePassword}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: deletePassword ? "#cc0000" : "#7a3b3b",
                    color: "white",
                    fontWeight: 600,
                    cursor: deletePassword ? "pointer" : "not-allowed",
                    width: "100%",
                    opacity: deletePassword ? 1 : 0.6,
                  }}
                >
                  Delete My Account
                </button>
              </div>
            </>
          )}

        </div>
      )}

      {activeTab === "lists" && (
        <div>
          <h1 style={{ marginTop: 0 }}>My Game Lists</h1>
          <div style={{ marginBottom: "12px" }}>
            <button onClick={() => setActiveTab("profile")} style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginBottom: "8px" }}>← Back to Profile</button>
          </div>
          <GameListManager />
        </div>
      )}

      {activeTab === "friends" && (
        <Friends token={localStorage.getItem("token")} />
      )}

    </div>
  );
}
