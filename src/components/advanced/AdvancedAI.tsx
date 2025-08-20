
import React, { useState, useRef } from 'react';
import { Bot, Wand2, MessageSquare, RefreshCw, Download, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import { aiService } from '@/services/aiService';
import { toast } from '@/components/ui/use-toast';

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

export const AdvancedAI: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [chatMessages, setChatMessages] = useState<AIAssistantMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: AIAssistantMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // Mock AI assistant response
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
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleCodeAnalysis = async () => {
    if (!state.currentProject || !state.activeFileId) {
      toast({
        title: "No File Selected",
        description: "Please select a file to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Mock analysis
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
        setIsProcessing(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleOptimizeCode = async () => {
    if (!state.currentProject || !state.activeFileId) return;

    setIsProcessing(true);
    dispatch({ type: 'SET_GENERATING', payload: true });

    try {
      const currentFile = state.currentProject.files.find(f => f.id === state.activeFileId);
      if (!currentFile) return;

      // Mock optimization
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

        setIsProcessing(false);
        dispatch({ type: 'SET_GENERATING', payload: false });
      }, 2000);
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize code. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-5 h-5 text-accent-cyan" />
          <h3 className="font-semibold text-foreground">AI Assistant</h3>
          <Badge variant="secondary" className="text-xs">Advanced</Badge>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="chat" className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>Chat</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mx-4 mb-4">
          <div className="flex-1 overflow-auto mb-4 space-y-4 max-h-96">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-surface-hover text-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.codeBlocks && message.codeBlocks.map((block, index) => (
                    <div key={index} className="mt-2 p-2 bg-editor-bg rounded text-xs font-mono">
                      <div className="text-muted mb-1">{block.language}</div>
                      <pre className="whitespace-pre-wrap">{block.code}</pre>
                    </div>
                  ))}
                  <div className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-surface-hover text-foreground p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Ask the AI assistant anything about your code..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
              className="min-h-[80px]"
              disabled={isProcessing}
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputMessage.trim()}
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={handleOptimizeCode}
                disabled={isProcessing || !state.activeFileId}
                title="Optimize Current File"
              >
                <Wand2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="flex-1 mx-4 mb-4">
          <div className="space-y-4">
            <Button
              onClick={handleCodeAnalysis}
              disabled={isProcessing || !state.activeFileId}
              className="w-full"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Analyze Current File
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <div className="text-sm text-muted">Analyzing code...</div>
                <Progress value={60} className="h-2" />
              </div>
            )}

            {analysisResults && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-surface-hover rounded-lg">
                    <div className="text-sm text-muted">Complexity</div>
                    <div className="font-semibold">{analysisResults.complexity}</div>
                  </div>
                  <div className="p-3 bg-surface-hover rounded-lg">
                    <div className="text-sm text-muted">Performance</div>
                    <div className="font-semibold">{analysisResults.performance}%</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Suggestions</h4>
                  {analysisResults.suggestions.map((suggestion: string, index: number) => (
                    <div key={index} className="text-sm p-2 bg-surface-hover rounded">
                      {suggestion}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Issues</h4>
                  {analysisResults.issues.map((issue: any, index: number) => (
                    <div key={index} className="text-sm p-2 bg-surface-hover rounded flex items-center space-x-2">
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
