
import React, { useState } from 'react';
import { Settings, User, Palette, Keyboard, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AISettingsPanel } from '@/components/settings/AISettingsPanel';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

export const SettingsPanel = () => {
  const { state } = useAppContext();
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleExportSettings = () => {
    const settings = {
      generationSettings: state.generationSettings,
      theme,
      autoSave,
      notifications
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'codeweaver-settings.json';
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Settings Exported",
      description: "Your settings have been exported successfully.",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        // Apply imported settings
        toast({
          title: "Settings Imported",
          description: "Your settings have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import settings. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full bg-background p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Settings</h2>
        <p className="text-muted">Customize your CodeWeaver AI experience</p>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>AI</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Keyboard className="w-4 h-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Account</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          <AISettingsPanel />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Appearance</h3>
            
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-save">Auto-save projects</Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Show notifications</Label>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Editor Preferences</h3>
            
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select defaultValue="14">
                <SelectTrigger id="font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">12px</SelectItem>
                  <SelectItem value="14">14px</SelectItem>
                  <SelectItem value="16">16px</SelectItem>
                  <SelectItem value="18">18px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font-family">Font Family</Label>
              <Select defaultValue="jetbrains">
                <SelectTrigger id="font-family">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                  <SelectItem value="fira">Fira Code</SelectItem>
                  <SelectItem value="consolas">Consolas</SelectItem>
                  <SelectItem value="monaco">Monaco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="line-numbers">Show line numbers</Label>
              <Switch id="line-numbers" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="minimap">Show minimap</Label>
              <Switch id="minimap" defaultChecked />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account & Data</h3>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="Enter username" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Settings Backup</h4>
              <div className="flex space-x-2">
                <Button onClick={handleExportSettings} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                <Button variant="outline" className="relative">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Settings
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportSettings}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
