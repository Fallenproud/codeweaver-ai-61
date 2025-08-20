
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { CodeEditor } from './CodeEditor';
import { Preview } from './Preview';
import { GenerationHistory } from './GenerationHistory';
import { TemplateLibrary } from './TemplateLibrary';
import { SettingsPanel } from './SettingsPanel';
import { Header } from './Header';

export type ViewType = 'editor' | 'history' | 'templates' | 'settings';

const Dashboard = () => {
  const [activeView, setActiveView] = useState<ViewType>('editor');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderMainContent = () => {
    switch (activeView) {
      case 'editor':
        return (
          <div className="flex h-full">
            <div className="flex-1 flex flex-col">
              <CodeEditor />
            </div>
            <div className="w-1/2 border-l border-border">
              <Preview />
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
          activeView={activeView}
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-hidden">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
