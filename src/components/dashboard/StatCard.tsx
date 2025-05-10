
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
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, className }) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          {icon && <div className="p-2 rounded-md bg-primary/10 text-primary">{icon}</div>}
          <div className={cn("flex flex-col", icon ? "items-end" : "items-start")}>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
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
      </CardContent>
    </Card>
  );
};
