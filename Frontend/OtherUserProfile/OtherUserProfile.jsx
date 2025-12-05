//main controller
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserHeader from "./UserHeader";
import PublicListGrid from "./PublicListGrid";
import { getUserById, getPublicListsByUser } from "./api";

export default function OtherUserProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [publicLists, setPublicLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userData = await getUserById(id);
        const listsData = await getPublicListsByUser(id);
        setUser(userData);
        setPublicLists(listsData);
      } catch (err) {
        console.error("Failed loading user profile:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <h2 style={{ color: "white" }}>Loading...</h2>;
  if (!user) return <h2 style={{ color: "white" }}>User not found.</h2>;

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "2rem" }}>
      <UserHeader user={user} />
      <h2 style={{ marginTop: "2rem" }}>Public Lists</h2>

      <PublicListGrid lists={publicLists} />
    </div>
  );
}
