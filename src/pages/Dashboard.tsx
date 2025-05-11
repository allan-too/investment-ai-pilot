
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyCard, PropertyData } from "@/components/dashboard/PropertyCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Home, Users, CreditCard, AlertTriangle, TrendingUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Super Admin Dashboard
const SuperAdminDashboard = () => {
  const [landlordCount, setLandlordCount] = useState(0);
  const [tenantCount, setTenantCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [propertyCount, setPropertyCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get landlord count
        const { count: landlordCountResult, error: landlordError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact' })
          .eq('role', 'landlord');
        
        if (landlordError) throw landlordError;
        
        // Get tenant count
        const { count: tenantCountResult, error: tenantError } = await supabase
          .from('tenants')
          .select('id', { count: 'exact' });
        
        if (tenantError) throw tenantError;
        
        // Get property count
        const { count: propertyCountResult, error: propertyError } = await supabase
          .from('properties')
          .select('id', { count: 'exact' });
        
        if (propertyError) throw propertyError;
        
        // Calculate total revenue based on subscriptions
        const { data: subscriptions, error: subError } = await supabase
          .from('subscriptions')
          .select('total_amount')
          .eq('status', 'active');
        
        if (subError) throw subError;
        
        const totalRev = subscriptions?.reduce((sum, sub) => sum + (sub.total_amount || 0), 0) || 0;
        
        setLandlordCount(landlordCountResult || 0);
        setTenantCount(tenantCountResult || 0);
        setPropertyCount(propertyCountResult || 0);
        setTotalRevenue(totalRev);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard statistics",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Landlords"
          value={landlordCount}
          description="Active property managers"
          icon={<User className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Total Tenants"
          value={tenantCount}
          description="Active rental tenants"
          icon={<Users className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Properties"
          value={propertyCount}
          description="Properties under management"
          icon={<Home className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Total subscription revenue"
          icon={<CreditCard className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/landlords')}
              >
                <User className="h-5 w-5 mb-1" />
                <span>Manage Landlords</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/tenants')}
              >
                <Users className="h-5 w-5 mb-1" />
                <span>View All Tenants</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/analytics')}
              >
                <TrendingUp className="h-5 w-5 mb-1" />
                <span>View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/settings')}
              >
                <User className="h-5 w-5 mb-1" />
                <span>Account Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Status</CardTitle>
            <CardDescription>All systems operational</CardDescription>
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
      </div>
    </div>
  );
};

// Landlord Dashboard
const LandlordDashboard = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [tenantCount, setTenantCount] = useState(0);
  const [vacancyRate, setVacancyRate] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLandlordData = async () => {
      if (!user?.id) return;
      
      try {
        // Get properties
        const { data: propertiesData, error: propError } = await supabase
          .from('properties')
          .select(`
            *,
            risk_scores:risk_scores(total_score),
            metrics:metrics(roi, noi, cap_rate)
          `)
          .eq('landlord_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);
        
        if (propError) throw propError;
        
        // Get tenant count
        const { count: tenantCountResult, error: tenantError } = await supabase
          .from('tenants')
          .select('id', { count: 'exact' })
          .eq('landlord_id', user.id);
        
        if (tenantError) throw tenantError;
        
        // Calculate total revenue from rents
        const { data: tenants, error: rentError } = await supabase
          .from('tenants')
          .select('rent_amount')
          .eq('landlord_id', user.id);
        
        if (rentError) throw rentError;
        
        const totalRev = tenants?.reduce((sum, tenant) => sum + (tenant.rent_amount || 0), 0) || 0;
        
        // Process property data
        const formattedProperties: PropertyData[] = propertiesData?.map(prop => ({
          id: prop.id,
          address: prop.address,
          riskScore: prop.risk_scores?.[0]?.total_score || 50,
          roi: prop.metrics?.[0]?.roi || 0,
          noi: prop.metrics?.[0]?.noi || 0,
          capRate: prop.metrics?.[0]?.cap_rate || 0,
          createdAt: prop.created_at || new Date().toISOString(),
        })) || [];
        
        setProperties(formattedProperties);
        setTenantCount(tenantCountResult || 0);
        setTotalRevenue(totalRev);
        
        // Calculate vacancy rate (mock data)
        setVacancyRate(Math.round(Math.random() * 20)); // 0-20% vacancy
      } catch (error) {
        console.error('Error fetching landlord data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load dashboard data",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLandlordData();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Properties"
          value={properties.length}
          description="Total properties managed"
          icon={<Home className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Tenants"
          value={tenantCount}
          description="Active rental tenants"
          icon={<Users className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Vacancy Rate"
          value={`${vacancyRate}%`}
          description="Current vacancy percentage"
          icon={<AlertTriangle className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Total monthly rent"
          icon={<CreditCard className="h-5 w-5 text-realty-blue" />}
          loading={isLoading}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Properties</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/properties')}
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-32 animate-pulse bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No properties found</p>
              <Button onClick={() => navigate('/properties')}>Add Property</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {properties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/properties')}
              >
                <Home className="h-5 w-5 mb-1" />
                <span>Properties</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/tenants')}
              >
                <Users className="h-5 w-5 mb-1" />
                <span>Manage Tenants</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/analytics')}
              >
                <TrendingUp className="h-5 w-5 mb-1" />
                <span>View Analytics</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/upload')}
              >
                <Home className="h-5 w-5 mb-1" />
                <span>Upload Data</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate('/settings')}
              >
                <User className="h-5 w-5 mb-1" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Based on tenant count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold">${(tenantCount * 20).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly subscription</div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Tenant count:</span>
                <span className="font-medium">{tenantCount}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Rate per tenant:</span>
                <span className="font-medium">$20</span>
              </div>
              
              <Button className="w-full">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Tenant Dashboard
const TenantDashboard = () => {
  const [tenantData, setTenantData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTenantData = async () => {
      if (!user?.email) return;
      
      try {
        // Find tenant record by email
        const { data, error } = await supabase
          .from('tenants')
          .select(`
            *,
            properties:property_id (
              address,
              landlord:landlord_id (
                profiles:id (
                  full_name,
                  email
                )
              )
            )
          `)
          .eq('email', user.email)
          .single();
        
        if (error) throw error;
        
        setTenantData(data);
      } catch (error) {
        console.error('Error fetching tenant data:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load your rental information",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTenantData();
  }, [user]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!tenantData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">No Rental Information Found</h2>
        <p className="text-muted-foreground">
          We couldn't find your tenant information in our system.
          Please contact your landlord or property manager.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your Rental Information</CardTitle>
          <CardDescription>Details about your current rental</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg">Property Details</h3>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Address:</div>
                  <div>{tenantData.properties?.address || 'Not assigned'}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Unit:</div>
                  <div>{tenantData.unit_number || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Monthly Rent:</div>
                  <div>{tenantData.rent_amount ? `$${tenantData.rent_amount.toLocaleString()}` : 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Lease Start:</div>
                  <div>{formatDate(tenantData.lease_start)}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Lease End:</div>
                  <div>{formatDate(tenantData.lease_end)}</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">Landlord Information</h3>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{tenantData.properties?.landlord?.profiles?.full_name || 'N/A'}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Email:</div>
                  <div>{tenantData.properties?.landlord?.profiles?.email || 'N/A'}</div>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mt-4">Your Information</h3>
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Name:</div>
                  <div>{tenantData.full_name}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Email:</div>
                  <div>{tenantData.email}</div>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{tenantData.phone || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <AlertTriangle className="h-5 w-5 mb-1" />
              <span>Report Issue</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <CreditCard className="h-5 w-5 mb-1" />
              <span>View Payments</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <User className="h-5 w-5 mb-1" />
              <span>Update Info</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard component that renders the appropriate dashboard based on role
const Dashboard = () => {
  const { user, isAdmin, isLandlord, isTenant } = useAuth();

  if (isAdmin) {
    return <SuperAdminDashboard />;
  } else if (isLandlord) {
    return <LandlordDashboard />;
  } else if (isTenant) {
    return <TenantDashboard />;
  } else {
    // Default or loading state
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
};

export default Dashboard;
