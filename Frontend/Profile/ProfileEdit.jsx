// Frontend/Profile/ProfileEdit.jsx
import ProfilePictureUpload from "./ProfilePictureUpload";

export default function ProfileEdit({
  email,
  setEmail,
  bio,
  setBio,
  previewUrl,
  onFileSelect,
  onSave,
  onCancel,
}) {
  return (
    <div style={{ width: "100%", marginTop: 12 }}>
      <h3>Edit Profile</h3>

      <ProfilePictureUpload previewUrl={previewUrl} onFileSelect={onFileSelect} />

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{ width: "100%", minHeight: 100 }}
        />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSave} style={{ padding: "10px 14px", borderRadius: 8, background: "#10b981", color: "white" }}>Save</button>
        <button onClick={onCancel} style={{ padding: "10px 14px", borderRadius: 8, background: "transparent", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.06)" }}>Cancel</button>
      </div>
    </div>
  );
}
