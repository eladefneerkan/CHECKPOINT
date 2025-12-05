//green clickable rectangle
export default function ProfileTabs({ activeTab, setActiveTab }) {
    const tabStyle = (tab) => ({
      padding: "8px 14px",
      borderRadius: 8,
      background: activeTab === tab ? "rgba(255,255,255,0.08)" : "transparent",
      color: "white",
      border: "1px solid rgba(255,255,255,0.12)",
      fontWeight: 700,
      cursor: "pointer",
    });
  
    return (
      <div className="potion-box">
        <button style={tabStyle("lists")} onClick={() => setActiveTab("lists")}>My Game Lists</button>
        <button style={tabStyle("reviews")} onClick={() => setActiveTab("reviews")}>Reviews</button>
        <button style={tabStyle("friends")} onClick={() => setActiveTab("friends")}>Friends</button>
      </div>
    );
  }
  