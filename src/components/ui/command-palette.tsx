import React, { useState, useEffect, useMemo } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, File, Settings, History, Zap, Code, Play, Save, Download, Share2, Github } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface CommandAction {
  id: string;
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  category: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useAppContext();
  const [search, setSearch] = useState('');

  const actions: CommandAction[] = useMemo(() => [
    // Navigation
    {
      id: 'goto-editor',
      title: 'Go to Editor',
      description: 'Switch to code editor view',
      icon: Code,
      shortcut: '⌘1',
      category: 'Navigation',
      action: () => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'editor' })
    },
    {
      id: 'goto-history',
      title: 'Go to History',
      description: 'View generation history',
      icon: History,
      shortcut: '⌘2',
      category: 'Navigation',
      action: () => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'history' })
    },
    {
      id: 'goto-templates',
      title: 'Go to Templates',
      description: 'Browse template library',
      icon: File,
      shortcut: '⌘3',
      category: 'Navigation',
      action: () => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'templates' })
    },
    {
      id: 'goto-settings',
      title: 'Go to Settings',
      description: 'Open application settings',
      icon: Settings,
      shortcut: '⌘,',
      category: 'Navigation',
      action: () => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'settings' })
    },
    // Actions
    {
      id: 'generate-code',
      title: 'Generate Code',
      description: 'Start AI code generation',
      icon: Zap,
      shortcut: '⌘G',
      category: 'Actions',
      action: () => {
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'editor' });
        // Focus on AI input would be implemented here
      }
    },
    {
      id: 'run-code',
      title: 'Run Code',
      description: 'Execute current code',
      icon: Play,
      shortcut: '⌘R',
      category: 'Actions',
      action: () => console.log('Run code')
    },
    {
      id: 'save-project',
      title: 'Save Project',
      description: 'Save all changes',
      icon: Save,
      shortcut: '⌘S',
      category: 'Actions',
      action: () => console.log('Save project')
    },
    // Export
    {
      id: 'export-github',
      title: 'Export to GitHub',
      description: 'Export project to GitHub repository',
      icon: Github,
      category: 'Export',
      action: () => console.log('Export to GitHub')
    },
    {
      id: 'download-zip',
      title: 'Download as ZIP',
      description: 'Download project files as ZIP',
      icon: Download,
      category: 'Export',
      action: () => console.log('Download ZIP')
    },
    {
      id: 'share-project',
      title: 'Share Project',
      description: 'Create shareable link',
      icon: Share2,
      category: 'Export',
      action: () => console.log('Share project')
    },
    // Sidebar
    {
      id: 'toggle-sidebar',
      title: 'Toggle Sidebar',
      description: 'Show or hide sidebar',
      icon: File,
      shortcut: '⌘B',
      category: 'View',
      action: () => dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: !state.sidebarCollapsed })
    }
  ], [state, dispatch]);

  const filteredActions = useMemo(() => {
    if (!search.trim()) return actions;
    
    return actions.filter(action =>
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description?.toLowerCase().includes(search.toLowerCase()) ||
      action.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [actions, search]);

  const groupedActions = useMemo(() => {
    const groups: Record<string, CommandAction[]> = {};
    filteredActions.forEach(action => {
      if (!groups[action.category]) {
        groups[action.category] = [];
      }
      groups[action.category].push(action);
    });
    return groups;
  }, [filteredActions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpenChange]);

  const handleAction = (action: CommandAction) => {
    action.action();
    onOpenChange(false);
    setSearch('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b border-border px-4">
            <Search className="w-4 h-4 mr-2 text-muted" />
            <CommandInput
              placeholder="Search commands..."
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0 text-sm"
            />
            <Badge variant="secondary" className="ml-auto text-xs">
              ⌘K
            </Badge>
          </div>
          <CommandList className="max-h-80">
            <CommandEmpty className="py-6 text-center text-sm text-muted">
              No commands found for "{search}"
            </CommandEmpty>
            {Object.entries(groupedActions).map(([category, categoryActions]) => (
              <CommandGroup key={category} heading={category}>
                {categoryActions.map((action) => (
                  <CommandItem
                    key={action.id}
                    onSelect={() => handleAction(action)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <action.icon className="w-4 h-4 text-muted" />
                      <div>
                        <div className="text-sm font-medium">{action.title}</div>
                        {action.description && (
                          <div className="text-xs text-muted">{action.description}</div>
                        )}
                      </div>
                    </div>
                    {action.shortcut && (
                      <Badge variant="outline" className="text-xs">
                        {action.shortcut}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};