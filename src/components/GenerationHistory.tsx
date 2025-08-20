
import React, { useState } from 'react';
import { Calendar, Clock, Eye, Download, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockHistory = [
  {
    id: '1',
    name: 'Landing Page v3',
    timestamp: '2024-01-20 14:30',
    model: 'GPT-4',
    preview: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Landing+Page',
    size: '2.3 MB'
  },
  {
    id: '2',
    name: 'Portfolio Website',
    timestamp: '2024-01-20 12:15',
    model: 'Claude-3',
    preview: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Portfolio',
    size: '1.8 MB'
  },
  {
    id: '3',
    name: 'E-commerce Demo',
    timestamp: '2024-01-19 16:45',
    model: 'GPT-4',
    preview: 'https://via.placeholder.com/300x200/48bb78/ffffff?text=E-commerce',
    size: '3.1 MB'
  },
  {
    id: '4',
    name: 'Blog Template',
    timestamp: '2024-01-19 09:20',
    model: 'Claude-3',
    preview: 'https://via.placeholder.com/300x200/ed8936/ffffff?text=Blog',
    size: '1.5 MB'
  },
];

export const GenerationHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = mockHistory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full bg-background p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Generation History</h2>
        <p className="text-muted">Browse and restore your previous AI-generated websites</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
          <Input
            placeholder="Search your projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistory.map((item) => (
          <div key={item.id} className="glass-card rounded-xl p-4 animate-slide-up hover:scale-105 transition-transform duration-200">
            <div className="aspect-video bg-surface rounded-lg mb-3 overflow-hidden">
              <img 
                src={item.preview} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              
              <div className="flex items-center space-x-2 text-sm text-muted">
                <Calendar className="w-3 h-3" />
                <span>{item.timestamp}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {item.model}
                </Badge>
                <span className="text-xs text-muted">{item.size}</span>
              </div>
              
              <div className="flex space-x-1 pt-2">
                <Button variant="ghost" size="sm" className="text-accent-cyan hover:text-accent-cyan hover:bg-accent-cyan/10">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-accent-green hover:text-accent-green hover:bg-accent-green/10">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-accent-error hover:text-accent-error hover:bg-accent-error/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No projects found</h3>
          <p className="text-muted">Try adjusting your search or create your first AI-generated website</p>
        </div>
      )}
    </div>
  );
};
