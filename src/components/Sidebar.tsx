
import React from 'react';
import { Code2, History, FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ViewType } from './Dashboard';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const sidebarItems = [
  { id: 'editor' as ViewType, label: 'Code Editor', icon: Code2 },
  { id: 'history' as ViewType, label: 'Generation History', icon: History },
  { id: 'templates' as ViewType, label: 'Templates', icon: FileText },
  { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
];

export const Sidebar = ({ activeView, onViewChange, collapsed, onToggleCollapse }: SidebarProps) => {
  return (
    <div className={cn(
      "h-full bg-surface border-r border-border transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-full justify-between text-muted hover:text-foreground"
        >
          {!collapsed && <span>Navigation</span>}
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full justify-start text-left transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-accent-cyan border-l-2 border-accent-cyan" 
                      : "text-muted hover:text-foreground hover:bg-surface-hover",
                    collapsed && "px-3"
                  )}
                >
                  <Icon className={cn("w-4 h-4", !collapsed && "mr-3")} />
                  {!collapsed && (
                    <span className="animate-fade-in">{item.label}</span>
                  )}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className={cn(
          "text-xs text-muted",
          collapsed && "text-center"
        )}>
          {collapsed ? "v1.0" : "CodeWeaver AI v1.0"}
        </div>
      </div>
    </div>
  );
};
