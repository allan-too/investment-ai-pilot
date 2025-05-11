
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';

type Property = {
  id: string;
  address: string;
};

type Tenant = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  unit_number: string | null;
  property_id: string | null;
  property_address?: string;
  rent_amount: number | null;
  lease_start: string | null;
  lease_end: string | null;
  created_at: string;
};

const Tenants = () => {
  const { user, isLandlord, isAdmin } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Form states for new tenant
  const [newTenant, setNewTenant] = useState({
    email: '',
    full_name: '',
    phone: '',
    unit_number: '',
    property_id: '',
    rent_amount: '',
    lease_start: '',
    lease_end: '',
  });

  // Redirect if not landlord or admin
  useEffect(() => {
    if (user && !isLandlord && !isAdmin) {
      window.location.href = '/';
    }
  }, [user, isLandlord, isAdmin]);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('id, address')
        .eq('landlord_id', user?.id);
        
      if (error) throw error;
      
      setProperties(data || []);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load properties",
      });
    }
  };

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      // Join tenants with properties to get addresses
      let query = supabase
        .from('tenants')
        .select(`
          *,
          properties:property_id (address)
        `);
      
      // If landlord (not super_admin), only show their tenants
      if (isLandlord) {
        query = query.eq('landlord_id', user?.id);
      }
        
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setTenants(data.map(tenant => ({
        ...tenant,
        property_address: tenant.properties?.address || 'No property assigned'
      })));
    } catch (error: any) {
      console.error('Error fetching tenants:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load tenants",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if ((isLandlord || isAdmin) && user) {
      fetchTenants();
      if (isLandlord) {
        fetchProperties();
      }
    }
  }, [isLandlord, isAdmin, user]);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTenant.email || !newTenant.full_name) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Email and name are required",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Add new tenant to the database
      const { data, error } = await supabase
        .from('tenants')
        .insert({
          email: newTenant.email,
          full_name: newTenant.full_name,
          phone: newTenant.phone || null,
          unit_number: newTenant.unit_number || null,
          property_id: newTenant.property_id || null,
          landlord_id: user?.id,
          rent_amount: newTenant.rent_amount ? parseFloat(newTenant.rent_amount) : null,
          lease_start: newTenant.lease_start || null,
          lease_end: newTenant.lease_end || null,
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Tenant added successfully",
      });
      
      // Reset form and close dialog
      setIsAddDialogOpen(false);
      setNewTenant({
        email: '',
        full_name: '',
        phone: '',
        unit_number: '',
        property_id: '',
        rent_amount: '',
        lease_start: '',
        lease_end: '',
      });
      
      // Refresh tenants list
      fetchTenants();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add tenant",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewTenant({
      ...newTenant,
      [id]: value,
    });
  };

  const handlePropertyChange = (value: string) => {
    setNewTenant({
      ...newTenant,
      property_id: value,
    });
  };

  if (!isLandlord && !isAdmin) {
    return null; // Don't render anything if not authorized
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        
        {isLandlord && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Tenant</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Tenant</DialogTitle>
                <DialogDescription>
                  Add a new tenant to your properties. They will be able to access their rental information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTenant}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={newTenant.full_name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newTenant.email}
                        onChange={handleInputChange}
                        placeholder="tenant@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={newTenant.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="property_id">Property</Label>
                      <Select
                        value={newTenant.property_id}
                        onValueChange={handlePropertyChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit_number">Unit Number</Label>
                      <Input
                        id="unit_number"
                        value={newTenant.unit_number}
                        onChange={handleInputChange}
                        placeholder="Apt 101"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rent_amount">Rent Amount</Label>
                      <Input
                        id="rent_amount"
                        type="number"
                        value={newTenant.rent_amount}
                        onChange={handleInputChange}
                        placeholder="1000"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lease_start">Lease Start Date</Label>
                      <Input
                        id="lease_start"
                        type="date"
                        value={newTenant.lease_start}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lease_end">Lease End Date</Label>
                      <Input
                        id="lease_end"
                        type="date"
                        value={newTenant.lease_end}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Tenant"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tenants</CardTitle>
          <CardDescription>
            {isLandlord ? "Manage your property tenants" : "View all tenant records"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Lease End</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No tenants found
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.full_name}</TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell>
                      {tenant.property_address}
                      {tenant.unit_number && ` - Unit ${tenant.unit_number}`}
                    </TableCell>
                    <TableCell>
                      {tenant.rent_amount ? `$${tenant.rent_amount.toLocaleString()}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {tenant.lease_end ? format(new Date(tenant.lease_end), 'PP') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to tenant details
                          // This would be implemented in a real application
                          toast({
                            title: "Not implemented",
                            description: "Tenant details view would go here",
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

export default Tenants;
