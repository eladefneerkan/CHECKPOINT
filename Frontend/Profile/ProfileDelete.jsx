//user deletes their profile if they want to
export default function ProfileDelete({
    deletePassword,
    setDeletePassword,
    deleteAccount,
  }) {
    return (
      <div style={{ marginTop: 24, padding: 16, background: "#220000", borderRadius: 8 }}>
        <h3 style={{ color: "#ff6b6b" }}>Delete Account</h3>
  
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
            background: deletePassword ? "#cc0000" : "#7a3b3b",
            color: "white",
            fontWeight: 600,
            cursor: deletePassword ? "pointer" : "not-allowed",
            width: "100%",
            opacity: deletePassword ? 1 : 0.6,
            border: "none",
          }}
        >
          Delete My Account
        </button>
      </div>
    );
  }
  