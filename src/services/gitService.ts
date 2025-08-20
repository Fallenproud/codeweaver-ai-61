
import JSZip from 'jszip';
import { Project } from '@/contexts/AppContext';

export interface GitExportOptions {
  includeGitignore: boolean;
  includeReadme: boolean;
  addCommitMessage: boolean;
  commitMessage?: string;
}

export interface GitHubConfig {
  token?: string;
  username?: string;
  repoName?: string;
}

class GitService {
  private config: GitHubConfig = {};

  setConfig(config: Partial<GitHubConfig>) {
    this.config = { ...this.config, ...config };
  }

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
.pnpm-debug.log*

# Production
/build
/dist
/.next
/out

# Environment variables
.env
.env*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# ESLint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Temporary folders
tmp/
temp/`;
      
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

3. Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Project Structure

\`\`\`
${project.files.map(file => file.path).join('\n')}
\`\`\`

This project was generated using CodeWeaver AI and follows modern web development best practices.

## Technologies Used

- React 18 with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Modern ES modules

## Deployment

The easiest way to deploy your app is to use platforms like:
- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [GitHub Pages](https://pages.github.com)

---

Generated with ❤️ by [CodeWeaver AI](https://codeweaver.ai)
`;
      
      zip.file('README.md', readmeContent);
    }

    // Add package.json with proper dependencies
    const packageJson = {
      "name": project.name.toLowerCase().replace(/\s+/g, '-'),
      "private": true,
      "version": "1.0.0",
      "description": project.description || "A project created with CodeWeaver AI",
      "type": "module",
      "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
      },
      "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "lucide-react": "^0.462.0",
        "clsx": "^2.1.1",
        "tailwind-merge": "^2.6.0"
      },
      "devDependencies": {
        "@types/react": "^18.2.79",
        "@types/react-dom": "^18.2.25",
        "@typescript-eslint/eslint-plugin": "^8.0.0",
        "@typescript-eslint/parser": "^8.0.0",
        "@vitejs/plugin-react": "^4.3.1",
        "autoprefixer": "^10.4.19",
        "eslint": "^9.0.0",
        "eslint-plugin-react-hooks": "^5.0.0",
        "eslint-plugin-react-refresh": "^0.4.11",
        "postcss": "^8.4.38",
        "tailwindcss": "^3.4.3",
        "typescript": "^5.5.3",
        "vite": "^5.3.1"
      }
    };

    zip.file('package.json', JSON.stringify(packageJson, null, 2));

    // Add TypeScript config
    const tsConfig = {
      "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": true,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": true,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "resolveJsonModule": true,
        "isolatedModules": true,
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"]
        }
      },
      "include": ["src"],
      "references": [{ "path": "./tsconfig.node.json" }]
    };

    zip.file('tsconfig.json', JSON.stringify(tsConfig, null, 2));

    // Add Vite config
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
`;

    zip.file('vite.config.ts', viteConfig);

    // Add Tailwind config
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`;

    zip.file('tailwind.config.js', tailwindConfig);

    // Generate and download
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-git-export.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  async createGitHubRepository(project: Project): Promise<string> {
    if (!this.config.token || !this.config.username) {
      throw new Error('GitHub token and username are required');
    }

    const repoName = this.config.repoName || project.name.toLowerCase().replace(/\s+/g, '-');
    
    try {
      // Create repository
      const response = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.config.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          name: repoName,
          description: project.description || `A project created with CodeWeaver AI`,
          private: false,
          auto_init: true
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create repository');
      }

      const repo = await response.json();
      
      // Upload files to repository
      for (const file of project.files) {
        await this.uploadFileToGitHub(repo.full_name, file.path, file.content);
      }

      return repo.html_url;
    } catch (error) {
      console.error('GitHub repository creation failed:', error);
      throw error;
    }
  }

  private async uploadFileToGitHub(repoFullName: string, filePath: string, content: string): Promise<void> {
    const encodedContent = btoa(unescape(encodeURIComponent(content)));
    
    await fetch(`https://api.github.com/repos/${repoFullName}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: `Add ${filePath}`,
        content: encodedContent,
        committer: {
          name: 'CodeWeaver AI',
          email: 'ai@codeweaver.dev'
        }
      })
    });
  }

  async createGitHubGist(project: Project): Promise<string> {
    const files: Record<string, { content: string }> = {};
    
    project.files.forEach(file => {
      files[file.name] = { content: file.content };
    });

    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        description: `${project.name} - Created with CodeWeaver AI`,
        public: true,
        files
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create gist');
    }

    const gist = await response.json();
    return gist.html_url;
  }
}

export const gitService = new GitService();
