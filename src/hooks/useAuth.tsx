
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  role: 'super_admin' | 'landlord' | 'tenant';
};

type AuthContextType = {
  user: UserProfile | null;
  session: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role?: 'super_admin' | 'landlord' | 'tenant') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  isAdmin: boolean;
  isLandlord: boolean;
  isTenant: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  };

  // Refresh the user's profile data
  const refreshProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      const profileData = await fetchUserProfile(session.user.id);
      if (profileData) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          full_name: profileData.full_name,
          role: profileData.role,
        });
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        if (currentSession?.user) {
          setIsLoading(true);
          
          // Using setTimeout to prevent auth state deadlocks
          setTimeout(async () => {
            const profileData = await fetchUserProfile(currentSession.user.id);
            
            if (profileData) {
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email,
                full_name: profileData.full_name,
                role: profileData.role,
              });
            } else {
              // If profile doesn't exist yet, set minimal user info
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email,
                full_name: null,
                role: 'tenant', // Default role
              });
            }
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserProfile(currentSession.user.id).then((profileData) => {
          if (profileData) {
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email,
              full_name: profileData.full_name,
              role: profileData.role,
            });
          } else {
            // If profile doesn't exist yet, set minimal user info
            setUser({
              id: currentSession.user.id,
              email: currentSession.user.email,
              full_name: null,
              role: 'tenant', // Default role
            });
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Profile data will be fetched by the auth state listener
      toast({
        title: "Login successful",
        description: "Welcome back to RealtyInsight",
      });
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
      toast({
        variant: "destructive",
        title: "Login failed",
        description: err.message || 'Failed to login. Please check your credentials.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'super_admin' | 'landlord' | 'tenant' = 'tenant') => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: role,
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Welcome to RealtyInsight",
      });
      navigate('/');
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: err.message || 'Failed to create account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate('/login');
  };

  const isAdmin = user?.role === 'super_admin';
  const isLandlord = user?.role === 'landlord';
  const isTenant = user?.role === 'tenant';

  const value = {
    user,
    session,
    login,
    signup,
    logout,
    isLoading,
    error,
    isAdmin,
    isLandlord,
    isTenant,
    refreshProfile,
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
