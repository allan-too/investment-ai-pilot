
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export type PropertyData = {
  id: number;
  address: string;
  riskScore: number;
  roi: number;
  noi: number;
  capRate: number;
  createdAt: string;
};

type PropertyCardProps = {
  property: PropertyData;
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  
  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-500';
    if (score < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card 
      className="h-full hover:shadow-md transition-shadow cursor-pointer" 
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading text-lg font-medium line-clamp-1">{property.address}</h3>
            <p className="text-sm text-muted-foreground">
              Added {new Date(property.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={property.riskScore < 30 ? "default" : property.riskScore < 60 ? "secondary" : "destructive"}>
            Risk: {property.riskScore}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Risk Assessment</span>
              <span className="font-medium">{property.riskScore}%</span>
            </div>
            <Progress 
              value={property.riskScore} 
              className={`h-2 ${getRiskColor(property.riskScore)}`} 
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="dashboard-stat">
              <div className="dashboard-stat-label">ROI</div>
              <div className="dashboard-stat-value text-lg">{property.roi.toFixed(1)}%</div>
            </div>
            <div className="dashboard-stat">
              <div className="dashboard-stat-label">NOI</div>
              <div className="dashboard-stat-value text-lg">{formatCurrency(property.noi)}</div>
            </div>
            <div className="dashboard-stat">
              <div className="dashboard-stat-label">Cap Rate</div>
              <div className="dashboard-stat-value text-lg">{property.capRate.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="w-full text-right">
          <span className="text-primary text-sm">View Analysis →</span>
        </div>
      </CardFooter>
    </Card>
  );
};
