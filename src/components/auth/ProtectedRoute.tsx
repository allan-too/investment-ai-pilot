
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: JSX.Element;
  adminOnly?: boolean;
}

export const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user && adminOnly && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page",
      });
    }
  }, [user, adminOnly, isAdmin, toast]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    // Redirect to the login page, but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if route requires admin access
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
