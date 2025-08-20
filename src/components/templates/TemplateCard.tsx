
import React from 'react';
import { Star, Download, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  downloads: number;
  rating: number;
  tags: string[];
  files: Array<{
    name: string;
    content: string;
    language: string;
  }>;
}

interface TemplateCardProps {
  template: Template;
  onUse: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onUse }) => {
  const { dispatch } = useAppContext();

  const handleUseTemplate = () => {
    // Create new project from template
    const newProject = {
      id: `project-${Date.now()}`,
      name: `${template.name} Project`,
      description: `Project created from ${template.name} template`,
      files: template.files.map((file, index) => ({
        ...file,
        id: `file-${Date.now()}-${index}`,
        path: file.name
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      template: template.id
    };

    dispatch({ type: 'SET_CURRENT_PROJECT', payload: newProject });
    
    if (newProject.files.length > 0) {
      dispatch({ type: 'SET_ACTIVE_FILE', payload: newProject.files[0].id });
    }

    dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'editor' });

    toast({
      title: "Template Applied",
      description: `${template.name} template has been loaded into your project.`,
    });

    onUse(template);
  };

  const handlePreview = () => {
    window.open(template.preview, '_blank', 'width=1200,height=800');
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <div className="aspect-video bg-background overflow-hidden">
        <img 
          src={template.preview} 
          alt={template.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
          <p className="text-sm text-muted line-clamp-2">{template.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted">
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>{template.rating}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-3 h-3" />
            <span>{template.downloads.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={handleUseTemplate}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Use Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="px-3"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="px-3"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
