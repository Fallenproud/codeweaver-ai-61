import React from 'react';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  isLoading, 
  message = "Processing...",
  className 
}) => {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center",
      "bg-background/80 backdrop-blur-sm",
      className
    )}>
      <div className="glass-card p-8 rounded-xl shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center shadow-glow animate-pulse">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-accent-cyan animate-spin" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              CodeWeaver AI
            </h3>
            <p className="text-sm text-muted">
              {message}
            </p>
          </div>
          
          <div className="w-full bg-surface rounded-full h-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-cyan to-accent-green animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;