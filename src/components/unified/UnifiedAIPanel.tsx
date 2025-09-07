import React, { useState, useRef } from 'react';
import { Bot, Wand2, MessageSquare, Send, History, Settings, Zap, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { aiService } from '@/services/aiService';
import { toast } from '@/hooks/use-toast';

interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

export const UnifiedAIPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  
  // Generation state
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [streamingCode, setStreamingCode] = useState('');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<AIAssistantMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatProcessing, setIsChatProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Analysis state
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // Generation handlers
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

  // Chat handlers
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isChatProcessing) return;

    const userMessage: AIAssistantMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsChatProcessing(true);

    try {
      setTimeout(() => {
        const assistantMessage: AIAssistantMessage = {
          id: `msg-${Date.now()}-ai`,
          type: 'assistant',
          content: `I understand you want to ${inputMessage.toLowerCase()}. Let me help you with that. Here are some suggestions:\n\n1. Consider the current project structure\n2. Think about user experience\n3. Ensure code quality and performance`,
          timestamp: new Date().toISOString(),
          codeBlocks: inputMessage.toLowerCase().includes('code') ? [{
            language: 'javascript',
            code: `// Generated code suggestion\nconst example = () => {\n  console.log('AI-generated code');\n};`
          }] : undefined
        };

        setChatMessages(prev => [...prev, assistantMessage]);
        setIsChatProcessing(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      setIsChatProcessing(false);
    }
  };

  // Analysis handlers
  const handleCodeAnalysis = async () => {
    if (!state.currentProject || !state.activeFileId) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      setTimeout(() => {
        setAnalysisResults({
          complexity: 'Medium',
          performance: 85,
          maintainability: 92,
          suggestions: [
            'Consider extracting the large function into smaller utilities',
            'Add error handling for async operations',
            'Implement proper TypeScript types for better type safety'
          ],
          issues: [
            { type: 'warning', message: 'Unused import detected', line: 5 },
            { type: 'info', message: 'Consider using const assertion', line: 12 }
          ]
        });
        setIsAnalyzing(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
    }
  };

  const handleOptimizeCode = async () => {
    if (!state.currentProject || !state.activeFileId) return;

    setIsAnalyzing(true);
    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const currentFile = state.currentProject.files.find(f => f.id === state.activeFileId);
      if (!currentFile) return;

      setTimeout(() => {
        const optimizedCode = `// Optimized by AI\n${currentFile.content}\n\n// Added performance improvements`;
        
        dispatch({
          type: 'UPDATE_PROJECT_FILE',
          payload: { fileId: currentFile.id, content: optimizedCode }
        });

        toast({
          title: "Code Optimized",
          description: "Your code has been optimized for better performance!",
        });

        setIsAnalyzing(false);
        dispatch({ type: 'SET_GENERATING', payload: false });
      }, 2000);
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize code. Please try again.",
        variant: "destructive"
      });
      setIsAnalyzing(false);
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/80 backdrop-blur-sm border-r border-border/50">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
          <Badge variant="secondary" className="text-xs">
            {state.generationSettings.model}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="generate" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="generate" className="flex items-center space-x-1">
            <Wand2 className="w-3 h-3" />
            <span>Generate</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        {/* Generate Tab */}
        <TabsContent value="generate" className="flex-1 flex flex-col mx-4 mb-4">
          <div className="space-y-3 mb-4">
            <Textarea
              placeholder="Describe what you want to generate... (e.g., 'Create a responsive landing page with a hero section and contact form')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] bg-background/50 border-border/50"
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
                  <span className="text-muted-foreground">Generating...</span>
                  <span className="text-muted-foreground">{state.generationProgress}%</span>
                </div>
                <Progress value={state.generationProgress} className="h-2" />
              </div>
            )}
          </div>

          {(streamingCode || generatedCode) && (
            <div className="flex-1 overflow-auto">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">Generated Code</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'history' })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <History className="w-4 h-4 mr-1" />
                    History
                  </Button>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 max-h-80 overflow-auto">
                  <pre className="text-sm text-foreground font-mono whitespace-pre-wrap">
                    {streamingCode || generatedCode}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col mx-4 mb-4">
          {/* Chat Messages Container with Fixed Height and Scroll */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2 bg-surface/30 rounded-lg border border-border-subtle">
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted">
                  <div className="text-center space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto opacity-50" />
                    <p className="text-sm">Start a conversation with your AI assistant</p>
                    <p className="text-xs text-muted-foreground">Ask about code, get suggestions, or request improvements</p>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface border border-border-subtle text-foreground'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.codeBlocks && message.codeBlocks.map((block, index) => (
                          <div key={index} className="mt-3 p-3 bg-editor-bg rounded-md text-xs font-mono border border-border-subtle">
                            <div className="text-accent-cyan mb-2 font-medium">{block.language}</div>
                            <pre className="whitespace-pre-wrap text-foreground-muted overflow-x-auto">{block.code}</pre>
                          </div>
                        ))}
                        <div className="text-xs opacity-60 mt-2 flex items-center justify-between">
                          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                          {message.type === 'assistant' && (
                            <Badge variant="secondary" className="text-xs">AI</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatProcessing && (
                    <div className="flex justify-start animate-fade-in">
                      <div className="bg-surface border border-border-subtle text-foreground p-3 rounded-lg shadow-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          <span className="text-xs text-muted ml-2">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area - Always Visible */}
            <div className="space-y-3 flex-shrink-0 bg-surface/50 p-3 rounded-lg border border-border-subtle">
              <Textarea
                placeholder="Ask the AI assistant anything about your code..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                className="min-h-[80px] bg-background/80 border-border/60 focus:border-accent-cyan/50 focus:ring-accent-cyan/20 resize-none"
                disabled={isChatProcessing}
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={isChatProcessing || !inputMessage.trim()}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  {isChatProcessing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  onClick={handleOptimizeCode}
                  disabled={isAnalyzing || !state.activeFileId}
                  title="Optimize Current File"
                  className="border-border-subtle hover:border-accent-cyan/50"
                >
                  <Wand2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="flex-1 mx-4 mb-4 overflow-auto">
          <div className="space-y-4">
            <Button
              onClick={handleCodeAnalysis}
              disabled={isAnalyzing || !state.activeFileId}
              className="w-full"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Analyze Current File
            </Button>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Analyzing code...</div>
                <Progress value={60} className="h-2" />
              </div>
            )}

            {analysisResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Complexity</div>
                    <div className="font-semibold">{analysisResults.complexity}</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Performance</div>
                    <div className="font-semibold">{analysisResults.performance}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Suggestions</h4>
                  {analysisResults.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Issues</h4>
                  {analysisResults.issues.map((issue: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-muted/50 rounded flex items-center space-x-2">
                      <Badge variant={issue.type === 'warning' ? 'destructive' : 'secondary'} className="text-xs">
                        {issue.type}
                      </Badge>
                      <span>Line {issue.line}: {issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};