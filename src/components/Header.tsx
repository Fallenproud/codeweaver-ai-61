
import React from 'react';
import { Zap, Github, Share2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitExportDialog } from '@/components/dialogs/GitExportDialog';
import { ShareDialog } from '@/components/dialogs/ShareDialog';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CodeWeaver AI</h1>
              <p className="text-xs text-muted -mt-1">AI-Powered Web Development</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <GitExportDialog>
            <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
              <Github className="w-4 h-4 mr-2" />
              Export
            </Button>
          </GitExportDialog>
          
          <ShareDialog>
            <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </ShareDialog>
          
          <SettingsDialog>
            <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
              <Settings className="w-4 h-4" />
            </Button>
          </SettingsDialog>
        </div>
      </div>
    </header>
  );
};
