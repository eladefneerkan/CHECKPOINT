import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OtherUserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/users/${id}`);
        const data = await res.json();
        setUser(data);
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
    </div>
  );
}
