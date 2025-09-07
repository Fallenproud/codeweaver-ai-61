
import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingOverlay } from '@/components/ui/loading-spinner';
import { Sidebar } from '@/components/Sidebar';
import { MonacoEditor } from '@/components/advanced/MonacoEditor';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { SettingsPanel } from '@/components/SettingsPanel';
import { GenerationHistory } from '@/components/GenerationHistory';
import { UnifiedAIPanel } from '@/components/unified/UnifiedAIPanel';
import { CollapsibleFilePanel } from '@/components/panels/CollapsibleFilePanel';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/header/StatusBar';
import { useAppContext } from '@/contexts/AppContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export type ViewType = 'editor' | 'history' | 'templates' | 'settings';

const ResponsiveDashboard = () => {
  const { state, dispatch } = useAppContext();
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  const renderMainContent = () => {
    switch (state.activeView) {
      case 'editor':
        return <EditorLayout />;
      case 'history':
        return (
          <ErrorBoundary>
            <GenerationHistory />
          </ErrorBoundary>
        );
      case 'templates':
        return (
          <ErrorBoundary>
            <TemplateLibrary />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <SettingsPanel />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  const EditorLayout = () => {
    if (isMobile) {
      return <MobileEditorLayout />;
    }
    
    if (isTablet) {
      return <TabletEditorLayout />;
    }
    
    return <DesktopEditorLayout />;
  };

  const MobileEditorLayout = () => (
    <div className="h-full bg-background">
      <div className="h-full flex flex-col">
        {/* Mobile: Tabbed Interface for Space Efficiency */}
        <Tabs defaultValue="ai" className="h-full flex flex-col">
          <div className="bg-surface/80 backdrop-blur-sm border-b border-border/50 px-4 py-2">
            <TabsList className="w-full grid grid-cols-3 bg-background/50">
              <TabsTrigger value="ai" className="text-xs">
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="editor" className="text-xs">
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="ai" className="flex-1 m-0">
            <UnifiedAIPanel />
          </TabsContent>
          
          <TabsContent value="editor" className="flex-1 m-0">
            <MonacoEditor
              onCodeChange={(code) => console.log('Code changed:', code)}
              onRun={() => console.log('Run code')}
              onSave={() => console.log('Save code')}
              onDownload={() => console.log('Download code')}
            />
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 m-0">
            <CollapsibleFilePanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );

  const TabletEditorLayout = () => (
    <div className="h-full bg-surface">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={35} minSize={30}>
          <div className="h-full p-4 bg-background">
            <div className="h-full rounded-lg border border-border-subtle bg-surface overflow-hidden">
              <ErrorBoundary>
                <UnifiedAIPanel />
              </ErrorBoundary>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <div className="h-full p-4 bg-background">
            <div className="h-full rounded-lg border border-border-subtle bg-editor-bg overflow-hidden">
              <ErrorBoundary>
                <MonacoEditor
                  onCodeChange={(code) => console.log('Code changed:', code)}
                  onRun={() => console.log('Run code')}
                  onSave={() => console.log('Save code')}
                  onDownload={() => console.log('Download code')}
                />
              </ErrorBoundary>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <ErrorBoundary>
            <CollapsibleFilePanel />
          </ErrorBoundary>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );

  const DesktopEditorLayout = () => (
    <div className="h-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={25}>
          <div className="h-full p-4 bg-background">
            <div className="h-full rounded-lg border border-border-subtle bg-surface overflow-hidden shadow-sm">
              <ErrorBoundary>
                <UnifiedAIPanel />
              </ErrorBoundary>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={45} minSize={35}>
          <div className="h-full p-4 bg-background">
            <div className="h-full rounded-lg border border-border-subtle bg-editor-bg overflow-hidden shadow-sm">
              <ErrorBoundary>
                <MonacoEditor
                  onCodeChange={(code) => console.log('Code changed:', code)}
                  onRun={() => console.log('Run code')}
                  onSave={() => console.log('Save code')}
                  onDownload={() => console.log('Download code')}
                />
              </ErrorBoundary>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <ErrorBoundary>
            <CollapsibleFilePanel />
          </ErrorBoundary>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <LoadingOverlay isVisible={state.isGenerating} text="Generating code..." />
      
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      
      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || state.activeView !== 'editor') && (
          <ErrorBoundary>
            <Sidebar 
              activeView={state.activeView}
              onViewChange={(view) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view })}
              collapsed={state.sidebarCollapsed}
              onToggleCollapse={() => dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: !state.sidebarCollapsed })}
            />
          </ErrorBoundary>
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className={cn(
            'flex-1 overflow-hidden p-6',
            isMobile && 'p-4'
          )}>
            <div className="h-full rounded-xl border border-border bg-surface shadow-lg overflow-hidden">
              <ErrorBoundary>
                {renderMainContent()}
              </ErrorBoundary>
            </div>
          </main>
          
          <ErrorBoundary>
            <StatusBar />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveDashboard;
