// Frontend/Profile.jsx
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setEmail(data.email);
        setBio(data.bio);
        setProfilePicture(data.profilePicture);
      })
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  if (!user)
    return (
      <h2 style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        Please log in to view your profile.
      </h2>
    );

  //Handle selecting a new image locally
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); //preveiw
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      alert("Please select a valid image file.");
    }
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3000/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        email,
        bio,
        profilePicture: previewUrl ? previewUrl : profilePicture, 
      }),
    });

    const updated = await res.json();
    setUser(updated);
    setEditMode(false);
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <div style={{ color: "white", maxWidth: "600px", margin: "auto" }}>
      
      {/* TOP BUTTONS */}
      <div className="tools">
        <button className="toolButtons">lists</button>
        <button className="toolButtons" onClick={() => (window.location.href = "/review")}>
          reviews
        </button>
        <button className="toolButtons">stats</button>
      </div>

      <h1>Welcome, {user.username}!</h1>

      {/* ----- VIEW MODE ----- */}
      {!editMode && (
        <>
          <img
            src={user.profilePicture}
            alt="Profile"
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid white",
            }}
          />

          <p>Email: {user.email}</p>
          <p>Bio: {user.bio || "No bio yet"}</p>

          <button onClick={() => setEditMode(true)} style={{ marginTop: "20px" }}>
            Edit Profile
          </button>

          <LogoutButton />
        </>
      )}

      {/* ----- EDIT MODE ----- */}
      {editMode && (
        <div style={{ marginTop: "20px" }}>
          <h2>Edit Profile</h2>

          {/* Profile picture preview */}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid white",
              }}
            />
          ) : (
            <img
              src={profilePicture}
              alt="Profile"
              style={{
                width: 150,
                height: 150,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid white",
              }}
            />
          )}

          <input type="file" accept="image/*" onChange={handleFileChange} />

          <label>Email:</label>
          <input
            style={{ width: "100%", marginBottom: "10px" }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Bio:</label>
          <textarea
            style={{ width: "100%", marginBottom: "10px" }}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <button onClick={handleSaveChanges} style={{ marginRight: "10px" }}>
            Save
          </button>

          <button
            onClick={() => {
              setEditMode(false);
              setPreviewUrl(null);
              setImageFile(null);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
