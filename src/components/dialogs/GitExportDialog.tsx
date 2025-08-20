
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Download, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { gitService, GitExportOptions } from '@/services/gitService';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GitExportDialogProps {
  children: React.ReactNode;
}

export const GitExportDialog: React.FC<GitExportDialogProps> = ({ children }) => {
  const { state } = useAppContext();
  const [isExporting, setIsExporting] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [isCreatingGist, setIsCreatingGist] = useState(false);
  const [gitHubToken, setGitHubToken] = useState('');
  const [gitHubUsername, setGitHubUsername] = useState('');
  const [repoName, setRepoName] = useState('');
  const [createdRepoUrl, setCreatedRepoUrl] = useState('');
  const [createdGistUrl, setCreatedGistUrl] = useState('');
  const [options, setOptions] = useState<GitExportOptions>({
    includeGitignore: true,
    includeReadme: true,
    addCommitMessage: false,
    commitMessage: ''
  });

  const handleExport = async () => {
    if (!state.currentProject) {
      toast({
        title: "No Project",
        description: "Please select a project to export.",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);
    try {
      await gitService.exportAsGitRepository(state.currentProject, options);
      toast({
        title: "Export Successful",
        description: "Your project has been exported as a Git repository ZIP file.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCreateRepository = async () => {
    if (!state.currentProject) {
      toast({
        title: "No Project",
        description: "Please select a project to create repository.",
        variant: "destructive"
      });
      return;
    }

    if (!gitHubToken || !gitHubUsername) {
      toast({
        title: "Missing Credentials",
        description: "Please provide GitHub token and username.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingRepo(true);
    try {
      gitService.setConfig({
        token: gitHubToken,
        username: gitHubUsername,
        repoName: repoName || state.currentProject.name.toLowerCase().replace(/\s+/g, '-')
      });

      const repoUrl = await gitService.createGitHubRepository(state.currentProject);
      setCreatedRepoUrl(repoUrl);
      
      toast({
        title: "Repository Created",
        description: "GitHub repository created successfully!",
      });
    } catch (error) {
      console.error('Repository creation error:', error);
      toast({
        title: "Repository Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create GitHub repository. Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const handleCreateGist = async () => {
    if (!state.currentProject) {
      toast({
        title: "No Project",
        description: "Please select a project to create gist.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingGist(true);
    try {
      const gistUrl = await gitService.createGitHubGist(state.currentProject);
      setCreatedGistUrl(gistUrl);
      
      await navigator.clipboard.writeText(gistUrl);
      toast({
        title: "Gist Created",
        description: "GitHub Gist created and URL copied to clipboard!",
      });
    } catch (error) {
      console.error('Gist creation error:', error);
      toast({
        title: "Gist Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create GitHub Gist. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingGist(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Git Export & GitHub Integration</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Export Options</h3>
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
                    className="resize-none"
                  />
                </div>
              )}
            </div>

            <Button 
              onClick={handleExport} 
              disabled={isExporting || !state.currentProject}
              className="w-full"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Export as ZIP
            </Button>
          </div>

          {/* GitHub Integration */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-medium">GitHub Integration</h3>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                To create repositories, you need a GitHub Personal Access Token with 'repo' permissions.
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-primary hover:underline inline-flex items-center"
                >
                  Create token <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github-token">GitHub Token</Label>
                <Input
                  id="github-token"
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxx"
                  value={gitHubToken}
                  onChange={(e) => setGitHubToken(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github-username">GitHub Username</Label>
                <Input
                  id="github-username"
                  placeholder="your-username"
                  value={gitHubUsername}
                  onChange={(e) => setGitHubUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo-name">Repository Name (optional)</Label>
              <Input
                id="repo-name"
                placeholder={state.currentProject?.name.toLowerCase().replace(/\s+/g, '-') || 'my-project'}
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleCreateRepository}
                disabled={isCreatingRepo || !state.currentProject || !gitHubToken || !gitHubUsername}
                className="flex-1"
                variant="default"
              >
                {isCreatingRepo ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Github className="w-4 h-4 mr-2" />
                )}
                Create Repository
              </Button>
              
              <Button 
                onClick={handleCreateGist}
                disabled={isCreatingGist || !state.currentProject}
                className="flex-1"
                variant="outline"
              >
                {isCreatingGist ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Github className="w-4 h-4 mr-2" />
                )}
                Create Gist
              </Button>
            </div>

            {/* Success Messages */}
            {createdRepoUrl && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Repository created successfully! 
                  <a 
                    href={createdRepoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 font-medium hover:underline inline-flex items-center"
                  >
                    View on GitHub <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </AlertDescription>
              </Alert>
            )}

            {createdGistUrl && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Gist created successfully! 
                  <a 
                    href={createdGistUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 font-medium hover:underline inline-flex items-center"
                  >
                    View Gist <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
