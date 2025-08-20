
import React, { useState, useEffect, useRef } from 'react';
import { Monitor, Tablet, Smartphone, Camera, ExternalLink, RotateCcw, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/contexts/AppContext';
import html2canvas from 'html2canvas';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const devices = [
  { id: 'desktop' as DeviceType, label: 'Desktop', icon: Monitor, width: '100%', height: '100%' },
  { id: 'tablet' as DeviceType, label: 'Tablet', icon: Tablet, width: '768px', height: '1024px' },
  { id: 'mobile' as DeviceType, label: 'Mobile', icon: Smartphone, width: '375px', height: '667px' },
];

export const EnhancedPreview: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentFile = state.currentProject?.files.find(f => f.name.endsWith('.html')) ||
                     state.currentProject?.files[0];

  useEffect(() => {
    if (currentFile) {
      // Create blob URL for preview
      const htmlContent = generatePreviewHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [currentFile, state.currentProject?.files]);

  const generatePreviewHTML = (): string => {
    if (!state.currentProject) return '';

    const htmlFile = state.currentProject.files.find(f => f.name.endsWith('.html'));
    const cssFiles = state.currentProject.files.filter(f => f.name.endsWith('.css'));
    const jsFiles = state.currentProject.files.filter(f => f.name.endsWith('.js') || f.name.endsWith('.ts'));

    let html = htmlFile?.content || `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>
    `;

    // Inject CSS
    if (cssFiles.length > 0) {
      const cssContent = cssFiles.map(f => f.content).join('\n');
      html = html.replace(
        '</head>',
        `<style>${cssContent}</style>\n</head>`
      );
    }

    // Inject JavaScript
    if (jsFiles.length > 0) {
      const jsContent = jsFiles.map(f => f.content).join('\n');
      html = html.replace(
        '</body>',
        `<script>${jsContent}</script>\n</body>`
      );
    }

    return html;
  };

  const handleDeviceChange = (deviceId: DeviceType) => {
    dispatch({ type: 'SET_PREVIEW_DEVICE', payload: deviceId });
  };

  const getFrameStyles = () => {
    const device = devices.find(d => d.id === state.previewDevice);
    if (!device) return 'w-full h-full';

    switch (state.previewDevice) {
      case 'mobile':
        return 'w-80 h-[680px] mx-auto';
      case 'tablet':
        return 'w-[600px] h-[800px] mx-auto';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  const captureScreenshot = async () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDocument) {
        const canvas = await html2canvas(iframeDocument.body);
        const link = document.createElement('a');
        link.download = `screenshot-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Screenshot capture failed:', error);
    }
  };

  const refreshPreview = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`h-full flex flex-col bg-background ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <Button
                key={device.id}
                variant="ghost"
                size="sm"
                onClick={() => handleDeviceChange(device.id)}
                className={cn(
                  "text-muted hover:text-foreground",
                  state.previewDevice === device.id && "text-accent-cyan bg-accent-cyan/10"
                )}
                title={device.label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshPreview}
            className="text-muted hover:text-foreground"
            title="Refresh Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={captureScreenshot}
            className="text-muted hover:text-accent-cyan"
            title="Take Screenshot"
          >
            <Camera className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            className="text-muted hover:text-foreground"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-muted hover:text-foreground"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className={cn(
          "device-frame transition-all duration-300 bg-white",
          getFrameStyles()
        )}>
          {previewUrl && (
            <iframe
              ref={iframeRef}
              src={previewUrl}
              className="w-full h-full rounded-xl border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </div>
  );
};
