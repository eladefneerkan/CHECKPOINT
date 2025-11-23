import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // on mount, try to load user from token
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/users/me', { headers: { Authorization: 'Bearer ' + token } });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.error && mounted) setUser(data);
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    init();
    return () => { mounted = false };
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      if (!username || !password) return { success: false, error: 'Please fill in all fields' };

      const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        // backend returns a `user` object
        if (data.user) setUser(data.user);
        else {
          // fallback: try to fetch /users/me
          try {
            const me = await fetch('/users/me', { headers: { Authorization: 'Bearer ' + data.token } });
            const meData = await me.json();
            if (!meData.error) setUser(meData);
          } catch (e) {}
        }

        return { success: true };
      }

      // If login failed, try to distinguish missing username vs bad password
      // fetch all users and check if username exists
      try {
        const usersRes = await fetch('/users');
        if (usersRes.ok) {
          const users = await usersRes.json();
          const found = users.find(u => u.username === username);
          if (found) return { success: false, error: 'Incorrect password.' };
        }
      } catch (e) {
        // ignore
      }

      return { success: false, error: 'No account found. Please sign up to create an account.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ username, password, email, bio, profilePicture } = {}) => {
    setIsLoading(true);
    try {
      if (!username || !password || !email) return { success: false, error: 'Please fill in all fields' };

      // Pre-check username availability
      try {
        const usersRes = await fetch('/users');
        if (usersRes.ok) {
          const users = await usersRes.json();
          const found = users.find(u => u.username === username);
          if (found) return { success: false, error: 'Username already taken.' };
        }
      } catch (e) {
        // ignore precheck errors
      }

      const res = await fetch('/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, bio, profilePicture })
      });

      const data = await res.json();

      if (res.ok && data.message) {
        // auto-login after successful signup
        const loginResult = await login(username, password);
        if (loginResult.success) return { success: true };
        return { success: false, error: 'Signup succeeded but auto-login failed.' };
      }

      return { success: false, error: data.error || 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// initialize: try to load user from token
export const initAuth = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await fetch('/users/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return data;
  } catch (e) {
    return null;
  }
};