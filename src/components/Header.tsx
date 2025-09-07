
import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GitExportDialog } from '@/components/dialogs/GitExportDialog';
import { ShareDialog } from '@/components/dialogs/ShareDialog';
import { SettingsDialog } from '@/components/dialogs/SettingsDialog';
import { UserProfile } from '@/components/header/UserProfile';
import { NotificationCenter } from '@/components/header/NotificationCenter';
import { ThemeSwitch } from '@/components/header/ThemeSwitch';
import { SearchButton } from '@/components/header/SearchButton';
import { CommandPalette } from '@/components/ui/command-palette';
import { BreadcrumbNav } from '@/components/navigation/BreadcrumbNav';

export const Header = () => {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  return (
    <>
      <header className="h-20 border-b border-border bg-surface/50 backdrop-blur-sm">
        <div className="h-full px-6 flex flex-col">
          {/* Top Row */}
          <div className="flex items-center justify-between h-12 border-b border-border-subtle">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center shadow-glow">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">CodeWeaver AI</h1>
                  <p className="text-xs text-muted -mt-1">AI-Powered Web Development</p>
                </div>
              </div>
              
              <SearchButton onClick={() => setCommandPaletteOpen(true)} />
            </div>

            <div className="flex items-center space-x-2">
              <GitExportDialog>
                <Button variant="ghost" size="sm" className="text-muted hover:text-foreground hover:bg-surface-hover">
                  Export to GitHub
                </Button>
              </GitExportDialog>
              
              <ShareDialog>
                <Button variant="ghost" size="sm" className="text-muted hover:text-foreground hover:bg-surface-hover">
                  Share Project
                </Button>
              </ShareDialog>
              
              <ThemeSwitch />
              <NotificationCenter />
              <UserProfile />
            </div>
          </div>

          {/* Bottom Row - Breadcrumbs */}
          <div className="flex items-center h-8 py-1">
            <BreadcrumbNav />
          </div>
        </div>
      </header>

      <CommandPalette 
        open={commandPaletteOpen} 
        onOpenChange={setCommandPaletteOpen} 
      />
    </>
  );
};
