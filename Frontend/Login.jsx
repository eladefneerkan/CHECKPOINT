import { useState } from "react";

export default function Login() {
  // Signup state
  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    email: "",
    bio: "",
    profilePicture: ""
  });
  
  const [signupMessage, setSignupMessage] = useState("");

  // Login state
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [loginMessage, setLoginMessage] = useState("");

  // Handle input updates for signup
  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      setSignupMessage(data.message || data.error);
    } catch (err) {
      setSignupMessage("Error connecting to server");
    }
  };

  // Handle login input updates
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      setLoginMessage(data.message || data.error);
    } catch (err) {
      setLoginMessage("Error connecting to server");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      {/* SIGNUP */}
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={signupData.username}
          onChange={handleSignupChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupData.password}
          onChange={handleSignupChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupData.email}
          onChange={handleSignupChange}
        />
        <textarea
          name="bio"
          placeholder="Short bio"
          value={signupData.bio}
          onChange={handleSignupChange}
        />
        <input
          type="text"
          name="profilePicture"
          placeholder="Profile picture URL"
          value={signupData.profilePicture}
          onChange={handleSignupChange}
        />

        <button type="submit">Sign Up</button>
      </form>
      {signupMessage && <p>{signupMessage}</p>}

      {/* LOGIN */}
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={loginData.username}
          onChange={handleLoginChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={loginData.password}
          onChange={handleLoginChange}
        />
        <button type="submit">Login</button>
      </form>
      {loginMessage && <p>{loginMessage}</p>}
    </div>
  );
}
