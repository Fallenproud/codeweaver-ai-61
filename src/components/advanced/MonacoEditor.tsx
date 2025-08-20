
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Save, Download, Maximize2, Settings, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  onCodeChange?: (code: string) => void;
  onRun?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  onCodeChange,
  onRun,
  onSave,
  onDownload
}) => {
  const { state, dispatch } = useAppContext();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFind, setShowFind] = useState(false);

  const currentFile = state.currentProject?.files.find(
    f => f.id === state.activeFileId
  );

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
      lineNumbers: 'on',
      minimap: { enabled: true },
      wordWrap: 'on',
      automaticLayout: true,
      folding: true,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      suggest: {
        showKeywords: true,
        showSnippets: true,
      },
    });

    // Add custom key bindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      setShowFind(true);
      editor.getAction('actions.find')?.run();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined && currentFile) {
      dispatch({
        type: 'UPDATE_PROJECT_FILE',
        payload: { fileId: currentFile.id, content: value }
      });
      onCodeChange?.(value);
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

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!currentFile) {
    return (
      <div className="h-full flex items-center justify-center text-muted">
        <p>Select a file to start editing</p>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col bg-editor-bg ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">
            {getLanguageFromFileName(currentFile.name).toUpperCase()}
          </Badge>
          <span className="text-sm text-muted">{currentFile.name}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRun}
            className="text-muted hover:text-accent-cyan"
            title="Run (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="text-muted hover:text-accent-green"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="text-muted hover:text-foreground"
            title="Format Code"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFind(true)}
            className="text-muted hover:text-foreground"
            title="Find (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="text-muted hover:text-foreground"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-muted hover:text-foreground"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <Editor
          value={currentFile.content}
          language={getLanguageFromFileName(currentFile.name)}
          theme="vs-dark"
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
};
