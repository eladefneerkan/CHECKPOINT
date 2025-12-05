// Frontend/Profile/ProfileHeader.jsx
import FrogBanner from "../../assets/ad_banner-blue.png";

export default function ProfileHeader() {
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <button
        onClick={() => window.open("https://agsiddiqui.itch.io/afterworld", "_blank")}
        style={{
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <img
          src={FrogBanner}
          alt="Banner"
          style={{
            width: "95%",
            maxWidth: "850px",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
          }}
        />
      </button>
    </div>
  );
}
