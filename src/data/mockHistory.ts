
import { HistoryItem } from '@/components/history/GenerationHistoryItem';

export const mockHistory: HistoryItem[] = [
  {
    id: 'hist-1',
    name: 'Landing Page v3',
    timestamp: '2024-01-20T14:30:00Z',
    model: 'GPT-4',
    preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
    size: '2.3 MB',
    prompt: 'Create a modern landing page for a SaaS product with hero section, features, and pricing',
    files: [
      {
        name: 'index.html',
        content: '<!DOCTYPE html><html><head><title>SaaS Landing</title></head><body><h1>Welcome to our SaaS</h1></body></html>',
        language: 'html'
      },
      {
        name: 'styles.css',
        content: 'body { font-family: Arial, sans-serif; margin: 0; padding: 0; }',
        language: 'css'
      }
    ]
  },
  {
    id: 'hist-2',
    name: 'Portfolio Website',
    timestamp: '2024-01-20T12:15:00Z',
    model: 'Claude-3',
    preview: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&h=200&fit=crop',
    size: '1.8 MB',
    prompt: 'Build a creative portfolio website with smooth animations and project showcase',
    files: [
      {
        name: 'index.html',
        content: '<!DOCTYPE html><html><head><title>Portfolio</title></head><body><h1>My Portfolio</h1></body></html>',
        language: 'html'
      },
      {
        name: 'styles.css',
        content: 'body { background: #000; color: #fff; }',
        language: 'css'
      }
    ]
  },
  {
    id: 'hist-3',
    name: 'E-commerce Demo',
    timestamp: '2024-01-19T16:45:00Z',
    model: 'GPT-4',
    preview: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
    size: '3.1 MB',
    prompt: 'Create an e-commerce store with product catalog, shopping cart, and checkout',
    files: [
      {
        name: 'index.html',
        content: '<!DOCTYPE html><html><head><title>Store</title></head><body><h1>Online Store</h1></body></html>',
        language: 'html'
      },
      {
        name: 'styles.css',
        content: 'body { font-family: system-ui; }',
        language: 'css'
      }
    ]
  },
  {
    id: 'hist-4',
    name: 'Blog Template',
    timestamp: '2024-01-19T09:20:00Z',
    model: 'Claude-3',
    preview: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6b87d?w=300&h=200&fit=crop',
    size: '1.5 MB',
    prompt: 'Design a modern blog template with article listing and reading experience',
    files: [
      {
        name: 'index.html',
        content: '<!DOCTYPE html><html><head><title>Blog</title></head><body><h1>My Blog</h1></body></html>',
        language: 'html'
      },
      {
        name: 'styles.css',
        content: 'body { max-width: 800px; margin: 0 auto; }',
        language: 'css'
      }
    ]
  }
];
