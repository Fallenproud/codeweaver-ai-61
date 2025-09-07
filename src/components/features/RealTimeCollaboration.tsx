import React, { useState, useEffect } from 'react';
import { Users, Wifi, WifiOff, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CollaboratorInfo {
  id: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  lastSeen: string;
  currentFile?: string;
  cursorPosition?: { line: number; column: number };
}

interface RealTimeCollaborationProps {
  className?: string;
}

export const RealTimeCollaboration: React.FC<RealTimeCollaborationProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([
    {
      id: '1',
      name: 'Alex Chen',
      avatar: '',
      isActive: true,
      lastSeen: 'now',
      currentFile: 'App.tsx',
      cursorPosition: { line: 42, column: 15 }
    },
    {
      id: '2',
      name: 'Sarah Kim',
      avatar: '',
      isActive: true,
      lastSeen: '2m ago',
      currentFile: 'components/Header.tsx'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      avatar: '',
      isActive: false,
      lastSeen: '5m ago'
    }
  ]);

  // Simulate connection status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const activeCollaborators = collaborators.filter(c => c.isActive);
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <TooltipProvider>
      <div className={cn("flex items-center space-x-2", className)}>
        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-accent-green" />
          ) : (
            <WifiOff className="w-4 h-4 text-accent-error" />
          )}
          <Badge 
            variant={isConnected ? "secondary" : "destructive"} 
            className="text-xs"
          >
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
        </div>

        {/* Active Collaborators */}
        {activeCollaborators.length > 0 && (
          <>
            <div className="w-px h-4 bg-border-subtle" />
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-muted" />
              <span className="text-xs text-muted">{activeCollaborators.length}</span>
            </div>
            
            <div className="flex -space-x-2">
              {activeCollaborators.slice(0, 3).map((collaborator) => (
                <Tooltip key={collaborator.id}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      <Avatar className="w-6 h-6 border-2 border-background">
                        <AvatarImage src={collaborator.avatar} alt={collaborator.name} />
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                          {getInitials(collaborator.name)}
                        </AvatarFallback>
                      </Avatar>
                      {collaborator.isActive && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent-green rounded-full border border-background" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <div className="space-y-1">
                      <div className="font-medium">{collaborator.name}</div>
                      {collaborator.currentFile && (
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          <span>{collaborator.currentFile}</span>
                        </div>
                      )}
                      {collaborator.cursorPosition && (
                        <div className="text-muted-foreground">
                          Line {collaborator.cursorPosition.line}:{collaborator.cursorPosition.column}
                        </div>
                      )}
                      <div className="text-muted-foreground">
                        Last seen: {collaborator.lastSeen}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
              {activeCollaborators.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{activeCollaborators.length - 3}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
};