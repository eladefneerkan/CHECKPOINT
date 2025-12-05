// Frontend/Profile/ProfilePictureUpload.jsx

export default function ProfilePictureUpload({ onFileSelect, previewUrl }) {
    return (
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block", marginBottom: 6 }}>Choose new profile picture</label>
        <input type="file" accept="image/*" onChange={(e) => onFileSelect(e.target.files[0])} />
  
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            style={{ width: 120, borderRadius: 8, marginTop: 10 }}
          />
        )}
      </div>
    );
  }
  