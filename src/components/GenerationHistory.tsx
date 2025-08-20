
import React, { useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { GenerationHistoryItem } from '@/components/history/GenerationHistoryItem';
import { mockHistory } from '@/data/mockHistory';

export const GenerationHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState(mockHistory);

  const filteredHistory = history.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleRestore = (item: any) => {
    console.log('Restoring item:', item.name);
  };

  return (
    <div className="h-full bg-background p-6 overflow-auto">
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
          <GenerationHistoryItem
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
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
