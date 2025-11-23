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

    if (!username || !password || !confirmPassword || !email) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    const result = await signup({ username, password, email });
    if (!result.success) {
      setError(result.error || 'Signup failed. Please try again.');
      return;
    }

    // success
    navigate('/profile');
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
            <label htmlFor="signup-username" style={{ display: 'block', marginBottom: '6px' }}>
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
            <label htmlFor="signup-email" style={{ display: 'block', marginBottom: '6px' }}>
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
            <label htmlFor="signup-password" style={{ display: 'block', marginBottom: '6px' }}>
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
            <label htmlFor="signup-confirm" style={{ display: 'block', marginBottom: '6px' }}>
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

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px' }}>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;