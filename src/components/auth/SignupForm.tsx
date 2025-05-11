
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SignupForm = () => {
  const { signup, error, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('tenant');
  const [adminCode, setAdminCode] = useState('');
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: '',
  });

  const ADMIN_SECRET_CODE = "REALTY2025"; // This would ideally be stored securely

  const toggleAdminOptions = () => {
    setShowAdminOptions(!showAdminOptions);
  };

  const validate = () => {
    let valid = true;
    const newErrors = { name: '', email: '', password: '', adminCode: '' };
    
    if (!name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    // Validate admin code if super_admin role is selected
    if (role === 'super_admin' && adminCode !== ADMIN_SECRET_CODE) {
      newErrors.adminCode = 'Invalid admin code';
      valid = false;
    }
    
    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await signup(email, password, name, role as 'super_admin' | 'landlord' | 'tenant');
      toast({
        title: "Account created",
        description: "Welcome to RealtyInsight",
      });
      navigate('/');
    } catch (err) {
      // Error is handled by the useAuth hook
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className={formErrors.name ? "border-destructive" : ""}
            />
            {formErrors.name && (
              <p className="text-destructive text-sm">{formErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className={formErrors.email ? "border-destructive" : ""}
            />
            {formErrors.email && (
              <p className="text-destructive text-sm">{formErrors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className={formErrors.password ? "border-destructive" : ""}
            />
            {formErrors.password && (
              <p className="text-destructive text-sm">{formErrors.password}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Account Type</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenant">Tenant</SelectItem>
                <SelectItem value="landlord">Landlord</SelectItem>
                {showAdminOptions && <SelectItem value="super_admin">Admin</SelectItem>}
              </SelectContent>
            </Select>
          </div>

          {/* Admin code section - only shown if admin options are toggled */}
          {role === 'super_admin' && (
            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Code</Label>
              <Input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                disabled={isLoading}
                className={formErrors.adminCode ? "border-destructive" : ""}
              />
              {formErrors.adminCode && (
                <p className="text-destructive text-sm">{formErrors.adminCode}</p>
              )}
            </div>
          )}
          
          {/* Hidden button to toggle admin options */}
          <div className="text-right">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={toggleAdminOptions} 
              className="text-xs text-muted-foreground"
            >
              {showAdminOptions ? "Hide Advanced Options" : "Show Advanced Options"}
            </Button>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
