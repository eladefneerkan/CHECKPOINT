//main control document for all the profile files
import React, { useEffect, useState } from "react";
import FrogBanner from "../../assets/ad_banner-blue.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth";
import LogoutButton from "../LogoutButton";
import GameListManager from "../GameListManager";
import Friends from "../Friends";
import UserReviews from "../UserReviews";

import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";
import ProfileDelete from "./ProfileDelete";

export default function Profile() {
  const { user: authUser, updateProfile, logout, isLoading } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [deletePassword, setDeletePassword] = useState("");

  const navigate = useNavigate();

  //sync for authorized
  useEffect(() => {
    if (authUser) {
      setEmail(authUser.email);
      setBio(authUser.bio);
      setProfilePicture(authUser.profilePicture);
    }
  }, [authUser]);

  //switch tabs
  useEffect(() => {
    const resetProfileTab = () => setActiveTab("profile");
    const openLists = () => setActiveTab("lists");

    window.addEventListener("resetProfileToProfileTab", resetProfileTab);
    window.addEventListener("openProfileListsTab", openLists);

    return () => {
      window.removeEventListener("resetProfileToProfileTab", resetProfileTab);
      window.removeEventListener("openProfileListsTab", openLists);
    };
  }, []);

  //loading screeeeeeeennnnnnnnnn
  if (isLoading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  //user isn't logged in
  if (!authUser)
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <h2>Please log in to view your profile.</h2>
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
            marginTop: 12,
          }}
        >
          Go to Login
        </button>
      </div>
    );

  //file upload
  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setPreviewUrl(null);
      alert("Please select a valid image file.");
    }
  };

  //save
  const handleSaveChanges = async () => {
    try {
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

      if (!res.ok) {
        const text = await res.text();
        alert("Failed to save profile: " + (text || res.status));
        return;
      }

      const updated = await res.json();
      updateProfile(updated);

      setEditMode(false);
      setImageFile(null);
      setPreviewUrl(null);
    } catch (err) {
      alert("Error saving profile: " + err.message);
    }
  };

  //delete account
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

    logout();
    alert("Account permanently deleted.");
    navigate("/login");
  };

  return (
    <section style={{ backgroundImage: "linear-gradient(to top, #002744, #00070a)" }}>
      <ProfileHeader />

      <div style={{ color: "white", maxWidth: 720, margin: "32px auto", padding: 16 }}>
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "profile" && (
          <>
            {!editMode ? (
              <ProfileView
                authUser={authUser}
                previewUrl={previewUrl}
                setEditMode={setEditMode}
              />
            ) : (
              <>
                <ProfileEdit
                  email={email}
                  setEmail={setEmail}
                  bio={bio}
                  setBio={setBio}
                  previewUrl={previewUrl}
                  onFileSelect={handleFileChange}
                  onSave={handleSaveChanges}
                  onCancel={() => {
                    setEditMode(false);
                    setImageFile(null);
                    setPreviewUrl(null);
                  }}
                />

                <ProfileDelete
                  deletePassword={deletePassword}
                  setDeletePassword={setDeletePassword}
                  deleteAccount={deleteAccount}
                />
              </>
            )}
          </>
        )}


        {activeTab === "lists" && (
          <div>
            <h1 style={{ marginTop: 0 }}>My Game Lists</h1>
            <button
              onClick={() => setActiveTab("profile")}
              style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white" }}
            >
              ← Back to Profile
            </button>
            <GameListManager />
          </div>
        )}

        {activeTab === "friends" && (
          <div>
            <h1>Friends</h1>
            <button
              onClick={() => setActiveTab("profile")}
              style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white" }}
            >
              ← Back to Profile
            </button>
            <Friends token={localStorage.getItem("token")} />
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h1>My Reviews</h1>
            <button
              onClick={() => setActiveTab("profile")}
              style={{ padding: "8px 12px", backgroundColor: "#6c757d", color: "white" }}
            >
              ← Back to Profile
            </button>
            <UserReviews userId={authUser._id} />
          </div>
        )}
      </div>
    </section>
  );
}
