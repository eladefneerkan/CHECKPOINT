import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resending, setResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const username = location.state?.username;

  if (!username) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        <h2>Error</h2>
        <p>No username provided. Please sign up again.</p>
      </div>
    );
  }

  const handleVerify = async () => {
    setError("");
    setSuccess("");

    const res = await fetch("http://localhost:3000/users/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid code.");
      return;
    }

    setSuccess("Email verified! Redirecting to login...");
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleResend = async () => {
    setResendMessage("");
    setResending(true);
    
    const res = await fetch("http://localhost:3000/users/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();
    setResending(false);

    if (!res.ok) {
      setResendMessage(data.error || "Could not resend code.");
      return;
    }

    setResendMessage("A new verification code has been sent to your email.");
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", color: "white", padding: 20 }}>
      <h2>Verify Your Email</h2>
      <p>A 6-digit code was sent to your email.</p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter verification code"
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 12,
          borderRadius: 6,
          border: "1px solid #555",
        }}
      />

      <button
        onClick={handleVerify}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          background: "#2563eb",
          color: "white",
          border: "none",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        Verify Email
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
      {success && <p style={{ color: "lightgreen", marginTop: 12 }}>{success}</p>}

      <hr style={{ margin: "20px 0", borderColor: "#444" }} />

      <button
        onClick={handleResend}
        disabled={resending}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          background: resending ? "#555" : "#444",
          color: "white",
          border: "1px solid #666",
          fontWeight: 600,
          cursor: resending ? "not-allowed" : "pointer",
        }}
      >
        {resending ? "Resending..." : "Resend Code"}
      </button>

      {resendMessage && (
        <p style={{ color: "lightgreen", marginTop: 12 }}>{resendMessage}</p>
      )}
    </div>
  );
}
