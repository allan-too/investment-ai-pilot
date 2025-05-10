
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type User = {
  id: number;
  email: string;
  name: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token on load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    setIsLoading(true);
    try {
      // This would be a real API call in production
      // const response = await fetch('/api/me', {
      //   headers: {
      //     Authorization: `Bearer ${authToken}`,
      //   },
      // });
      
      // Mock user data for now
      // In a real application, you'd get this from your API
      setUser({
        id: 1,
        email: 'user@example.com',
        name: 'Demo User',
      });
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setToken(null);
      setError('Session expired. Please log in again.');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // This would be a real API call in production
      // const response = await fetch('/api/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock JWT token
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);
      
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      // Fetch user data
      await fetchUser(mockToken);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // This would be a real API call in production
      // const response = await fetch('/api/signup', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password, name }),
      // });
      // const data = await response.json();
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock JWT token
      const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(7);
      
      setToken(mockToken);
      localStorage.setItem('token', mockToken);
      
      // Set user data
      setUser({
        id: Math.floor(Math.random() * 1000),
        email,
        name,
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
