import React, { useState } from 'react';
import { Project, ProjectFile } from '@/contexts/AppContext';
import { ShareOptions } from '@/services/shareService';
import { MonacoEditor } from '@/components/advanced/MonacoEditor';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Code, Download, GitFork, Share2, FileText } from 'lucide-react';
import { EnhancedPreview } from '@/components/advanced/EnhancedPreview';
import { useToast } from '@/hooks/use-toast';
import JSZip from 'jszip';

interface SharedProjectLayoutProps {
  project: Project;
  shareOptions: ShareOptions;
  allowForks: boolean;
}

// Simple read-only file explorer for shared projects
const ReadOnlyFileExplorer: React.FC<{
  files: ProjectFile[];
  selectedFileId: string;
  onFileSelect: (fileId: string) => void;
}> = ({ files, selectedFileId, onFileSelect }) => {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <div
          key={file.id}
          className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors ${
            selectedFileId === file.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted"
          }`}
          onClick={() => onFileSelect(file.id)}
        >
          <FileText className="w-4 h-4" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <Badge variant="outline" className="text-xs">
            {file.language || 'text'}
          </Badge>
        </div>
      ))}
    </div>
  );
};

// Simple read-only Monaco editor wrapper
const ReadOnlyEditor: React.FC<{
  file: ProjectFile;
}> = ({ file }) => {
  return (
    <div className="h-full">
      <MonacoEditor />
    </div>
  );
};

interface SharedProjectLayoutProps {
  project: Project;
  shareOptions: ShareOptions;
  allowForks: boolean;
}

export const SharedProjectLayout: React.FC<SharedProjectLayoutProps> = ({
  project,
  shareOptions,
  allowForks
}) => {
  const [selectedFileId, setSelectedFileId] = useState(project.files[0]?.id || '');
  const { toast } = useToast();

  const selectedFile = project.files.find(f => f.id === selectedFileId) || project.files[0];

  const generatePreviewHTML = () => {
    const htmlFile = project.files.find(f => 
      f.language === 'html' || f.name.toLowerCase().endsWith('.html')
    );
    
    if (!htmlFile) {
      return '<div style="padding: 20px; text-align: center; font-family: Arial;">No HTML file found for preview</div>';
    }

    let html = htmlFile.content || '';
    
    // Inject CSS files
    const cssFiles = project.files.filter(f => 
      f.language === 'css' || f.name.toLowerCase().endsWith('.css')
    );
    
    cssFiles.forEach(cssFile => {
      const cssContent = `<style>${cssFile.content}</style>`;
      if (html.includes('</head>')) {
        html = html.replace('</head>', cssContent + '</head>');
      } else {
        html = cssContent + html;
      }
    });
    
    // Inject JavaScript files
    const jsFiles = project.files.filter(f => 
      f.language === 'javascript' || f.name.toLowerCase().endsWith('.js')
    );
    
    jsFiles.forEach(jsFile => {
      const jsContent = `<script>${jsFile.content}</script>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', jsContent + '</body>');
      } else {
        html = html + jsContent;
      }
    });
    
    return html;
  };

  const handleDownloadProject = async () => {
    try {
      const zip = new JSZip();
      
      // Add all project files to zip
      project.files.forEach(file => {
        const fileName = file.name || `file_${file.id}`;
        zip.file(fileName, file.content || '');
      });

      // Add a README with project info
      const readme = `# ${project.name}

${project.description || 'Shared project from CodeWeaver'}

## Files
${project.files.map(f => `- ${f.name || f.id} (${f.language || 'text'})`).join('\n')}

Generated on: ${new Date().toISOString()}
`;
      
      zip.file('README.md', readme);

      // Generate and download zip
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name || 'shared-project'}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download Complete',
        description: 'Project files have been downloaded as a ZIP archive.',
      });
    } catch (error) {
      console.error('Error downloading project:', error);
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading the project files.',
        variant: 'destructive',
      });
    }
  };

  const handleForkProject = () => {
    // In a real implementation, this would create a new project
    // For now, we'll just copy to clipboard and show instructions
    const projectData = JSON.stringify(project, null, 2);
    navigator.clipboard.writeText(projectData);
    
    toast({
      title: 'Project Data Copied',
      description: 'The project data has been copied to your clipboard. You can now paste it into a new project.',
    });
  };

  const handleShareProject = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Share link copied to clipboard.',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Could not copy link to clipboard.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge variant="secondary">Shared Project</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareProject}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadProject}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              {allowForks && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleForkProject}
                >
                  <GitFork className="h-4 w-4 mr-2" />
                  Fork
                </Button>
              )}
            </div>
          </div>

          {project.description && (
            <p className="text-muted-foreground mt-2">{project.description}</p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* File Explorer */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Project Files</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <ReadOnlyFileExplorer
                  files={project.files}
                  selectedFileId={selectedFileId}
                  onFileSelect={setSelectedFileId}
                />
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Code & Preview */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code View
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {selectedFile?.name || `File ${selectedFile?.id}`}
                      </CardTitle>
                      <Badge variant="outline">
                        {selectedFile?.language || 'text'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ReadOnlyEditor file={selectedFile} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                {shareOptions.includePreview ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Live Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[600px] border rounded-md overflow-hidden bg-background">
                        <iframe
                          src={`data:text/html;charset=utf-8,${encodeURIComponent(generatePreviewHTML())}`}
                          className="w-full h-full border-0"
                          title="Project Preview"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-[600px]">
                      <div className="text-center">
                        <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
                        <p className="text-muted-foreground">
                          The project owner has disabled preview for this shared project.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};