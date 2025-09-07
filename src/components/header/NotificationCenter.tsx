import React, { useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X, Zap, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Code Generation Complete',
    message: 'Your React component has been successfully generated',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false
  },
  {
    id: '2',
    type: 'info',
    title: 'GitHub Sync',
    message: 'Your project has been synced to GitHub repository',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'API Rate Limit',
    message: 'You are approaching your monthly API limit',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true
  },
  {
    id: '4',
    type: 'success',
    title: 'Template Saved',
    message: 'Your custom template has been saved successfully',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true
  }
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return CheckCircle2;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return X;
    case 'info':
      return Info;
    default:
      return Info;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return 'text-accent-green';
    case 'warning':
      return 'text-accent-warning';
    case 'error':
      return 'text-accent-error';
    case 'info':
      return 'text-accent-cyan';
    default:
      return 'text-muted';
  }
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 hover:bg-surface-hover">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-accent-error text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 bg-surface border-border shadow-lg" align="end">
        <DropdownMenuLabel className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs h-6 px-2 hover:bg-surface-hover"
              >
                Mark all read
              </Button>
            )}
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-8 h-8 text-muted mb-2" />
              <p className="text-sm text-muted">No notifications</p>
              <p className="text-xs text-muted">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);
              const iconColor = getNotificationColor(notification.type);
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start p-4 cursor-pointer hover:bg-surface-hover border-b border-border-subtle last:border-b-0"
                  onSelect={() => markAsRead(notification.id)}
                >
                  <div className={`mr-3 mt-0.5 ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted'}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-accent-cyan rounded-full ml-2 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted mb-2 line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-surface-hover"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-surface-hover">
                View All Notifications
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};