
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={cn('animate-spin text-accent-cyan', sizeClasses[size])} />
        {text && (
          <p className="text-sm text-muted animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
};

export const LoadingCard: React.FC<{ text?: string; className?: string }> = ({ 
  text = "Loading...", 
  className 
}) => (
  <div className={cn('rounded-lg border bg-surface p-8', className)}>
    <LoadingSpinner size="lg" text={text} />
  </div>
);

export const LoadingOverlay: React.FC<{ isVisible: boolean; text?: string }> = ({ 
  isVisible, 
  text = "Loading..." 
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};
