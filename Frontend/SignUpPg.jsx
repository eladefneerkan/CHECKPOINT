import { useState } from 'react';
import { useAuth } from './Auth';

const SignupForm = ({ onSwitchToLogin, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();

  const handleSubmit = async () => {
    setError('');

    if (!username || !password || !confirmPassword) {
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

    const result = await signup(username, password);
    if (!result.success) {
      setError(result.error || 'Signup failed. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Sign Up</h2>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="signup-username" style={{ display: 'block', marginBottom: '5px' }}>
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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="signup-password" style={{ display: 'block', marginBottom: '5px' }}>
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

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="signup-confirm" style={{ display: 'block', marginBottom: '5px' }}>
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
          <div style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px' }}>
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;