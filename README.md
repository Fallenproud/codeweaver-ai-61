
# CodeWeaver AI - AI-Powered Web Development Platform

CodeWeaver AI is a comprehensive web development platform that combines the power of AI with professional development tools to create, edit, and deploy web applications in real-time.

## 🚀 Features

### Core Development Environment
- **Advanced Monaco Code Editor** - VS Code-powered editor with syntax highlighting, auto-completion, and IntelliSense
- **Real-Time Preview** - Live preview with device simulation (mobile, tablet, desktop)
- **Multi-File Project Management** - Create, edit, and organize project files with ease
- **Export & Download** - Export projects as ZIP files or integrate with version control

### AI-Powered Generation
- **Intelligent Code Generation** - Generate HTML, CSS, JavaScript, and React components using AI
- **Real-Time Streaming** - Watch as AI generates code in real-time with progress tracking
- **Context-Aware Suggestions** - AI understands your project context for better code generation
- **Multiple AI Models** - Support for various AI providers and models

### Advanced Preview System
- **Device Simulation** - Test your applications across different screen sizes
- **Screenshot Capture** - Take screenshots of your applications for documentation
- **Responsive Testing** - Built-in breakpoint testing tools
- **External Link Preview** - Open generated applications in new tabs

### Template System
- **Pre-built Templates** - Access to a library of professional templates
- **Template Customization** - Modify templates to fit your specific needs
- **Preview Before Use** - See template previews before applying them to your project
- **Community Templates** - Share and discover templates from the community

## 🛠 Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Code Editor**: Monaco Editor (VS Code engine)
- **State Management**: React Context API with React Query
- **Icons**: Lucide React
- **File Operations**: JSZip for project export
- **Screenshot**: html2canvas for preview capture

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── advanced/               # Advanced feature components
│   │   ├── MonacoEditor.tsx    # Code editor component
│   │   ├── EnhancedPreview.tsx # Live preview component
│   │   ├── AIGenerationPanel.tsx # AI generation interface
│   │   └── FileExplorer.tsx    # File management component
│   ├── Dashboard.tsx           # Main application dashboard
│   ├── Header.tsx              # Application header
│   └── Sidebar.tsx             # Navigation sidebar
├── contexts/
│   └── AppContext.tsx          # Global application state
├── services/
│   └── aiService.ts            # AI integration service
├── hooks/                      # Custom React hooks
├── lib/
│   └── utils.ts                # Utility functions
└── pages/                      # Application pages
```

## 🎨 Design System

The application uses a carefully crafted design system with:
- **Semantic Color Tokens** - HSL-based color system for consistent theming
- **Responsive Grid System** - Mobile-first responsive design
- **Animation System** - Smooth transitions and micro-interactions
- **Typography Scale** - Consistent text sizing and spacing
- **Component Variants** - Flexible component styling options

## 🔧 Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd codeweaver-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Components

### Dashboard
The main application interface that orchestrates all components and manages the overall user experience.

### Monaco Editor
Professional code editor with:
- Syntax highlighting for multiple languages
- Auto-completion and IntelliSense
- Find/replace functionality
- Code formatting
- Error detection

### Enhanced Preview
Real-time preview system featuring:
- Live updates as you type
- Device simulation frames
- Screenshot capabilities
- Responsive breakpoint testing

### AI Generation Panel
Intelligent code generation with:
- Real-time streaming responses
- Generation progress tracking
- Context-aware suggestions
- Multiple AI model support

### File Explorer
Comprehensive file management:
- Create, edit, and delete files
- Project organization
- File type detection
- Export capabilities

## 🚀 Deployment

The application can be deployed to various platforms:
- **Vercel** - Recommended for React applications
- **Netlify** - Great for static sites with CI/CD
- **AWS S3 + CloudFront** - Scalable cloud deployment
- **GitHub Pages** - Free hosting for open source projects

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the code editor
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for fast build tooling
