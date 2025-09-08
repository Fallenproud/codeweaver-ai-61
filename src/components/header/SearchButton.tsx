import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { CommandPalette } from '@/components/ui/command-palette';

interface SearchButtonProps {
  onClick?: () => void;
}

export const SearchButton: React.FC<SearchButtonProps> = ({ onClick }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="h-9 w-64 justify-between bg-surface hover:bg-surface-hover border-border text-muted"
      >
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4" />
          <span>Search commands...</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          ⌘K
        </Badge>
      </Button>
      
      {!onClick && (
        <CommandPalette open={open} onOpenChange={setOpen} />
      )}
    </>
  );
};