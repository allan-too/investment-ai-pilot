
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyData } from '../dashboard/PropertyCard';
import { BarChart3, Home, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type PropertyDetailsProps = {
  property: PropertyData;
};

export const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 60) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-realty-blue" />
            <CardTitle>{property.address}</CardTitle>
          </div>
          <Badge variant={property.riskScore < 30 ? "default" : property.riskScore < 60 ? "secondary" : "destructive"}>
            {getRiskLabel(property.riskScore)} ({property.riskScore}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-4 w-4" />
            Analysis date: {formatDate(property.createdAt)}
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Net Operating Income (NOI)</p>
              <p className="text-xl font-semibold">{formatCurrency(property.noi)}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Return on Investment (ROI)</p>
              <p className="text-xl font-semibold">{property.roi.toFixed(2)}%</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Capitalization Rate</p>
              <p className="text-xl font-semibold">{property.capRate.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
