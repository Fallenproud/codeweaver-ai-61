import React, { useState, useEffect } from 'react';
import { 
  Command, 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { 
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog';
import { Search, FileText, Settings, History, Palette, Code, Play, Download } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const { state, dispatch } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const handleCommand = (command: string) => {
    switch (command) {
      case 'new-file':
        // Handle new file creation
        break;
      case 'settings':
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'settings' });
        break;
      case 'history':
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'history' });
        break;
      case 'templates':
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'templates' });
        break;
      case 'editor':
        dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'editor' });
        break;
      default:
        break;
    }
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <DialogDescription className="sr-only">
        Search for commands, files, and navigate through the application
      </DialogDescription>
      <CommandInput 
        placeholder="Type a command or search..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleCommand('editor')}>
            <Code className="mr-2 h-4 w-4" />
            <span>Go to Editor</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand('history')}>
            <History className="mr-2 h-4 w-4" />
            <span>View History</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand('templates')}>
            <Palette className="mr-2 h-4 w-4" />
            <span>Browse Templates</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand('settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Open Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => handleCommand('new-file')}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Create New File</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand('run-code')}>
            <Play className="mr-2 h-4 w-4" />
            <span>Run Code</span>
          </CommandItem>
          <CommandItem onSelect={() => handleCommand('download')}>
            <Download className="mr-2 h-4 w-4" />
            <span>Download Project</span>
          </CommandItem>
        </CommandGroup>

        {state.currentProject?.files && (
          <CommandGroup heading="Files">
            {state.currentProject.files
              .filter(file => 
                searchQuery === '' || 
                file.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(file => (
                <CommandItem 
                  key={file.id}
                  onSelect={() => {
                    dispatch({ type: 'SET_ACTIVE_FILE', payload: file.id });
                    onOpenChange(false);
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{file.name}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};