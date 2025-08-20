
import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, Camera, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const devices = [
  { id: 'desktop' as DeviceType, label: 'Desktop', icon: Monitor },
  { id: 'tablet' as DeviceType, label: 'Tablet', icon: Tablet },
  { id: 'mobile' as DeviceType, label: 'Mobile', icon: Smartphone },
];

export const Preview = () => {
  const [activeDevice, setActiveDevice] = useState<DeviceType>('desktop');

  const getFrameStyles = () => {
    switch (activeDevice) {
      case 'mobile':
        return 'w-80 h-[680px] mx-auto';
      case 'tablet':
        return 'w-[600px] h-[800px] mx-auto';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-1">
          {devices.map((device) => {
            const Icon = device.icon;
            return (
              <Button
                key={device.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveDevice(device.id)}
                className={cn(
                  "text-muted hover:text-foreground",
                  activeDevice === device.id && "text-accent-cyan bg-accent-cyan/10"
                )}
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-muted hover:text-accent-cyan">
            <Camera className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className={cn(
          "device-frame transition-all duration-300",
          getFrameStyles(),
          activeDevice === 'mobile' && 'device-frame mobile',
          activeDevice === 'tablet' && 'device-frame tablet',
          activeDevice === 'desktop' && 'device-frame desktop'
        )}>
          <iframe
            src="data:text/html;charset=utf-8,<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><title>AI Generated Website</title><style>body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;margin:0;padding:0;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);min-height:100vh;display:flex;align-items:center;justify-content:center}.container{text-align:center;color:white;padding:2rem}.hero-title{font-size:3rem;font-weight:700;margin-bottom:1rem;text-shadow:2px 2px 4px rgba(0,0,0,0.3)}.hero-subtitle{font-size:1.2rem;opacity:0.9;margin-bottom:2rem}.cta-button{background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);color:white;padding:1rem 2rem;border-radius:50px;font-size:1.1rem;cursor:pointer;transition:all 0.3s ease;backdrop-filter:blur(10px)}.cta-button:hover{background:rgba(255,255,255,0.3);transform:translateY(-2px)}</style></head><body><div class='container'><h1 class='hero-title'>Welcome to the Future</h1><p class='hero-subtitle'>AI-powered web development made simple</p><button class='cta-button'>Get Started</button></div></body></html>"
            className="w-full h-full rounded-xl"
            title="Preview"
          />
        </div>
      </div>
    </div>
  );
};
