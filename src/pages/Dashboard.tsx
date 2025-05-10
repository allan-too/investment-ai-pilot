
import React, { useState, useEffect } from 'react';
import { BarChart3, Home, TrendingUp, Percent } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { PropertyCard, PropertyData } from '@/components/dashboard/PropertyCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockProperties = [
        {
          id: 1,
          address: '123 Main Street, New York, NY 10001',
          riskScore: 25,
          roi: 12.5,
          noi: 45000,
          capRate: 5.8,
          createdAt: '2023-03-15T12:00:00Z',
        },
        {
          id: 2,
          address: '456 Park Avenue, Chicago, IL 60601',
          riskScore: 48,
          roi: 8.2,
          noi: 68000,
          capRate: 4.9,
          createdAt: '2023-04-22T15:30:00Z',
        },
        {
          id: 3,
          address: '789 Oak Drive, Los Angeles, CA 90001',
          riskScore: 72,
          roi: 5.1,
          noi: 32000,
          capRate: 3.2,
          createdAt: '2023-05-10T09:15:00Z',
        },
      ];
      
      setProperties(mockProperties);
      setLoading(false);
    }, 1000);
  }, []);

  const calculateAverages = () => {
    if (properties.length === 0) return { avgRoi: 0, avgNoi: 0, avgCapRate: 0, avgRisk: 0 };
    
    const sums = properties.reduce((acc, property) => {
      return {
        roi: acc.roi + property.roi,
        noi: acc.noi + property.noi,
        capRate: acc.capRate + property.capRate,
        risk: acc.risk + property.riskScore,
      };
    }, { roi: 0, noi: 0, capRate: 0, risk: 0 });
    
    return {
      avgRoi: sums.roi / properties.length,
      avgNoi: sums.noi / properties.length,
      avgCapRate: sums.capRate / properties.length,
      avgRisk: sums.risk / properties.length,
    };
  };

  const averages = calculateAverages();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/upload')}>
            Upload Data
          </Button>
          <Button onClick={() => navigate('/properties')}>View All Properties</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Properties" 
          value={properties.length} 
          icon={<Home className="h-5 w-5" />}
        />
        <StatCard 
          title="Avg. ROI" 
          value={`${averages.avgRoi.toFixed(2)}%`} 
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 1.2, isPositive: true }}
        />
        <StatCard 
          title="Avg. NOI" 
          value={formatCurrency(averages.avgNoi)} 
          icon={<BarChart3 className="h-5 w-5" />}
          trend={{ value: 0.8, isPositive: true }}
        />
        <StatCard 
          title="Avg. Cap Rate" 
          value={`${averages.avgCapRate.toFixed(2)}%`} 
          icon={<Percent className="h-5 w-5" />}
          trend={{ value: 0.3, isPositive: false }}
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-medium">Recent Properties</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
        
        {properties.length === 0 && !loading && (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground mb-4">Upload data to get started with property analysis.</p>
            <Button onClick={() => navigate('/upload')}>Upload Property Data</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
