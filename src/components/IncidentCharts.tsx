import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
}

interface IncidentChartsProps {
  incidents: Incident[];
}

const IncidentCharts: React.FC<IncidentChartsProps> = ({ incidents }) => {
  // Prepare data for severity distribution chart
  const severityData = [
    { name: 'Low', count: incidents.filter(inc => inc.severity === 'Low').length },
    { name: 'Medium', count: incidents.filter(inc => inc.severity === 'Medium').length },
    { name: 'High', count: incidents.filter(inc => inc.severity === 'High').length },
  ];

  // Prepare data for timeline chart (incidents by day)
  const timelineData = (() => {
    // Create a map to count incidents by day
    const dayMap = new Map<string, number>();
    
    // Get the range of days
    const sortedDates = incidents
      .map(inc => new Date(inc.reported_at))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (sortedDates.length === 0) return [];
    
    const days = 7; // Show last 7 days or available range
    const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
    
    // Initialize with zero counts
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const dateKey = dateFormat.format(date);
      dayMap.set(dateKey, 0);
    }
    
    // Count incidents by day
    incidents.forEach(inc => {
      const incidentDate = new Date(inc.reported_at);
      const dateKey = dateFormat.format(incidentDate);
      
      if (dayMap.has(dateKey)) {
        dayMap.set(dateKey, (dayMap.get(dateKey) || 0) + 1);
      }
    });
    
    // Convert map to array for Recharts
    return Array.from(dayMap.entries()).map(([date, count]) => ({
      date,
      count
    }));
  })();

  const chartConfig = {
    low: { color: '#3B82F6' },    // Bright blue
    medium: { color: '#F59E0B' }, // Bright amber
    high: { color: '#EF4444' },   // Bright red
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <Card className="bg-card/30 backdrop-blur-lg border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Severity Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] sm:h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={severityData} 
                  margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: '12px' }}
                    width={40}
                  />
                  <YAxis 
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: '12px' }}
                    interval={0}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="currentColor"
                    className="fill-primary" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-card/30 backdrop-blur-lg border border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base sm:text-lg">Incidents Over Time</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[200px] sm:h-[300px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={timelineData} 
                  margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: '12px' }}
                    interval="preserveStartEnd"
                    minTickGap={20}
                  />
                  <YAxis 
                    tick={{ fontSize: '12px' }}
                    width={40}
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px' }}
                    verticalAlign="top"
                    height={36}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--primary)" 
                    name="Incidents" 
                    strokeWidth={2} 
                    dot={{ 
                      r: 3,
                      fill: "currentColor", 
                      stroke: "currentColor" 
                    }} 
                    activeDot={{ 
                      r: 5, 
                      fill: "currentColor", 
                      stroke: "currentColor" 
                    }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentCharts;
