
import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { LoadingOverlay } from '@/components/ui/loading-spinner';
import { Sidebar } from '@/components/Sidebar';
import { MonacoEditor } from '@/components/advanced/MonacoEditor';
import { EnhancedPreview } from '@/components/advanced/EnhancedPreview';
import { AIGenerationPanel } from '@/components/advanced/AIGenerationPanel';
import { FileExplorer } from '@/components/advanced/FileExplorer';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';
import { AdvancedAI } from '@/components/advanced/AdvancedAI';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { GenerationHistory } from '@/components/GenerationHistory';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/header/StatusBar';
import { useAppContext } from '@/contexts/AppContext';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
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
    <div className="h-full overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
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
    </div>
  );

  const TabletEditorLayout = () => (
    <div className="h-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="h-full flex flex-col">
            <div className="h-1/2 border-b border-border">
              <ErrorBoundary>
                <FileExplorer />
              </ErrorBoundary>
            </div>
            <div className="h-1/2">
              <ErrorBoundary>
                <AIGenerationPanel />
              </ErrorBoundary>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={40} minSize={30}>
          <ErrorBoundary>
            <MonacoEditor
              onCodeChange={(code) => console.log('Code changed:', code)}
              onRun={() => console.log('Run code')}
              onSave={() => console.log('Save code')}
              onDownload={() => console.log('Download code')}
            />
          </ErrorBoundary>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={30} minSize={20}>
          <ErrorBoundary>
            <EnhancedPreview />
          </ErrorBoundary>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );

  const DesktopEditorLayout = () => (
    <div className="h-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={20} minSize={15}>
          <ErrorBoundary>
            <FileExplorer />
          </ErrorBoundary>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={25} minSize={20}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <ErrorBoundary>
                <AIGenerationPanel />
              </ErrorBoundary>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50}>
              <ErrorBoundary>
                <AdvancedAI />
              </ErrorBoundary>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={35} minSize={25}>
          <ErrorBoundary>
            <MonacoEditor
              onCodeChange={(code) => console.log('Code changed:', code)}
              onRun={() => console.log('Run code')}
              onSave={() => console.log('Save code')}
              onDownload={() => console.log('Download code')}
            />
          </ErrorBoundary>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={20} minSize={15}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70}>
              <ErrorBoundary>
                <EnhancedPreview />
              </ErrorBoundary>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={30}>
              <div className="h-full rounded-lg border border-border-subtle bg-surface-hover/30 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel defaultSize={50}>
                    <ErrorBoundary>
                      <CollaborationPanel />
                    </ErrorBoundary>
                  </ResizablePanel>
                  
                  <ResizableHandle withHandle />
                  
                  <ResizablePanel defaultSize={50}>
                    <ErrorBoundary>
                      <PerformanceMonitor />
                    </ErrorBoundary>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
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
