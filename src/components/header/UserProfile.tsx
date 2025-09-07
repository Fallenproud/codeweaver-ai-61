import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User, Settings, LogOut, CreditCard, HelpCircle, Keyboard } from 'lucide-react';

export const UserProfile: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-surface-hover">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-surface border-border shadow-lg" align="end">
        <DropdownMenuLabel className="p-3 pb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">John Doe</p>
              <p className="text-xs text-muted truncate">john.doe@example.com</p>
              <div className="flex items-center mt-1 space-x-2">
                <Badge variant="secondary" className="text-xs px-2 py-0">
                  Pro Plan
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0">
                  Online
                </Badge>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-2" />
        
        <div className="px-3 py-2">
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span>API Credits</span>
            <span>247 / 500</span>
          </div>
          <div className="w-full bg-border rounded-full h-1.5">
            <div 
              className="bg-accent-cyan h-1.5 rounded-full transition-all duration-300" 
              style={{ width: '49.4%' }}
            />
          </div>
        </div>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer">
          <User className="w-4 h-4 mr-3 text-muted" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer">
          <CreditCard className="w-4 h-4 mr-3 text-muted" />
          <span>Billing & Usage</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer">
          <Keyboard className="w-4 h-4 mr-3 text-muted" />
          <span>Keyboard Shortcuts</span>
          <Badge variant="outline" className="ml-auto text-xs">
            ⌘K
          </Badge>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer">
          <HelpCircle className="w-4 h-4 mr-3 text-muted" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer">
          <Settings className="w-4 h-4 mr-3 text-muted" />
          <span>Preferences</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="my-2" />
        
        <DropdownMenuItem className="flex items-center px-3 py-2 text-sm hover:bg-surface-hover cursor-pointer text-accent-error focus:text-accent-error">
          <LogOut className="w-4 h-4 mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};