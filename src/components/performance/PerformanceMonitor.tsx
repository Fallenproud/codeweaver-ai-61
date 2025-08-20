
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, HardDrive, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAppContext } from '@/contexts/AppContext';

interface PerformanceMetrics {
  buildTime: number;
  bundleSize: number;
  memoryUsage: number;
  cpuUsage: number;
  errorCount: number;
  warningCount: number;
}

export const PerformanceMonitor: React.FC = () => {
  const { state } = useAppContext();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    buildTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    errorCount: 0,
    warningCount: 0
  });

  useEffect(() => {
    // Mock performance monitoring
    const interval = setInterval(() => {
      setMetrics({
        buildTime: Math.random() * 3000 + 500,
        bundleSize: Math.random() * 2000 + 800,
        memoryUsage: Math.random() * 80 + 20,
        cpuUsage: Math.random() * 60 + 10,
        errorCount: Math.floor(Math.random() * 3),
        warningCount: Math.floor(Math.random() * 8)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [state.currentProject]);

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getHealthStatus = () => {
    if (metrics.errorCount > 0) return { status: 'error', color: 'destructive' };
    if (metrics.warningCount > 3) return { status: 'warning', color: 'secondary' };
    return { status: 'healthy', color: 'default' };
  };

  const health = getHealthStatus();

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-accent-cyan" />
          <h3 className="font-semibold text-foreground">Performance</h3>
        </div>
        <Badge variant={health.color as any} className="text-xs">
          {health.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-surface-hover rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-accent-green" />
            <span className="text-sm text-muted">Build Time</span>
          </div>
          <div className="font-semibold text-sm">{formatTime(metrics.buildTime)}</div>
        </div>

        <div className="p-3 bg-surface-hover rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <HardDrive className="w-4 h-4 text-accent-blue" />
            <span className="text-sm text-muted">Bundle Size</span>
          </div>
          <div className="font-semibold text-sm">{formatSize(metrics.bundleSize)}</div>
        </div>

        <div className="p-3 bg-surface-hover rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="w-4 h-4 text-accent-purple" />
            <span className="text-sm text-muted">CPU Usage</span>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-sm">{metrics.cpuUsage.toFixed(1)}%</div>
            <Progress value={metrics.cpuUsage} className="h-1" />
          </div>
        </div>

        <div className="p-3 bg-surface-hover rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-accent-yellow" />
            <span className="text-sm text-muted">Memory</span>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-sm">{metrics.memoryUsage.toFixed(1)}%</div>
            <Progress value={metrics.memoryUsage} className="h-1" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Issues</h4>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted">{metrics.errorCount} Errors</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-muted">{metrics.warningCount} Warnings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
