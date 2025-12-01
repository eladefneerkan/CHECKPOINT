import FrogBanner from "../assets/ad_banner_pink.png";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');

    // Required fields
    if (!username || !password || !confirmPassword || !email) {
      setError('Please fill in all fields');
      return;
    }

    // Username length
    if (username.length < 6 || username.length > 32) {
      setError('Usernames must be between 6 and 32 characters.');
      return;
    }

    // Username characters
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      setError('Usernames must only contain letters, numbers, and underscores');
      return;
    }

    // Password length
    if (password.length < 8) {
      setError('Passwords must be at least 8 characters.');
      return;
    }

    // Password composition: uppercase, number, special
    const upperRe = /[A-Z]/;
    const numberRe = /[0-9]/;
    const specialRe = /[!@#$%&*?+~]/;
    if (!upperRe.test(password) || !numberRe.test(password) || !specialRe.test(password)) {
      setError('Passwords must contain at least one uppercase character (A-Z), at least one number (0-9), and at least one special character (!, @, #, $, %, &, *, ?, +, ~).');
      return;
    }

    // Confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const result = await signup({ username, password, email });
    if (!result.success) {
      setError(result.error || 'Signup failed. Please try again.');
      return;
    }

    //success: check if email verification is required
    if (result.requiresEmailVerification) {
      navigate("/verify-email", { state: { username } });
      return;
    }

    //fallback 
    navigate("/login");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ marginBottom: 12 }}>Sign Up</h2>
        <div>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="signup-username" style={{ display: 'block', marginBottom: '6px', color: 'white' }}>
              Username:
            </label>
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Choose a username"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="signup-email" style={{ display: 'block', marginBottom: '6px', color: 'white' }}>
              Email:
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="you@example.com"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="signup-password" style={{ display: 'block', marginBottom: '6px', color: 'white' }}>
              Password:
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="signup-confirm" style={{ display: 'block', marginBottom: '6px', color: 'white' }}>
              Confirm Password:
            </label>
            <input
              id="signup-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Confirm your password"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '12px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </div>

        <div 
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
              alt="Frog Banner"
              style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "10px",
                boxShadow: "0 0 20px rgba(0,0,0,0.5)",
              }}
            />
          </button>
        </div>

        {/* Login button placed below the fields */}
        <div style={{ marginTop: 12 }}>
          <button className="btn-secondary" onClick={() => navigate('/login')}>
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default SignupForm;