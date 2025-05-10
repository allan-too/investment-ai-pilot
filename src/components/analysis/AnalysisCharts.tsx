
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

type RiskBreakdown = {
  name: string;
  value: number;
};

type CashFlowData = {
  month: string;
  income: number;
  expenses: number;
  profit: number;
};

type AnalysisChartsProps = {
  riskBreakdown: RiskBreakdown[];
  cashFlowData: CashFlowData[];
};

const RISK_COLORS = ['#4CAF50', '#FFA726', '#F44336'];
const CASH_FLOW_COLORS = ['#1282a2', '#d32f2f', '#388e3c'];

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ riskBreakdown, cashFlowData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Cash Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD',
                    maximumFractionDigits: 0
                  }).format(value)} 
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill={CASH_FLOW_COLORS[0]} />
                <Bar dataKey="expenses" name="Expenses" fill={CASH_FLOW_COLORS[1]} />
                <Bar dataKey="profit" name="Profit" fill={CASH_FLOW_COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Risk Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
