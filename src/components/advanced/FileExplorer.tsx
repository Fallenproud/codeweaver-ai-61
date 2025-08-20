import React, { useState } from 'react';
import { FileText, Folder, Plus, X, Edit3, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';

export const FileExplorer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [newFileName, setNewFileName] = useState('');
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  const handleFileSelect = (fileId: string) => {
    dispatch({ type: 'SET_ACTIVE_FILE', payload: fileId });
  };

  const handleAddFile = () => {
    if (newFileName.trim()) {
      const fileId = `file-${Date.now()}`;
      const language = getLanguageFromFileName(newFileName);
      
      dispatch({
        type: 'ADD_PROJECT_FILE',
        payload: {
          id: fileId,
          name: newFileName,
          content: getDefaultContent(language),
          language,
          path: newFileName
        }
      });
      
      setNewFileName('');
      setShowNewFileInput(false);
      dispatch({ type: 'SET_ACTIVE_FILE', payload: fileId });
    }
  };

  const getLanguageFromFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js': return 'javascript';
      case 'ts': return 'typescript';
      case 'tsx': return 'typescript';
      case 'jsx': return 'javascript';
      case 'html': return 'html';
      case 'css': return 'css';
      case 'scss': return 'scss';
      case 'json': return 'json';
      case 'md': return 'markdown';
      default: return 'plaintext';
    }
  };

  const getDefaultContent = (language: string): string => {
    switch (language) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;
      case 'javascript':
        return '// JavaScript file\n';
      case 'typescript':
        return '// TypeScript file\n';
      case 'css':
        return '/* CSS styles */\n';
      case 'json':
        return '{\n  \n}';
      default:
        return '';
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return <FileText className="w-4 h-4" />;
  };

  const downloadProject = () => {
    if (!state.currentProject) return;

    const zip = new JSZip();
    
    state.currentProject.files.forEach(file => {
      zip.file(file.name, file.content);
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `${state.currentProject?.name || 'project'}.zip`;
      link.click();
    });
  };

  if (!state.currentProject) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted p-4">
        <Folder className="w-12 h-12 mb-4" />
        <p>No project selected</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-foreground">Files</h3>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNewFileInput(true)}
              className="text-muted hover:text-foreground"
              title="Add File"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadProject}
              className="text-muted hover:text-foreground"
              title="Download Project"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showNewFileInput && (
          <div className="flex space-x-1 mb-2">
            <Input
              placeholder="filename.ext"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddFile()}
              className="text-xs h-8"
              autoFocus
            />
            <Button size="sm" onClick={handleAddFile} className="h-8">
              <Plus className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNewFileInput(false);
                setNewFileName('');
              }}
              className="h-8"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-1">
          {state.currentProject.files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                state.activeFileId === file.id
                  ? "bg-accent-cyan/10 text-accent-cyan"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              )}
              onClick={() => handleFileSelect(file.id)}
            >
              {getFileIcon(file.name)}
              <span className="text-sm flex-1 truncate">{file.name}</span>
              {editingFileId === file.id ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(null);
                  }}
                  className="w-6 h-6 p-0 text-muted hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFileId(file.id);
                  }}
                  className="w-6 h-6 p-0 text-muted hover:text-foreground opacity-0 group-hover:opacity-100"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
