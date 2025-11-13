// Frontend/Profile.jsx
import React, { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";


export default function Profile() {
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch logged-in user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/users/me", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Profile fetch error:", err));
  }, []);

  if (!user) return <h2>Log In To See Profile</h2>; //WRITE WHAT NON-LOGGED IN USER WILL BE HERE (UI COMP)

  // -------- IMAGE UPLOAD LOGIC ----------
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      alert("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      alert("Select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", imageFile);

    try {
      const response = await fetch("http://localhost:3000/users/upload-profile-picture", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      if (response.ok) {
        alert("Upload successful!");
      } else {
        alert("Upload failed.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="tools">
        <button className="toolButtons">lists</button>
        <button className="toolButtons" onClick={() => window.location.href = "/review"}>
          reviews
        </button>
        <button className="toolButtons">stats</button>
      </div>

      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>

      <h2>Profile Picture</h2>
      {/* Show existing DB picture OR preview */}
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Preview"
          style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "#ccc",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No Image
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!imageFile}>
        Upload Picture
      </button>
      <LogoutButton />
    </div>
  );
}
