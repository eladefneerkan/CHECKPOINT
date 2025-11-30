// LogoutButton.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Auth";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    // clear auth state and token
    logout();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} style={{ marginTop: "20px" }}>
      Logout
    </button>
  );
}
