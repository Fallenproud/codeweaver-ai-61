import React from 'react';
import { ChevronRight, Home, Folder, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

interface BreadcrumbItem {
  label: string;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  isCurrentPage?: boolean;
}

export const BreadcrumbNav: React.FC = () => {
  const { state } = useAppContext();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'CodeWeaver AI',
        icon: Home,
        onClick: () => console.log('Navigate to home')
      }
    ];

    switch (state.activeView) {
      case 'editor':
        items.push(
          {
            label: 'Projects',
            icon: Folder,
            onClick: () => console.log('Navigate to projects')
          },
          {
            label: 'My Project',
            onClick: () => console.log('Navigate to project')
          },
          {
            label: 'Editor',
            icon: File,
            isCurrentPage: true
          }
        );
        break;
      case 'history':
        items.push(
          {
            label: 'Generation History',
            isCurrentPage: true
          }
        );
        break;
      case 'templates':
        items.push(
          {
            label: 'Template Library',
            isCurrentPage: true
          }
        );
        break;
      case 'settings':
        items.push(
          {
            label: 'Settings',
            isCurrentPage: true
          }
        );
        break;
      default:
        items.push({
          label: 'Dashboard',
          isCurrentPage: true
        });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-muted flex-shrink-0" />
            )}
            
            {item.onClick && !isLast ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={item.onClick}
                className="h-8 px-2 hover:bg-surface-hover text-muted hover:text-foreground"
              >
                <div className="flex items-center space-x-1">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{item.label}</span>
                </div>
              </Button>
            ) : (
              <div className={`flex items-center space-x-1 px-2 py-1 ${
                isLast ? 'text-foreground font-medium' : 'text-muted'
              }`}>
                {Icon && <Icon className="w-4 h-4" />}
                <span className="truncate max-w-[200px]">{item.label}</span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};