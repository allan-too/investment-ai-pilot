
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

type Landlord = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  role: string;
  tenant_count: number;
};

const Landlords = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLandlordEmail, setNewLandlordEmail] = useState('');
  const [newLandlordName, setNewLandlordName] = useState('');
  const [newLandlordPassword, setNewLandlordPassword] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      window.location.href = '/';
    }
  }, [user, isAdmin]);

  const fetchLandlords = async () => {
    setIsLoading(true);
    try {
      // Join profiles with a count of tenants
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          tenant_count:tenants(count)
        `)
        .eq('role', 'landlord')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setLandlords(data.map(d => ({
        ...d,
        tenant_count: d.tenant_count[0]?.count || 0
      })));
    } catch (error: any) {
      console.error('Error fetching landlords:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load landlords",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchLandlords();
    }
  }, [isAdmin]);

  const handleAddLandlord = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLandlordEmail || !newLandlordName || !newLandlordPassword) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Create new user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: newLandlordEmail,
        password: newLandlordPassword,
        options: {
          data: {
            full_name: newLandlordName,
            role: 'landlord',
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Landlord account created successfully",
      });
      
      setIsAddDialogOpen(false);
      setNewLandlordEmail('');
      setNewLandlordName('');
      setNewLandlordPassword('');
      
      // Refresh landlords list
      fetchLandlords();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create landlord",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landlord Management</h1>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Landlord</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Landlord</DialogTitle>
              <DialogDescription>
                Create a new landlord account. They'll receive an email invitation.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLandlord}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newLandlordName}
                    onChange={(e) => setNewLandlordName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newLandlordEmail}
                    onChange={(e) => setNewLandlordEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newLandlordPassword}
                    onChange={(e) => setNewLandlordPassword(e.target.value)}
                    placeholder="Set initial password"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Landlord"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Landlords</CardTitle>
          <CardDescription>
            Manage landlord accounts and subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tenants</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : landlords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No landlords found
                  </TableCell>
                </TableRow>
              ) : (
                landlords.map((landlord) => (
                  <TableRow key={landlord.id}>
                    <TableCell className="font-medium">{landlord.full_name || 'Unnamed'}</TableCell>
                    <TableCell>{landlord.email}</TableCell>
                    <TableCell>{landlord.tenant_count}</TableCell>
                    <TableCell>{format(new Date(landlord.created_at), 'PPP')}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to landlord details or subscription management
                          // This would be implemented in a real application
                          toast({
                            title: "Not implemented",
                            description: "Landlord details view would go here",
                          });
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Landlords;
