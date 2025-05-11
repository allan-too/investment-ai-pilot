
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const { user, isAdmin, isLandlord } = useAuth();
  const [timeFrame, setTimeFrame] = useState('month');
  
  // Mock data - in production this would come from Supabase
  const propertyDistribution = [
    { name: 'Residential', value: 65 },
    { name: 'Commercial', value: 25 },
    { name: 'Mixed Use', value: 10 },
  ];
  
  const riskScoreDistribution = [
    { name: 'Low Risk', value: 40 },
    { name: 'Medium Risk', value: 35 },
    { name: 'High Risk', value: 25 },
  ];

  const financialData = [
    { name: 'Jan', income: 4000, expenses: 2400 },
    { name: 'Feb', income: 3000, expenses: 1398 },
    { name: 'Mar', income: 2000, expenses: 9800 },
    { name: 'Apr', income: 2780, expenses: 3908 },
    { name: 'May', income: 1890, expenses: 4800 },
    { name: 'Jun', income: 2390, expenses: 3800 },
    { name: 'Jul', income: 3490, expenses: 4300 },
    { name: 'Aug', income: 4000, expenses: 2400 },
    { name: 'Sep', income: 3000, expenses: 1398 },
    { name: 'Oct', income: 2000, expenses: 9800 },
    { name: 'Nov', income: 2780, expenses: 3908 },
    { name: 'Dec', income: 1890, expenses: 4800 },
  ];

  const tenantData = [
    { name: 'Jan', newTenants: 4, leavingTenants: 2 },
    { name: 'Feb', newTenants: 2, leavingTenants: 1 },
    { name: 'Mar', newTenants: 3, leavingTenants: 2 },
    { name: 'Apr', newTenants: 5, leavingTenants: 3 },
    { name: 'May', newTenants: 1, leavingTenants: 0 },
    { name: 'Jun', newTenants: 2, leavingTenants: 1 },
  ];

  // Admin-specific data
  const landlordGrowth = [
    { name: 'Jan', newLandlords: 3, activeLandlords: 20 },
    { name: 'Feb', newLandlords: 5, activeLandlords: 25 },
    { name: 'Mar', newLandlords: 2, activeLandlords: 27 },
    { name: 'Apr', newLandlords: 7, activeLandlords: 33 },
    { name: 'May', newLandlords: 4, activeLandlords: 37 },
    { name: 'Jun', newLandlords: 6, activeLandlords: 43 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 5000 },
    { name: 'Feb', revenue: 7300 },
    { name: 'Mar', revenue: 8400 },
    { name: 'Apr', revenue: 9200 },
    { name: 'May', revenue: 10500 },
    { name: 'Jun', revenue: 11400 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex space-x-2">
          <Tabs defaultValue={timeFrame} onValueChange={setTimeFrame}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="quarter">Quarter</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Landlord Growth</CardTitle>
              <CardDescription>New landlords signing up over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={landlordGrowth}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newLandlords" stroke="#8884d8" />
                  <Line type="monotone" dataKey="activeLandlords" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscription Revenue</CardTitle>
              <CardDescription>Monthly revenue from subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
      
      {(isLandlord || isAdmin) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses</CardTitle>
              <CardDescription>Financial performance over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#82ca9d" />
                  <Bar dataKey="expenses" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tenant Movement</CardTitle>
              <CardDescription>New vs. leaving tenants</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={tenantData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="newTenants" stroke="#8884d8" />
                  <Line type="monotone" dataKey="leavingTenants" stroke="#ff8042" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Distribution</CardTitle>
            <CardDescription>Types of properties in portfolio</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {propertyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
            <CardDescription>Risk assessment breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskScoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskScoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
