//list grid and no public lists message otherwise
import PublicListCard from "./PublicListCard";

export default function PublicListGrid({ lists }) {
  if (!lists || lists.length === 0) {
    return <p style={{ color: "#aaa" }}>No public lists yet.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
        marginTop: "20px",
        padding: "0 20px",
      }}
    >
      {lists.map((list) => (
        <PublicListCard key={list._id} list={list} />
      ))}
    </div>
  );
}
