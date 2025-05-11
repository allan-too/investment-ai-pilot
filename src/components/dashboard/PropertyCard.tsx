
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export type PropertyData = {
  id: string; // Changed from number to string to match UUID from database
  address: string;
  riskScore: number;
  roi: number;
  noi: number;
  capRate: number;
  createdAt: string;
};

export const PropertyCard: React.FC<{ property: PropertyData }> = ({ property }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={() => navigate(`/property/${property.id}`)}
    >
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-medium truncate" title={property.address}>
            {property.address}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">Risk Score</div>
            <div className="flex items-center">
              <div className={cn(
                "h-2 w-2 rounded-full mr-1",
                property.riskScore < 30 ? "bg-green-500" :
                property.riskScore < 70 ? "bg-yellow-500" : "bg-red-500"
              )}></div>
              <span className="text-sm font-medium">{property.riskScore}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-xs border-t pt-2">
          <div>
            <div className="text-muted-foreground">ROI</div>
            <div className="font-medium">{property.roi}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">NOI</div>
            <div className="font-medium">${property.noi.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Cap Rate</div>
            <div className="font-medium">{property.capRate}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
