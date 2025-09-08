import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'online' | 'offline' | 'busy' | 'idle' | 'error' | 'success' | 'warning';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const statusConfig = {
  online: { color: 'bg-accent-green', label: 'Online' },
  offline: { color: 'bg-muted-subtle', label: 'Offline' },
  busy: { color: 'bg-accent-error', label: 'Busy' },
  idle: { color: 'bg-accent-warning', label: 'Idle' },
  error: { color: 'bg-accent-error', label: 'Error' },
  success: { color: 'bg-accent-green', label: 'Success' },
  warning: { color: 'bg-accent-warning', label: 'Warning' },
};

const sizeConfig = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  label,
  className
}) => {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        className={cn(
          "rounded-full border-2 border-background shadow-sm",
          config.color,
          sizeConfig[size],
          status === 'online' && "animate-pulse"
        )}
      />
      {showLabel && (
        <span className="text-xs text-muted font-medium">
          {displayLabel}
        </span>
      )}
    </div>
  );
};