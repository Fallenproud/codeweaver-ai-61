
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  files: ProjectFile[];
  createdAt: string;
  updatedAt: string;
  template?: string;
}

export interface GenerationSettings {
  model: 'gpt-4' | 'claude-3' | 'gpt-3.5';
  temperature: number;
  creativity: number;
  framework: 'react' | 'vue' | 'angular' | 'vanilla';
  complexity: 'simple' | 'medium' | 'advanced';
}

export interface AppState {
  currentProject: Project | null;
  projects: Project[];
  generationSettings: GenerationSettings;
  activeFileId: string | null;
  isGenerating: boolean;
  generationProgress: number;
  previewDevice: 'desktop' | 'tablet' | 'mobile';
  sidebarCollapsed: boolean;
  activeView: 'editor' | 'history' | 'templates' | 'settings';
}

type AppAction =
  | { type: 'SET_CURRENT_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT_FILE'; payload: { fileId: string; content: string } }
  | { type: 'ADD_PROJECT_FILE'; payload: ProjectFile }
  | { type: 'SET_ACTIVE_FILE'; payload: string }
  | { type: 'SET_GENERATION_SETTINGS'; payload: Partial<GenerationSettings> }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'SET_PREVIEW_DEVICE'; payload: 'desktop' | 'tablet' | 'mobile' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_ACTIVE_VIEW'; payload: 'editor' | 'history' | 'templates' | 'settings' };

const initialState: AppState = {
  currentProject: null,
  projects: [],
  generationSettings: {
    model: 'gpt-4',
    temperature: 0.7,
    creativity: 0.8,
    framework: 'react',
    complexity: 'medium'
  },
  activeFileId: null,
  isGenerating: false,
  generationProgress: 0,
  previewDevice: 'desktop',
  sidebarCollapsed: false,
  activeView: 'editor'
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'UPDATE_PROJECT_FILE':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          files: state.currentProject.files.map(file =>
            file.id === action.payload.fileId
              ? { ...file, content: action.payload.content }
              : file
          )
        }
      };
    case 'ADD_PROJECT_FILE':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          files: [...state.currentProject.files, action.payload]
        }
      };
    case 'SET_ACTIVE_FILE':
      return { ...state, activeFileId: action.payload };
    case 'SET_GENERATION_SETTINGS':
      return {
        ...state,
        generationSettings: { ...state.generationSettings, ...action.payload }
      };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_GENERATION_PROGRESS':
      return { ...state, generationProgress: action.payload };
    case 'SET_PREVIEW_DEVICE':
      return { ...state, previewDevice: action.payload };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
