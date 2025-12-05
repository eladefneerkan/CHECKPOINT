//the profile information of the user
export default function UserHeader({ user }) {
    return (
      <>
        <img
          src={user.profilePicture}
          alt="User"
          style={{
            width: 140,
            height: 140,
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
  
        <h1>{user.username}</h1>
        <p style={{ color: "#aaa" }}>{user.bio || "No bio"}</p>
      </>
    );
  }
  