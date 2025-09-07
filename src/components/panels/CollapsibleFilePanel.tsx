import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Files } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileExplorer } from '@/components/advanced/FileExplorer';
import { EnhancedPreview } from '@/components/advanced/EnhancedPreview';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { UsageAnalytics } from '@/components/analytics/UsageAnalytics';
import { cn } from '@/lib/utils';

interface CollapsibleFilePanelProps {
  className?: string;
}

export const CollapsibleFilePanel: React.FC<CollapsibleFilePanelProps> = ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubPanel, setActiveSubPanel] = useState<'files' | 'preview' | 'performance'>('files');

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn("flex h-full", className)}>
      {/* Collapsible Panel */}
      <div
        className={cn(
          "bg-background/80 backdrop-blur-sm border-l border-border/50 transition-all duration-300 ease-in-out flex flex-col",
          isCollapsed ? "w-12" : "w-80"
        )}
      >
        {/* Panel Header */}
        <div className="h-12 border-b border-border/50 flex items-center justify-between px-3">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Files className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">Project</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="p-1 h-auto"
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Panel Content */}
        {!isCollapsed && (
          <>
            {/* Sub-panel Tabs */}
            <div className="border-b border-border/50">
              <div className="flex">
                <button
                  onClick={() => setActiveSubPanel('files')}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeSubPanel === 'files'
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Files
                </button>
                <button
                  onClick={() => setActiveSubPanel('preview')}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeSubPanel === 'preview'
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Preview
                </button>
                <button
                  onClick={() => setActiveSubPanel('performance')}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
                    activeSubPanel === 'performance'
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  Metrics
                </button>
              </div>
            </div>

            {/* Sub-panel Content */}
            <div className="flex-1 overflow-hidden">
              {activeSubPanel === 'files' && (
                <div className="h-full bg-background/30">
                  <FileExplorer />
                </div>
              )}
              {activeSubPanel === 'preview' && (
                <div className="h-full bg-background/30">
                  <EnhancedPreview />
                </div>
              )}
              {activeSubPanel === 'performance' && (
                <div className="h-full overflow-auto bg-background/30 p-3">
                  <div className="space-y-4">
                    <PerformanceMonitor />
                    <div className="border-t border-border-subtle pt-4">
                      <UsageAnalytics />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Collapsed State Icons */}
        {isCollapsed && (
          <div className="flex-1 flex flex-col items-center justify-start pt-4 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsCollapsed(false);
                setActiveSubPanel('files');
              }}
              className="p-2 w-8 h-8"
              title="Files"
            >
              <Files className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};