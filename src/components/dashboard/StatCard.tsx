
import React, { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type StatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  description?: string;
  loading?: boolean;
};

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  description,
  loading = false
}) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="pt-6">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-1/2 bg-muted rounded"></div>
            <div className="h-7 w-1/3 bg-muted rounded"></div>
            {description && <div className="h-3 w-2/3 bg-muted rounded"></div>}
          </div>
        ) : (
          <div className="flex justify-between items-start">
            {icon && <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>}
            <div className={cn("flex flex-col", icon ? "items-end" : "items-start")}>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="text-2xl font-bold mt-1">{value}</h3>
              {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
              {trend && (
                <p 
                  className={cn(
                    "text-xs flex items-center mt-1",
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  <span className="mr-1">
                    {trend.isPositive ? '↑' : '↓'}
                  </span>
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
