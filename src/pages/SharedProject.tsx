import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shareService } from '@/services/shareService';
import { Project } from '@/contexts/AppContext';
import { SharedProjectLayout } from '@/components/shared/SharedProjectLayout';
import { PasswordProtectionDialog } from '@/components/shared/PasswordProtectionDialog';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const SharedProject = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [shareOptions, setShareOptions] = useState<any>(null);

  useEffect(() => {
    if (!shareId) {
      navigate('/');
      return;
    }

    loadSharedProject();
  }, [shareId, navigate]);

  const loadSharedProject = async () => {
    try {
      setLoading(true);
      setError(null);

      const sharedData = await shareService.getSharedProject(shareId!);
      
      if (!sharedData) {
        setError('Shared project not found or has expired');
        return;
      }

      // Check if password is required
      if (sharedData.options.password && !sessionStorage.getItem(`share_auth_${shareId}`)) {
        setRequiresPassword(true);
        setShareOptions(sharedData.options);
        return;
      }

      // Check if share has expired
      if (sharedData.options.expiresIn && sharedData.options.expiresIn !== 'never') {
        const createdAt = new Date(); // Fallback to current date if no createdAt
        const expirationHours = {
          '1h': 1,
          '24h': 24,
          '7d': 24 * 7,
          '30d': 24 * 30
        };
        
        const expiryTime = new Date(createdAt.getTime() + (expirationHours[sharedData.options.expiresIn as keyof typeof expirationHours] * 60 * 60 * 1000));
        
        if (new Date() > expiryTime) {
          setError('This shared project has expired');
          return;
        }
      }

      setProject(sharedData.project);
      setShareOptions(sharedData.options);
    } catch (err) {
      console.error('Error loading shared project:', err);
      setError('Failed to load shared project');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (shareOptions?.password === password) {
      sessionStorage.setItem(`share_auth_${shareId}`, 'authenticated');
      setRequiresPassword(false);
      await loadSharedProject();
      return true;
    }
    return false;
  };

  if (loading) {
    return <LoadingOverlay isLoading={true} message="Loading shared project..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <PasswordProtectionDialog
        onSubmit={handlePasswordSubmit}
        onCancel={() => navigate('/')}
      />
    );
  }

  if (!project) {
    return null;
  }

  return (
    <SharedProjectLayout 
      project={project} 
      shareOptions={shareOptions}
      allowForks={shareOptions?.allowForks || false}
    />
  );
};

export default SharedProject;