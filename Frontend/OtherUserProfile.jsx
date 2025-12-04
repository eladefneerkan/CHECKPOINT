import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function OtherUserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicLists, setPublicLists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${id}`);
        const data = await res.json();
        setUser(data);
        const resLists = await fetch(`http://localhost:3000/gameLists/public/user/${id}`);
        const listsData = await resLists.json();
        setPublicLists(listsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;
  if (!user) return <h2 style={{ color: "white" }}>User not found.</h2>;

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
      <img
        src={user.profilePicture}
        style={{
          width: 140,
          height: 140,
          borderRadius: "12px",
          objectFit: "cover",
        }}
        alt=""
      />

      <h1>{user.username}</h1>
      <p>{user.bio || "No bio"}</p>

      <h2 style={{ marginTop: "2rem" }}>Public Lists</h2>

      {publicLists.length === 0 ? (
        <p style={{ color: "#aaa" }}>No public lists yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
            padding: "0 20px",
          }}
        >
          {publicLists.map((list) => (
            <div
              key={list._id}
              onClick={() => navigate(`/lists/${list._id}`)}
              style={{
                backgroundColor: "#2a2a2a",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
              }}
            >
              <img
                src={
                  list.coverImage ||
                  (list.games[0]?.background_image ?? 
                    "https://raw.githubusercontent.com/eladefneerkan/CHECKPOINT/main/assets/list_header_default_blue.png")
                }
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
              <div style={{ padding: "15px" }}>
                <h3 style={{ margin: 0 }}>{list.title}</h3>
                <p style={{ marginTop: "5px", color: "#bbb" }}>
                  {list.games.length} games
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
