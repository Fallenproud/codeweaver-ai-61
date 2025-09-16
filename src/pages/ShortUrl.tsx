import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@/components/ui/loading-overlay';

const ShortUrl = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortId) {
      navigate('/');
      return;
    }

    // Convert short ID back to full share ID
    // In a real implementation, this would involve a database lookup
    // For now, we'll check localStorage for matches
    const fullShareId = findFullShareId(shortId);
    
    if (fullShareId) {
      navigate(`/shared/${fullShareId}`);
    } else {
      navigate('/');
    }
  }, [shortId, navigate]);

  const findFullShareId = (shortId: string): string | null => {
    try {
      // Check all localStorage entries for share data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('share_')) {
          const fullShareId = key.replace('share_', '');
          // Check if the short ID matches the end of the full share ID
          if (fullShareId.endsWith(shortId)) {
            return fullShareId;
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding full share ID:', error);
      return null;
    }
  };

  return <LoadingOverlay isLoading={true} message="Redirecting..." />;
};

export default ShortUrl;