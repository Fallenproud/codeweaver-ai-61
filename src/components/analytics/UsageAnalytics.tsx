import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Clock, Code, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnalyticsData {
  editorTime: number;
  generatedLines: number;
  filesCreated: number;
  aiInteractions: number;
  languageBreakdown: Array<{ language: string; percentage: number; color: string }>;
  dailyActivity: Array<{ day: string; hours: number }>;
}

interface UsageAnalyticsProps {
  className?: string;
}

export const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ className }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    editorTime: 0,
    generatedLines: 0,
    filesCreated: 0,
    aiInteractions: 0,
    languageBreakdown: [],
    dailyActivity: []
  });

  // Simulate real-time analytics data
  useEffect(() => {
    const generateMockData = (): AnalyticsData => ({
      editorTime: Math.floor(Math.random() * 480) + 120, // 2-8 hours in minutes
      generatedLines: Math.floor(Math.random() * 500) + 100,
      filesCreated: Math.floor(Math.random() * 20) + 5,
      aiInteractions: Math.floor(Math.random() * 50) + 10,
      languageBreakdown: [
        { language: 'TypeScript', percentage: 45, color: 'hsl(var(--accent-cyan))' },
        { language: 'JavaScript', percentage: 25, color: 'hsl(var(--accent-green))' },
        { language: 'CSS', percentage: 20, color: 'hsl(var(--primary))' },
        { language: 'HTML', percentage: 10, color: 'hsl(var(--secondary))' }
      ],
      dailyActivity: [
        { day: 'Mon', hours: Math.random() * 8 },
        { day: 'Tue', hours: Math.random() * 8 },
        { day: 'Wed', hours: Math.random() * 8 },
        { day: 'Thu', hours: Math.random() * 8 },
        { day: 'Fri', hours: Math.random() * 8 },
        { day: 'Sat', hours: Math.random() * 4 },
        { day: 'Sun', hours: Math.random() * 4 }
      ]
    });

    setAnalyticsData(generateMockData());

    // Update data every 30 seconds
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        editorTime: prev.editorTime + Math.floor(Math.random() * 5),
        generatedLines: prev.generatedLines + Math.floor(Math.random() * 10),
        aiInteractions: prev.aiInteractions + Math.floor(Math.random() * 2)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-surface/50 border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-accent-cyan" />
              <span>Editor Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatTime(analyticsData.editorTime)}
            </div>
            <div className="text-xs text-muted mt-1">Today</div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Code className="w-4 h-4 text-accent-green" />
              <span>Lines Generated</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(analyticsData.generatedLines)}
            </div>
            <div className="text-xs text-muted mt-1">This week</div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Files Created</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analyticsData.filesCreated}
            </div>
            <div className="text-xs text-muted mt-1">This week</div>
          </CardContent>
        </Card>

        <Card className="bg-surface/50 border-border-subtle">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Zap className="w-4 h-4 text-accent-warning" />
              <span>AI Interactions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analyticsData.aiInteractions}
            </div>
            <div className="text-xs text-muted mt-1">Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Language Breakdown */}
      <Card className="bg-surface/50 border-border-subtle">
        <CardHeader>
          <CardTitle className="text-sm">Language Usage</CardTitle>
          <CardDescription className="text-xs">Distribution of code languages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {analyticsData.languageBreakdown.map((lang) => (
            <div key={lang.language} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="text-foreground">{lang.language}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {lang.percentage}%
                </Badge>
              </div>
              <Progress 
                value={lang.percentage} 
                className="h-2"
                // style={{ '--progress-foreground': lang.color } as React.CSSProperties}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Activity Chart */}
      <Card className="bg-surface/50 border-border-subtle">
        <CardHeader>
          <CardTitle className="text-sm">Daily Activity</CardTitle>
          <CardDescription className="text-xs">Hours spent coding this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-subtle))" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted))' }}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted))' }}
                  axisLine={false}
                />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--accent-cyan))"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};