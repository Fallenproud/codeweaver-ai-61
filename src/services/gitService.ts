
import JSZip from 'jszip';
import { Project } from '@/contexts/AppContext';

export interface GitExportOptions {
  includeGitignore: boolean;
  includeReadme: boolean;
  addCommitMessage: boolean;
  commitMessage?: string;
}

class GitService {
  async exportAsGitRepository(project: Project, options: GitExportOptions = {
    includeGitignore: true,
    includeReadme: true,
    addCommitMessage: false
  }): Promise<void> {
    const zip = new JSZip();
    
    // Add project files
    project.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    // Add .gitignore if requested
    if (options.includeGitignore) {
      const gitignoreContent = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db`;
      
      zip.file('.gitignore', gitignoreContent);
    }

    // Add README.md if requested
    if (options.includeReadme) {
      const readmeContent = `# ${project.name}

${project.description || 'A project created with CodeWeaver AI'}

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Project Structure

This project was generated using CodeWeaver AI and follows modern web development best practices.

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Vite

---

Generated with ❤️ by [CodeWeaver AI](https://codeweaver.ai)
`;
      
      zip.file('README.md', readmeContent);
    }

    // Add package.json
    const packageJson = {
      "name": project.name.toLowerCase().replace(/\s+/g, '-'),
      "version": "1.0.0",
      "description": project.description || "A project created with CodeWeaver AI",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react": "^4.0.0",
        "typescript": "^5.0.0",
        "vite": "^4.0.0"
      }
    };

    zip.file('package.json', JSON.stringify(packageJson, null, 2));

    // Generate and download
    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-git-export.zip`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async createGitHubGist(project: Project): Promise<string> {
    // Mock GitHub Gist creation - in real implementation would use GitHub API
    const gistId = `gist_${Date.now()}`;
    const gistUrl = `https://gist.github.com/${gistId}`;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Created GitHub Gist:', gistUrl);
    return gistUrl;
  }
}

export const gitService = new GitService();
