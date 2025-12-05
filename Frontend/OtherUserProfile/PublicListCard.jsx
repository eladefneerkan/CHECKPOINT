//dipslay the other users' lists
export default function PublicListCard({ list }) {
    const img =
      list.coverImage ||
      list.games?.[0]?.background_image ||
      "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png";
  
    return (
      <div
        style={{
          backgroundColor: "#2a2a2a",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <img
          src={img}
          alt="List cover"
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
          }}
        />
  
        <div style={{ padding: 15 }}>
          <h3 style={{ margin: 0 }}>{list.title}</h3>
          <p style={{ marginTop: 5, color: "#bbb" }}>{list.games.length} games</p>
        </div>
      </div>
    );
  }
  