import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff, 
  Save, 
  Clock, 
  Users, 
  Zap, 
  FileText, 
  AlertTriangle,
  CheckCircle2 
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface StatusBarProps {
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className }) => {
  const { state } = useAppContext();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSaved, setLastSaved] = React.useState(new Date());
  const [collaborators] = React.useState(3); // Mock data
  const [currentFile] = React.useState('src/components/Dashboard.tsx');
  const [cursorPosition] = React.useState({ line: 142, column: 28 });

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getGenerationStatus = () => {
    if (state.isGenerating) {
      return { icon: Zap, text: 'Generating...', color: 'text-accent-warning' };
    }
    return { icon: CheckCircle2, text: 'Ready', color: 'text-accent-green' };
  };

  const generationStatus = getGenerationStatus();
  const GenerationIcon = generationStatus.icon;

  return (
    <div className={`h-8 bg-surface/80 border-t border-border px-4 flex items-center justify-between text-xs backdrop-blur-sm ${className}`}>
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-accent-green" />
              <span className="text-muted">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-accent-error" />
              <span className="text-accent-error">Offline</span>
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Current File */}
        <div className="flex items-center space-x-1">
          <FileText className="w-3 h-3 text-muted" />
          <span className="text-foreground font-mono">{currentFile}</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Cursor Position */}
        <div className="flex items-center space-x-1">
          <span className="text-muted">Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Generation Status */}
        <div className="flex items-center space-x-1">
          <GenerationIcon className={`w-3 h-3 ${generationStatus.color}`} />
          <span className={generationStatus.color}>{generationStatus.text}</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Collaborators */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 px-2 hover:bg-surface-hover"
        >
          <div className="flex items-center space-x-1">
            <Users className="w-3 h-3 text-muted" />
            <span className="text-muted">{collaborators}</span>
          </div>
        </Button>

        <Separator orientation="vertical" className="h-4" />

        {/* Auto-save Status */}
        <div className="flex items-center space-x-1">
          <Save className="w-3 h-3 text-accent-green" />
          <span className="text-muted">Saved {formatTime(lastSaved)}</span>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Project Stats */}
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-xs px-2 py-0">
            24 files
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-0">
            2.1MB
          </Badge>
        </div>

        <Separator orientation="vertical" className="h-4" />

        {/* Current Time */}
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-muted" />
          <span className="text-muted font-mono">{formatTime(new Date())}</span>
        </div>
      </div>
    </div>
  );
};