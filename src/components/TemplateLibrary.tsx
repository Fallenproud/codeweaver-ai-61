
import React, { useState } from 'react';
import { Search, Filter, Star, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = ['All', 'Business', 'Portfolio', 'E-commerce', 'Blog', 'Landing Page'];

const mockTemplates = [
  {
    id: '1',
    name: 'Modern Business',
    category: 'Business',
    description: 'Professional business website with clean design and modern aesthetics',
    preview: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Modern+Business',
    downloads: 1247,
    rating: 4.8,
    tags: ['Responsive', 'Modern', 'Professional']
  },
  {
    id: '2',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work with this stunning creative portfolio template',
    preview: 'https://via.placeholder.com/400x300/764ba2/ffffff?text=Creative+Portfolio',
    downloads: 892,
    rating: 4.9,
    tags: ['Creative', 'Portfolio', 'Animated']
  },
  {
    id: '3',
    name: 'E-commerce Store',
    category: 'E-commerce',
    description: 'Complete e-commerce solution with product catalog and shopping cart',
    preview: 'https://via.placeholder.com/400x300/48bb78/ffffff?text=E-commerce',
    downloads: 2156,
    rating: 4.7,
    tags: ['E-commerce', 'Shopping', 'Mobile-first']
  },
  {
    id: '4',
    name: 'Tech Blog',
    category: 'Blog',
    description: 'Modern blog template perfect for tech and development content',
    preview: 'https://via.placeholder.com/400x300/ed8936/ffffff?text=Tech+Blog',
    downloads: 654,
    rating: 4.6,
    tags: ['Blog', 'Tech', 'Minimal']
  },
  {
    id: '5',
    name: 'Product Launch',
    category: 'Landing Page',
    description: 'High-converting landing page for product launches and marketing',
    preview: 'https://via.placeholder.com/400x300/9f7aea/ffffff?text=Product+Launch',
    downloads: 1543,
    rating: 4.9,
    tags: ['Landing', 'Marketing', 'Conversion']
  },
  {
    id: '6',
    name: 'Agency Showcase',
    category: 'Business',
    description: 'Digital agency website with team profiles and service showcase',
    preview: 'https://via.placeholder.com/400x300/38b2ac/ffffff?text=Agency',
    downloads: 987,
    rating: 4.5,
    tags: ['Agency', 'Team', 'Services']
  },
];

export const TemplateLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full bg-background p-6 overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">Template Library</h2>
        <p className="text-muted">Choose from our collection of professionally designed templates</p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 
                "bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30" : 
                "text-muted hover:text-foreground"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="glass-card rounded-xl overflow-hidden animate-slide-up hover:scale-105 transition-transform duration-200">
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted">{template.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted">
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-current text-accent-warning" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-3 h-3" />
                  <span>{template.downloads.toLocaleString()}</span>
                </div>
              </div>
              
              <Button className="w-full gradient-accent text-white hover:opacity-90">
                Use Template
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No templates found</h3>
          <p className="text-muted">Try adjusting your search or category filter</p>
        </div>
      )}
    </div>
  );
};
