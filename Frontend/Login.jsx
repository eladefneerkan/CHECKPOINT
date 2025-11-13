//login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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

      if (data.message === "User signed up successfully!") {
        const res2 = await fetch("http://localhost:3000/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: signupData.username,
            password: signupData.password,
          }),
        });

        const loginData = await res2.json();
        if (loginData.token) {
          localStorage.setItem("token", loginData.token);
          navigate("/profile"); 
        }
      }

    } catch (err) {
      setSignupMessage("Error connecting to server");
    }
  };

  // Handle login input updates
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/profile");
      }

      setLoginMessage(data.message || data.error);

    } catch (err) {
      setLoginMessage("Error connecting to server");
    }
  };

  // UI
  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <input type="text" name="username" placeholder="Username" value={signupData.username} onChange={handleSignupChange}/>
        <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={handleSignupChange}/>
        <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={handleSignupChange}/>
        <textarea name="bio" placeholder="Short bio" value={signupData.bio} onChange={handleSignupChange}/>
        <input type="text" name="profilePicture" placeholder="Profile picture URL" value={signupData.profilePicture} onChange={handleSignupChange}/>
        <button type="submit">Sign Up</button>
      </form>
      {signupMessage && <p>{signupMessage}</p>}

      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input type="text" name="username" placeholder="Username" value={loginData.username} onChange={handleLoginChange}/>
        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange}/>
        <button type="submit">Login</button>
      </form>
      {loginMessage && <p>{loginMessage}</p>}
    </div>
  );
}
