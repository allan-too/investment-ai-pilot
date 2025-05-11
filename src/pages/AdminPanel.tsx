
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Building, Users, AlertTriangle, Database } from "lucide-react";

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statistics, setStatistics] = useState({
    userCount: 0,
    landlordCount: 0,
    tenantCount: 0,
    propertyCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page",
      });
      navigate('/');
    }
  }, [user, isAdmin, navigate, toast]);

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!isAdmin) return;
      
      try {
        setLoading(true);
        
        // Get total user count
        const { count: userCount, error: userError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' });
          
        if (userError) throw userError;
        
        // Get landlord count
        const { count: landlordCount, error: landlordError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'landlord');
          
        if (landlordError) throw landlordError;
        
        // Get tenant count from tenants table 
        const { count: tenantCount, error: tenantError } = await supabase
          .from('tenants')
          .select('id', { count: 'exact' });
          
        if (tenantError) throw tenantError;
        
        // Get property count
        const { count: propertyCount, error: propertyError } = await supabase
          .from('properties')
          .select('id', { count: 'exact' });
          
        if (propertyError) throw propertyError;
        
        setStatistics({
          userCount: userCount || 0,
          landlordCount: landlordCount || 0,
          tenantCount: tenantCount || 0,
          propertyCount: propertyCount || 0
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard statistics",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchStatistics();
  }, [isAdmin, toast]);

  if (!isAdmin) {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="mr-2 h-8 w-8" />
          Admin Panel
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{loading ? '...' : statistics.userCount}</div>
              <p className="text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{loading ? '...' : statistics.landlordCount}</div>
              <p className="text-muted-foreground">Landlords</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{loading ? '...' : statistics.tenantCount}</div>
              <p className="text-muted-foreground">Tenants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="h-8 w-8 mx-auto text-primary mb-2" />
              <div className="text-2xl font-bold">{loading ? '...' : statistics.propertyCount}</div>
              <p className="text-muted-foreground">Properties</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="user-management">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="system-status">System Status</TabsTrigger>
          <TabsTrigger value="database-admin">Database Admin</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user-management" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => navigate('/landlords')}>
                  Manage Landlords
                </Button>
                <Button onClick={() => navigate('/tenants')}>
                  Manage Tenants
                </Button>
                <Button variant="outline">
                  User Permissions
                </Button>
                <Button variant="outline">
                  Audit Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Monitor application and service health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <span className="text-green-500 font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage Service</span>
                  <span className="text-green-500 font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Authentication</span>
                  <span className="text-green-500 font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>API Services</span>
                  <span className="text-green-500 font-medium flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Operational
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database-admin" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Administration</CardTitle>
              <CardDescription>
                Manage database settings and perform maintenance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">
                  View Schemas
                </Button>
                <Button variant="outline">
                  Backup Database
                </Button>
                <Button variant="destructive" className="col-span-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Maintenance Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
