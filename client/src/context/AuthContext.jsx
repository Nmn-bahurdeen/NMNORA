import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nmnora_token'));
  const [loading, setLoading] = useState(true);

  // Configure axios default authorization header whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('nmnora_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      verifySession();
    } else {
      localStorage.removeItem('nmnora_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const verifySession = async () => {
    try {
      const response = await axios.get('/api/auth/verify');
      setUser(response.data.user);
    } catch (err) {
      console.warn('Session verification failed, logging out');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('nmnora_token', receivedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    return receivedUser;
  };

  const register = async (userData) => {
    const response = await axios.post('/api/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('nmnora_token', receivedToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
    return receivedUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nmnora_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfile = async (profileData) => {
    const response = await axios.put('/api/auth/profile', profileData);
    setUser(response.data.user);
    return response.data.user;
  };

  const isAdmin = user?.role === 'ADMIN';
  const isCustomer = user?.role === 'CUSTOMER';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isCustomer,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
