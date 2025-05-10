
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PropertyData } from '@/components/dashboard/PropertyCard';
import { PropertyDetails } from '@/components/analysis/PropertyDetails';
import { AnalysisCharts } from '@/components/analysis/AnalysisCharts';
import { AIInsights } from '@/components/analysis/AIInsights';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Printer, Share2 } from 'lucide-react';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data from API
    setTimeout(() => {
      // In a real app, you'd fetch the property details from your API
      const mockProperty = {
        id: parseInt(id || '0'),
        address: id === '1' ? '123 Main Street, New York, NY 10001' : 
                id === '2' ? '456 Park Avenue, Chicago, IL 60601' : 
                '789 Oak Drive, Los Angeles, CA 90001',
        riskScore: id === '1' ? 25 : id === '2' ? 48 : 72,
        roi: id === '1' ? 12.5 : id === '2' ? 8.2 : 5.1,
        noi: id === '1' ? 45000 : id === '2' ? 68000 : 32000,
        capRate: id === '1' ? 5.8 : id === '2' ? 4.9 : 3.2,
        createdAt: id === '1' ? '2023-03-15T12:00:00Z' : 
                  id === '2' ? '2023-04-22T15:30:00Z' : 
                  '2023-05-10T09:15:00Z',
      };
      
      setProperty(mockProperty);
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 animate-pulse bg-gray-200 rounded"></div>
        <div className="h-64 animate-pulse bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 animate-pulse bg-gray-200 rounded-lg"></div>
          <div className="h-80 animate-pulse bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-medium">Property not found</h2>
        <p className="text-muted-foreground mb-4">The property you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/properties')}>View All Properties</Button>
      </div>
    );
  }

  // Mock data for charts
  const riskBreakdownData = [
    { name: 'Tenant Score', value: id === '1' ? 15 : id === '2' ? 25 : 35 },
    { name: 'Neighborhood Rating', value: id === '1' ? 10 : id === '2' ? 20 : 30 },
    { name: 'Financial Stability', value: id === '1' ? 5 : id === '2' ? 15 : 25 },
  ];

  const cashFlowData = [
    { month: 'Jan', income: 12000, expenses: 8000, profit: 4000 },
    { month: 'Feb', income: 11500, expenses: 7800, profit: 3700 },
    { month: 'Mar', income: 12500, expenses: 8200, profit: 4300 },
    { month: 'Apr', income: 11000, expenses: 7700, profit: 3300 },
    { month: 'May', income: 12200, expenses: 8100, profit: 4100 },
    { month: 'Jun', income: 13000, expenses: 8500, profit: 4500 },
  ];

  // Mock AI insights
  const aiInsights = {
    strengths: [
      'Strong rental demand in the neighborhood with 95% occupancy rates.',
      'Recent property improvements have increased market value by 15%.',
      'Diversified tenant base reduces vacancy risk.',
    ],
    risks: [
      'Property tax increases expected next fiscal year may impact NOI.',
      'Aging HVAC system may require replacement within 2-3 years.',
      'Local rental market showing signs of potential slowdown.',
    ],
    recommendations: [
      'Consider refinancing at current rates to improve cash flow.',
      'Implement preventive maintenance plan for HVAC to extend lifespan.',
      'Explore adding amenities to justify rent increases next renewal cycle.',
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      <PropertyDetails property={property} />
      
      <AnalysisCharts 
        riskBreakdown={riskBreakdownData} 
        cashFlowData={cashFlowData} 
      />
      
      <AIInsights insights={aiInsights} />
    </div>
  );
};

export default PropertyDetail;
