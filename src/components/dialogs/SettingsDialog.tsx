
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { SettingsPanel } from '@/components/SettingsPanel';

interface SettingsDialogProps {
  children: React.ReactNode;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          <SettingsPanel />
        </div>
      </DialogContent>
    </Dialog>
  );
};
