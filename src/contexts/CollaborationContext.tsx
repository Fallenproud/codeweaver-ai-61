
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useAppContext } from './AppContext';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  cursor?: {
    x: number;
    y: number;
    fileId: string;
  };
  selection?: {
    fileId: string;
    start: number;
    end: number;
  };
  isOnline: boolean;
  lastSeen: string;
}

export interface CollaborationState {
  collaborators: Collaborator[];
  isCollaborationEnabled: boolean;
  shareLink?: string;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canView: boolean;
  };
}

type CollaborationAction =
  | { type: 'ADD_COLLABORATOR'; payload: Collaborator }
  | { type: 'REMOVE_COLLABORATOR'; payload: string }
  | { type: 'UPDATE_COLLABORATOR'; payload: Partial<Collaborator> & { id: string } }
  | { type: 'SET_COLLABORATION_ENABLED'; payload: boolean }
  | { type: 'SET_SHARE_LINK'; payload: string }
  | { type: 'UPDATE_PERMISSIONS'; payload: Partial<CollaborationState['permissions']> };

const initialState: CollaborationState = {
  collaborators: [],
  isCollaborationEnabled: false,
  permissions: {
    canEdit: true,
    canComment: true,
    canView: true
  }
};

function collaborationReducer(state: CollaborationState, action: CollaborationAction): CollaborationState {
  switch (action.type) {
    case 'ADD_COLLABORATOR':
      return {
        ...state,
        collaborators: [...state.collaborators, action.payload]
      };
    case 'REMOVE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.filter(c => c.id !== action.payload)
      };
    case 'UPDATE_COLLABORATOR':
      return {
        ...state,
        collaborators: state.collaborators.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        )
      };
    case 'SET_COLLABORATION_ENABLED':
      return { ...state, isCollaborationEnabled: action.payload };
    case 'SET_SHARE_LINK':
      return { ...state, shareLink: action.payload };
    case 'UPDATE_PERMISSIONS':
      return {
        ...state,
        permissions: { ...state.permissions, ...action.payload }
      };
    default:
      return state;
  }
}

const CollaborationContext = createContext<{
  state: CollaborationState;
  dispatch: React.Dispatch<CollaborationAction>;
} | null>(null);

export const CollaborationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(collaborationReducer, initialState);
  const { state: appState } = useAppContext();

  // Simulate real-time collaboration updates
  useEffect(() => {
    if (state.isCollaborationEnabled && appState.currentProject) {
      const interval = setInterval(() => {
        // Simulate collaborator activity
        const mockCollaborators = [
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
            isOnline: Math.random() > 0.5,
            lastSeen: new Date().toISOString()
          }
        ];

        mockCollaborators.forEach(collaborator => {
          dispatch({ type: 'UPDATE_COLLABORATOR', payload: collaborator });
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [state.isCollaborationEnabled, appState.currentProject]);

  return (
    <CollaborationContext.Provider value={{ state, dispatch }}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
