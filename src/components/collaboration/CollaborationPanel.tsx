
import React, { useState } from 'react';
import { Users, Share2, Copy, Settings, UserPlus, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCollaboration } from '@/contexts/CollaborationContext';
import { collaborationService } from '@/services/collaborationService';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export const CollaborationPanel: React.FC = () => {
  const { state, dispatch } = useCollaboration();
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const handleEnableCollaboration = async () => {
    dispatch({ type: 'SET_COLLABORATION_ENABLED', payload: true });
    
    try {
      const shareLink = await collaborationService.createShareLink('current-project', {
        allowEditing: true,
        allowComments: true
      });
      dispatch({ type: 'SET_SHARE_LINK', payload: shareLink });
      
      toast({
        title: "Collaboration Enabled",
        description: "Your project is now ready for collaboration!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable collaboration. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await collaborationService.inviteCollaborator(inviteEmail, ['edit', 'comment']);
      setInviteEmail('');
      
      toast({
        title: "Invitation Sent",
        description: `Collaboration invite sent to ${inviteEmail}`,
      });
    } catch (error) {
      toast({
        title: "Invitation Failed",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsInviting(false);
    }
  };

  const copyShareLink = () => {
    if (state.shareLink) {
      navigator.clipboard.writeText(state.shareLink);
      toast({
        title: "Link Copied",
        description: "Share link copied to clipboard!",
      });
    }
  };

  if (!state.isCollaborationEnabled) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <Users className="w-16 h-16 text-muted mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Enable Collaboration</h3>
        <p className="text-muted mb-6 max-w-sm">
          Work together in real-time with your team. Share your project and collaborate seamlessly.
        </p>
        <Button onClick={handleEnableCollaboration} className="w-full max-w-xs">
          <Share2 className="w-4 h-4 mr-2" />
          Enable Collaboration
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Collaboration</h3>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {state.shareLink && (
          <div className="space-y-2 mb-4">
            <label className="text-sm text-muted">Share Link</label>
            <div className="flex space-x-1">
              <Input
                value={state.shareLink}
                readOnly
                className="text-xs"
              />
              <Button size="sm" onClick={copyShareLink}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-muted">Invite Collaborator</label>
          <div className="flex space-x-1">
            <Input
              placeholder="email@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInviteCollaborator()}
              className="text-sm"
            />
            <Button 
              size="sm" 
              onClick={handleInviteCollaborator}
              disabled={isInviting || !inviteEmail.trim()}
            >
              <UserPlus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Active Collaborators ({state.collaborators.length})
          </h4>
          
          {state.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-surface-hover">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={collaborator.avatar} />
                  <AvatarFallback className="text-xs">
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface",
                  collaborator.isOnline ? "bg-green-500" : "bg-gray-400"
                )} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {collaborator.name}
                  </p>
                  {collaborator.id === 'owner' && (
                    <Crown className="w-3 h-3 text-yellow-500" />
                  )}
                </div>
                <p className="text-xs text-muted truncate">{collaborator.email}</p>
              </div>
              
              <Badge variant={collaborator.isOnline ? "default" : "secondary"} className="text-xs">
                {collaborator.isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          ))}
          
          {state.collaborators.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-sm text-muted">No collaborators yet</p>
              <p className="text-xs text-muted">Invite team members to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
