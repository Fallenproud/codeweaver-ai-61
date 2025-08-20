
import { Collaborator } from '@/contexts/CollaborationContext';

export interface ShareSettings {
  allowEditing: boolean;
  allowComments: boolean;
  expiration?: Date;
  password?: string;
}

export interface RealtimeUpdate {
  type: 'file_change' | 'cursor_move' | 'selection_change' | 'collaborator_join' | 'collaborator_leave';
  userId: string;
  fileId?: string;
  content?: string;
  cursor?: { x: number; y: number };
  selection?: { start: number; end: number };
  timestamp: string;
}

class CollaborationService {
  private ws: WebSocket | null = null;
  private listeners: Set<(update: RealtimeUpdate) => void> = new Set();

  async createShareLink(projectId: string, settings: ShareSettings): Promise<string> {
    // Mock implementation - would connect to real collaboration service
    const shareId = `share_${projectId}_${Date.now()}`;
    const baseUrl = window.location.origin;
    return `${baseUrl}/shared/${shareId}`;
  }

  async inviteCollaborator(email: string, permissions: string[]): Promise<void> {
    // Mock implementation
    console.log(`Inviting ${email} with permissions:`, permissions);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  connectToProject(projectId: string): void {
    // Mock WebSocket connection
    console.log(`Connecting to project: ${projectId}`);
    
    // Simulate connection
    setTimeout(() => {
      this.listeners.forEach(listener => {
        listener({
          type: 'collaborator_join',
          userId: 'mock_user',
          timestamp: new Date().toISOString()
        });
      });
    }, 1000);
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  sendUpdate(update: Omit<RealtimeUpdate, 'timestamp'>): void {
    const fullUpdate: RealtimeUpdate = {
      ...update,
      timestamp: new Date().toISOString()
    };
    
    // Mock sending update
    console.log('Sending update:', fullUpdate);
  }

  onUpdate(listener: (update: RealtimeUpdate) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async getCollaborators(projectId: string): Promise<Collaborator[]> {
    // Mock implementation
    return [
      {
        id: 'user1',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        isOnline: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: 'user2',
        name: 'Bob Smith',
        email: 'bob@example.com',
        isOnline: false,
        lastSeen: new Date(Date.now() - 300000).toISOString()
      }
    ];
  }
}

export const collaborationService = new CollaborationService();
