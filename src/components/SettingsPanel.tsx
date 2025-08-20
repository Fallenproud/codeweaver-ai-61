
import React, { useState } from 'react';
import { Brain, Sliders, Palette, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export const SettingsPanel = () => {
  const [temperature, setTemperature] = useState([0.7]);
  const [creativity, setCreativity] = useState([0.8]);

  return (
    <div className="h-full bg-background p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Settings</h2>
        <p className="text-muted">Customize your AI development environment</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* AI Model Settings */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-lg font-semibold text-foreground">AI Model Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="model-select" className="text-foreground mb-2 block">AI Model</Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue placeholder="Select AI model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4 (Balanced)</SelectItem>
                  <SelectItem value="claude-3">Claude-3 (Creative)</SelectItem>
                  <SelectItem value="gpt-3.5">GPT-3.5 (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">
                Temperature: {temperature[0]}
              </Label>
              <Slider
                value={temperature}
                onValueChange={setTemperature}
                max={1}
                min={0}
                step={0.1}
                className="py-2"
              />
              <p className="text-xs text-muted mt-1">Controls randomness in AI responses</p>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">
                Creativity Level: {creativity[0]}
              </Label>
              <Slider
                value={creativity}
                onValueChange={setCreativity}
                max={1}
                min={0}
                step={0.1}
                className="py-2"
              />
              <p className="text-xs text-muted mt-1">Higher values produce more creative outputs</p>
            </div>
          </div>
        </div>

        {/* Generation Preferences */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sliders className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-foreground">Generation Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="framework-select" className="text-foreground mb-2 block">Default Framework</Label>
              <Select defaultValue="react">
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="vanilla">Vanilla JS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complexity-select" className="text-foreground mb-2 block">Code Complexity</Label>
              <Select defaultValue="medium">
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Auto-save Projects</Label>
                <p className="text-xs text-muted">Automatically save projects every 30 seconds</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Enable Syntax Highlighting</Label>
                <p className="text-xs text-muted">Highlight code syntax in the editor</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Theme Customization */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-5 h-5 text-accent-warning" />
            <h3 className="text-lg font-semibold text-foreground">Theme Customization</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-select" className="text-foreground mb-2 block">Editor Theme</Label>
              <Select defaultValue="dark">
                <SelectTrigger className="bg-surface border-border">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark (Recommended)</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="high-contrast">High Contrast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="font-size" className="text-foreground mb-2 block">Font Size</Label>
              <Input
                id="font-size"
                type="number"
                defaultValue="14"
                min="10"
                max="24"
                className="bg-surface border-border"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Animations</Label>
                <p className="text-xs text-muted">Enable smooth animations and transitions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-accent-cyan" />
            <h3 className="text-lg font-semibold text-foreground">Performance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Code Minification</Label>
                <p className="text-xs text-muted">Minify generated code for better performance</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Lazy Loading</Label>
                <p className="text-xs text-muted">Load components only when needed</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-foreground">Image Optimization</Label>
                <p className="text-xs text-muted">Automatically optimize images for web</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="ghost" className="text-muted hover:text-foreground">
            Reset to Defaults
          </Button>
          <Button className="gradient-accent text-white">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};
