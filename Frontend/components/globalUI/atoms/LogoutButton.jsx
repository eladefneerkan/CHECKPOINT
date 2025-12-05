// LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/Auth.jsx";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // clear auth state and token
    logout();
    navigate("/login");
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ 
        padding: "10px 14px",
        borderRadius: 8,
        border: "none",
        background: "#8E4585",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
}
