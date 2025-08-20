
import React from 'react';
import { Calendar, Clock, Eye, Download, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: string;
  model: string;
  preview: string;
  size: string;
  prompt: string;
  files: Array<{
    name: string;
    content: string;
    language: string;
  }>;
}

interface GenerationHistoryItemProps {
  item: HistoryItem;
  onDelete: (id: string) => void;
  onRestore: (item: HistoryItem) => void;
}

export const GenerationHistoryItem: React.FC<GenerationHistoryItemProps> = ({
  item,
  onDelete,
  onRestore
}) => {
  const { dispatch } = useAppContext();

  const handleRestore = () => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: `${item.name} (Restored)`,
      description: `Restored from history: ${item.prompt}`,
      files: item.files.map((file, index) => ({
        ...file,
        id: `file-${Date.now()}-${index}`,
        path: file.name
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
    
    if (newProject.files.length > 0) {
      dispatch({ type: 'SET_ACTIVE_FILE', payload: newProject.files[0].id });
    }

    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'editor' });

    toast({
      title: "Project Restored",
      description: `${item.name} has been restored to your workspace.`,
    });

    onRestore(item);
  };

  const handlePreview = () => {
    window.open(item.preview, '_blank', 'width=1200,height=800');
  };

  const handleDownload = () => {
    // This would implement the download functionality
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`,
    });
  };

  const handleDelete = () => {
    onDelete(item.id);
    toast({
      title: "Item Deleted",
      description: `${item.name} has been removed from history.`,
    });
  };

  return (
    <div className="bg-surface rounded-xl border border-border p-4 hover:shadow-lg transition-all duration-200">
      <div className="aspect-video bg-background rounded-lg mb-3 overflow-hidden">
        <img 
          src={item.preview} 
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground">{item.name}</h3>
        
        <p className="text-sm text-muted line-clamp-2">{item.prompt}</p>
        
        <div className="flex items-center space-x-2 text-sm text-muted">
          <Calendar className="w-3 h-3" />
          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
          <Clock className="w-3 h-3 ml-2" />
          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {item.model}
          </Badge>
          <span className="text-xs text-muted">{item.size}</span>
        </div>
        
        <div className="flex space-x-1 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestore}
            className="text-primary hover:text-primary hover:bg-primary/10 flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Restore
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreview}
            className="text-muted hover:text-foreground"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-muted hover:text-foreground"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
