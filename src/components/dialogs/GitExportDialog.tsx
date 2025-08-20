
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Download, Loader2 } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { gitService, GitExportOptions } from '@/services/gitService';
import { toast } from '@/components/ui/use-toast';

interface GitExportDialogProps {
  children: React.ReactNode;
}

export const GitExportDialog: React.FC<GitExportDialogProps> = ({ children }) => {
  const { state } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<GitExportOptions>({
    includeGitignore: true,
    includeReadme: true,
    addCommitMessage: false,
    commitMessage: ''
  });

  const handleExport = async () => {
    if (!state.currentProject) return;

    setIsExporting(true);
    try {
      await gitService.exportAsGitRepository(state.currentProject, options);
      toast({
        title: "Export Successful",
        description: "Your project has been exported as a Git repository.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateGist = async () => {
    if (!state.currentProject) return;

    setIsExporting(true);
    try {
      const gistUrl = await gitService.createGitHubGist(state.currentProject);
      await navigator.clipboard.writeText(gistUrl);
      toast({
        title: "Gist Created",
        description: "GitHub Gist created and URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Gist Creation Failed",
        description: "Failed to create GitHub Gist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Export to Git</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="gitignore">Include .gitignore</Label>
              <Switch
                id="gitignore"
                checked={options.includeGitignore}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeGitignore: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="readme">Include README.md</Label>
              <Switch
                id="readme"
                checked={options.includeReadme}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includeReadme: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="commit">Add commit message</Label>
              <Switch
                id="commit"
                checked={options.addCommitMessage}
                onCheckedChange={(checked) => setOptions(prev => ({ ...prev, addCommitMessage: checked }))}
              />
            </div>

            {options.addCommitMessage && (
              <div className="space-y-2">
                <Label htmlFor="commit-message">Commit Message</Label>
                <Textarea
                  id="commit-message"
                  placeholder="Initial commit from CodeWeaver AI"
                  value={options.commitMessage}
                  onChange={(e) => setOptions(prev => ({ ...prev, commitMessage: e.target.value }))}
                />
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button 
              onClick={handleExport} 
              disabled={isExporting || !state.currentProject}
              className="flex-1"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export ZIP
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleCreateGist}
              disabled={isExporting || !state.currentProject}
              className="flex-1"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Github className="w-4 h-4 mr-2" />
              )}
              Create Gist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
