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
      const res = await fetch('/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json();
  
      if (data.requiresEmailVerification) {
        return {
          success: false,
          requiresEmailVerification: true,
          username
        };
      }
  
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) setUser(data.user);
        return { success: true };
      }
  
      return { success: false, error: data.error || 'Login failed' };
  
    } finally {
      setIsLoading(false);
    }
  };
  

  const signup = async ({ username, password, email, bio, profilePicture } = {}) => {
    setIsLoading(true);
    try {
      const res = await fetch('/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, bio, profilePicture })
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        return { success: false, error: data.error || 'Signup failed' };
      }
  
      if (data.requiresEmailVerification) {
        return {
          success: true,
          requiresEmailVerification: true,
          username: data.username
        };
      }
  
      return { success: true };
  
    } catch (err) {
      return { success: false, error: err.message };
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