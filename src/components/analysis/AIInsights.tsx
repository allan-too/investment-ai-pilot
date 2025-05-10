
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ArrowUp, Brain } from 'lucide-react';

type AIInsight = {
  strengths: string[];
  risks: string[];
  recommendations: string[];
};

type AIInsightsProps = {
  insights: AIInsight;
};

export const AIInsights: React.FC<AIInsightsProps> = ({ insights }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-accent" />
          <CardTitle>AI-Powered Investment Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-realty-blue flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-green-500" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {insights.strengths.map((strength, index) => (
                <li key={index} className="text-sm">
                  <div className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>{strength}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-realty-blue flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Risks
            </h3>
            <ul className="space-y-2">
              {insights.risks.map((risk, index) => (
                <li key={index} className="text-sm">
                  <div className="flex gap-2">
                    <span className="text-amber-600">•</span>
                    <span>{risk}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-realty-blue flex items-center gap-2">
              <Brain className="h-4 w-4 text-accent" />
              Recommendations
            </h3>
            <ul className="space-y-2">
              {insights.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">
                  <div className="flex gap-2">
                    <span className="text-accent">•</span>
                    <span>{rec}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
