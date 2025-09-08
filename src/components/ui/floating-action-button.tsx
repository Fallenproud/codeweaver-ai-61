import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  variant?: 'default' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
  disabled?: boolean;
}

const positionClasses = {
  'bottom-right': 'bottom-6 right-6',
  'bottom-left': 'bottom-6 left-6',
  'top-right': 'top-6 right-6',
  'top-left': 'top-6 left-6',
};

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
};

const iconSizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  onClick,
  position = 'bottom-right',
  variant = 'default',
  size = 'md',
  tooltip,
  className,
  disabled = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'accent':
        return 'gradient-accent text-white shadow-glow hover:shadow-glow-lg';
      case 'ghost':
        return 'glass-card hover:bg-surface-hover';
      default:
        return 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={cn(
        'fixed z-40 rounded-full transition-all duration-200 hover:scale-105 active:scale-95',
        'shadow-xl border-0',
        positionClasses[position],
        sizeClasses[size],
        getVariantClasses(),
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
    >
      <Icon className={iconSizeClasses[size]} />
    </Button>
  );
};