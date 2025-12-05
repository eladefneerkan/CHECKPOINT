//let's the user logout
import { LogoutButton } from "../components";

export default function ProfileView({ authUser, previewUrl, setEditMode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <h1>Welcome, {authUser.username}!</h1>

      <img
        src={previewUrl || authUser.profilePicture}
        alt="Profile"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/140/008080/ffffff?text=User";
        }}
        style={{
          width: 140,
          height: 140,
          borderRadius: 12,
          objectFit: "cover",
          border: "2px solid #008080",
        }}
      />

      <h2>{authUser.username}</h2>
      <p style={{ color: "#9ca3af" }}>{authUser.bio || "No bio yet"}</p>
      <p style={{ color: "#9ca3af" }}>{authUser.email}</p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => setEditMode(true)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "#008080",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          Edit Profile
        </button>
        <LogoutButton />
      </div>
    </div>
  );
}
