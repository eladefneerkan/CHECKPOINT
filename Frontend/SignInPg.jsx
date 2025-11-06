import { useState } from 'react';
import { useAuth } from './Auth';

const LoginForm = ({ onSwitchToSignup, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async () => {
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(username, password);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Login</h2>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="login-username" style={{ display: 'block', marginBottom: '5px' }}>
            Username:
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your username"
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            disabled={isLoading}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="login-password" style={{ display: 'block', marginBottom: '5px' }}>
            Password:
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your password"
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
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px' }}>
          Don't have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;