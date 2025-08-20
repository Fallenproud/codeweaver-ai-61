
import React, { useState } from 'react';
import { Play, Save, Download, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sampleCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Website</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            color: white;
            padding: 2rem;
        }
        .hero-title {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .hero-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 2rem;
        }
        .cta-button {
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        .cta-button:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="hero-title">Welcome to the Future</h1>
        <p class="hero-subtitle">AI-powered web development made simple</p>
        <button class="cta-button">Get Started</button>
    </div>
</body>
</html>`;

export const CodeEditor = () => {
  const [code, setCode] = useState(sampleCode);

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      <div className="h-12 bg-surface border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-xs">HTML</Badge>
          <span className="text-sm text-muted">index.html</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="sm" className="text-muted hover:text-accent-cyan">
            <Play className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted hover:text-accent-green">
            <Save className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-muted hover:text-foreground">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          <div className="w-12 bg-editor-line border-r border-border line-numbers flex flex-col text-xs text-center py-2">
            {code.split('\n').map((_, index) => (
              <div key={index} className="h-6 flex items-center justify-center">
                {index + 1}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-transparent text-foreground font-mono text-sm resize-none border-none outline-none leading-6"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
