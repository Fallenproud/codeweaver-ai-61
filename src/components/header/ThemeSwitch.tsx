import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Monitor, Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeSwitch: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      value: 'light', 
      label: 'Light', 
      icon: Sun,
      description: 'Light mode with bright interface'
    },
    { 
      value: 'dark', 
      label: 'Dark', 
      icon: Moon,
      description: 'Dark mode for reduced eye strain'
    },
    { 
      value: 'system', 
      label: 'System', 
      icon: Monitor,
      description: 'Follows your system preferences'
    }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[2];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 w-9 p-0 hover:bg-surface-hover"
          aria-label="Toggle theme"
        >
          <CurrentIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 bg-surface border-border shadow-lg" align="end">
        <div className="px-2 py-1.5 text-xs font-medium text-muted mb-1">
          Appearance
        </div>
        {themes.map((themeOption) => {
          const Icon = themeOption.icon;
          const isActive = theme === themeOption.value;
          
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className={`flex items-center px-3 py-2 cursor-pointer hover:bg-surface-hover ${
                isActive ? 'bg-surface-hover' : ''
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-accent-cyan' : 'text-muted'}`} />
              <div className="flex-1">
                <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-foreground'}`}>
                  {themeOption.label}
                </div>
                <div className="text-xs text-muted">
                  {themeOption.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 bg-accent-cyan rounded-full ml-2" />
              )}
            </DropdownMenuItem>
          );
        })}
        
        <div className="border-t border-border mt-2 pt-2">
          <DropdownMenuItem className="flex items-center px-3 py-2 cursor-pointer hover:bg-surface-hover">
            <Palette className="w-4 h-4 mr-3 text-muted" />
            <span className="text-sm">Customize Colors</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};