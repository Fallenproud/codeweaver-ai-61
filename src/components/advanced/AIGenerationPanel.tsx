
import React, { useState } from 'react';
import { Wand2, Loader2, Send, History, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { aiService } from '@/services/aiService';
import { toast } from '@/components/ui/use-toast';

export const AIGenerationPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [streamingCode, setStreamingCode] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate code.",
        variant: "destructive"
      });
      return;
    }

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });
    setStreamingCode('');

    try {
      const response = await aiService.generateCode(
        {
          prompt,
          settings: state.generationSettings,
          context: state.currentProject?.files.map(f => f.content).join('\n\n')
        },
        {
          onProgress: (progress) => {
            dispatch({ type: 'SET_GENERATION_PROGRESS', payload: progress });
          },
          onPartialCode: (code) => {
            setStreamingCode(code);
          },
          onComplete: (result) => {
            setGeneratedCode(result.code);
            
            // Add generated files to current project
            result.files.forEach((file, index) => {
              const fileId = `generated-${Date.now()}-${index}`;
              dispatch({
                type: 'ADD_PROJECT_FILE',
                payload: {
                  id: fileId,
                  name: file.name,
                  content: file.content,
                  language: file.language,
                  path: file.name
                }
              });
            });

            toast({
              title: "Success",
              description: "Code generated successfully!",
            });
          },
          onError: (error) => {
            toast({
              title: "Generation Failed",
              description: error,
              variant: "destructive"
            });
          }
        }
      );
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
      dispatch({ type: 'SET_GENERATION_PROGRESS', payload: 0 });
    }
  };

  const handleImproveCode = async () => {
    if (!state.currentProject || !state.activeFileId) {
      toast({
        title: "Error",
        description: "Please select a file to improve.",
        variant: "destructive"
      });
      return;
    }

    const currentFile = state.currentProject.files.find(f => f.id === state.activeFileId);
    if (!currentFile) return;

    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const improvedCode = await aiService.improveCode(
        currentFile.content,
        ['performance', 'readability', 'best practices'],
        state.generationSettings
      );

      dispatch({
        type: 'UPDATE_PROJECT_FILE',
        payload: { fileId: currentFile.id, content: improvedCode }
      });

      toast({
        title: "Success",
        description: "Code improved successfully!",
      });
    } catch (error) {
      toast({
        title: "Improvement Failed",
        description: "Failed to improve code. Please try again.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Wand2 className="w-5 h-5 text-accent-cyan" />
          <h3 className="font-semibold text-foreground">AI Generation</h3>
          <Badge variant="secondary" className="text-xs">
            {state.generationSettings.model}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <Textarea
            placeholder="Describe what you want to generate... (e.g., 'Create a responsive landing page with a hero section and contact form')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-background border-border"
            disabled={state.isGenerating}
          />
          
          <div className="flex space-x-2">
            <Button
              onClick={handleGenerate}
              disabled={state.isGenerating || !prompt.trim()}
              className="flex-1"
            >
              {state.isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
            <Button
              variant="outline"
              onClick={handleImproveCode}
              disabled={state.isGenerating || !state.activeFileId}
              title="Improve Current File"
            >
              <Wand2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'settings' })}
              title="AI Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>

          {state.isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Generating...</span>
                <span className="text-muted">{state.generationProgress}%</span>
              </div>
              <Progress value={state.generationProgress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {(streamingCode || generatedCode) && (
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Generated Code</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'history' })}
                className="text-muted hover:text-foreground"
              >
                <History className="w-4 h-4 mr-1" />
                History
              </Button>
            </div>
            <div className="bg-editor-bg rounded-lg p-3">
              <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                {streamingCode || generatedCode}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
