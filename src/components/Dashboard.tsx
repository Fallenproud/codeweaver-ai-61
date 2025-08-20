
import React from 'react';
import { Sidebar } from './Sidebar';
import { MonacoEditor } from './advanced/MonacoEditor';
import { EnhancedPreview } from './advanced/EnhancedPreview';
import { AIGenerationPanel } from './advanced/AIGenerationPanel';
import { FileExplorer } from './advanced/FileExplorer';
import { GenerationHistory } from './GenerationHistory';
import { TemplateLibrary } from './TemplateLibrary';
import { SettingsPanel } from './SettingsPanel';
import { Header } from './Header';
import { useAppContext } from '@/contexts/AppContext';

export type ViewType = 'editor' | 'history' | 'templates' | 'settings';

const Dashboard = () => {
  const { state, dispatch } = useAppContext();

  const renderMainContent = () => {
    switch (state.activeView) {
      case 'editor':
        return (
          <div className="flex h-full">
            <div className="w-64">
              <FileExplorer />
            </div>
            <div className="w-80">
              <AIGenerationPanel />
            </div>
            <div className="flex-1 flex flex-col">
              <MonacoEditor
                onCodeChange={(code) => console.log('Code changed:', code)}
                onRun={() => console.log('Run code')}
                onSave={() => console.log('Save code')}
                onDownload={() => console.log('Download code')}
              />
            </div>
            <div className="w-1/2 border-l border-border">
              <EnhancedPreview />
            </div>
          </div>
        );
      case 'history':
        return <GenerationHistory />;
      case 'templates':
        return <TemplateLibrary />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activeView={state.activeView}
          onViewChange={(view) => dispatch({ type: 'SET_ACTIVE_VIEW', payload: view })}
          collapsed={state.sidebarCollapsed}
          onToggleCollapse={() => dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: !state.sidebarCollapsed })}
        />
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
