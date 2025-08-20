
import React from 'react';
import { Brain, Sliders, Zap, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';

export const AISettingsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { generationSettings } = state;

  const updateSettings = (key: keyof typeof generationSettings, value: any) => {
    dispatch({
      type: 'SET_GENERATION_SETTINGS',
      payload: { [key]: value }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Generation Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model">AI Model</Label>
          <Select
            value={generationSettings.model}
            onValueChange={(value: 'gpt-4' | 'claude-3' | 'gpt-3.5') => updateSettings('model', value)}
          >
            <SelectTrigger id="model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4">GPT-4 (Best Quality)</SelectItem>
              <SelectItem value="claude-3">Claude-3 (Balanced)</SelectItem>
              <SelectItem value="gpt-3.5">GPT-3.5 (Fastest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="framework">Framework</Label>
          <Select
            value={generationSettings.framework}
            onValueChange={(value: 'react' | 'vue' | 'angular' | 'vanilla') => updateSettings('framework', value)}
          >
            <SelectTrigger id="framework">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue.js</SelectItem>
              <SelectItem value="angular">Angular</SelectItem>
              <SelectItem value="vanilla">Vanilla HTML/CSS/JS</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complexity">Complexity Level</Label>
          <Select
            value={generationSettings.complexity}
            onValueChange={(value: 'simple' | 'medium' | 'advanced') => updateSettings('complexity', value)}
          >
            <SelectTrigger id="complexity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Temperature: {generationSettings.temperature}</Label>
          <Slider
            value={[generationSettings.temperature]}
            onValueChange={([value]) => updateSettings('temperature', value)}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <p className="text-sm text-muted">Controls randomness in AI responses</p>
        </div>

        <div className="space-y-3">
          <Label>Creativity: {generationSettings.creativity}</Label>
          <Slider
            value={[generationSettings.creativity]}
            onValueChange={([value]) => updateSettings('creativity', value)}
            max={1}
            min={0}
            step={0.1}
            className="w-full"
          />
          <p className="text-sm text-muted">Higher values produce more creative outputs</p>
        </div>
      </div>
    </div>
  );
};
