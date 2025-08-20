
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Copy, QrCode, Code, Loader2, Check, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { shareService, ShareOptions, ShareLink } from '@/services/shareService';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ShareDialogProps {
  children: React.ReactNode;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ children }) => {
  const { state } = useAppContext();
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [embedCode, setEmbedCode] = useState('');
  const [embedWidth, setEmbedWidth] = useState('100%');
  const [embedHeight, setEmbedHeight] = useState('600px');
  const [options, setOptions] = useState<ShareOptions>({
    includePreview: true,
    allowForks: true,
    expiresIn: 'never'
  });

  const handleCreateShareLink = async () => {
    if (!state.currentProject) {
      toast({
        title: "No Project",
        description: "Please select a project to share.",
        variant: "destructive"
      });
      return;
    }

    setIsSharing(true);
    try {
      const link = await shareService.createShareLink(state.currentProject, options);
      setShareLink(link);
      
      // Generate initial embed code
      const code = await shareService.generateEmbedCode(link, {
        width: embedWidth,
        height: embedHeight
      });
      setEmbedCode(code);
      
      toast({
        title: "Share Link Created",
        description: "Your project is now ready to share!",
      });
    } catch (error) {
      console.error('Share creation error:', error);
      toast({
        title: "Share Failed",
        description: error instanceof Error ? error.message : "Failed to create share link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async (text: string, fieldName: string) => {
    try {
      await shareService.copyToClipboard(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard.`,
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try selecting and copying manually.",
        variant: "destructive"
      });
    }
  };

  const handleEmbedOptionsChange = async () => {
    if (!shareLink) return;
    
    try {
      const code = await shareService.generateEmbedCode(shareLink, {
        width: embedWidth,
        height: embedHeight
      });
      setEmbedCode(code);
    } catch (error) {
      console.error('Embed code generation error:', error);
    }
  };

  const handleDeleteShare = async () => {
    if (!shareLink) return;
    
    try {
      await shareService.deleteShareLink(shareLink.id);
      setShareLink(null);
      setEmbedCode('');
      toast({
        title: "Share Deleted",
        description: "Share link has been deleted successfully.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete share link.",
        variant: "destructive"
      });
    }
  };

  const isExpired = shareLink?.expiresAt ? new Date(shareLink.expiresAt) < new Date() : false;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Project</span>
          </DialogTitle>
        </DialogHeader>
        
        {!shareLink ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Share Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="preview">Include live preview</Label>
                  <Switch
                    id="preview"
                    checked={options.includePreview}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, includePreview: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="forks">Allow forks</Label>
                  <Switch
                    id="forks"
                    checked={options.allowForks}
                    onCheckedChange={(checked) => setOptions(prev => ({ ...prev, allowForks: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expires">Expires in</Label>
                  <Select 
                    value={options.expiresIn} 
                    onValueChange={(value: any) => setOptions(prev => ({ ...prev, expiresIn: value }))}
                  >
                    <SelectTrigger id="expires">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                      <SelectItem value="7d">7 days</SelectItem>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Leave empty for public access"
                    value={options.password || ''}
                    onChange={(e) => setOptions(prev => ({ ...prev, password: e.target.value || undefined }))}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreateShareLink} 
              disabled={isSharing || !state.currentProject}
              className="w-full"
            >
              {isSharing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              Create Share Link
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {isExpired && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This share link has expired and is no longer accessible.
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Links</TabsTrigger>
                <TabsTrigger value="embed">Embed</TabsTrigger>
                <TabsTrigger value="qr">QR Code</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Share URL</Label>
                    <div className="flex space-x-2">
                      <Input value={shareLink.url} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(shareLink.url, 'Share URL')}
                        className="shrink-0"
                      >
                        {copiedField === 'Share URL' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(shareLink.url, '_blank')}
                        className="shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Short URL</Label>
                    <div className="flex space-x-2">
                      <Input value={shareLink.shortUrl} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(shareLink.shortUrl, 'Short URL')}
                        className="shrink-0"
                      >
                        {copiedField === 'Short URL' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(shareLink.shortUrl, '_blank')}
                        className="shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Created: {new Date(shareLink.createdAt).toLocaleString()}</p>
                    {shareLink.expiresAt && (
                      <p className={isExpired ? "text-destructive" : ""}>
                        Expires: {new Date(shareLink.expiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="embed" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="embed-width">Width</Label>
                      <Input
                        id="embed-width"
                        value={embedWidth}
                        onChange={(e) => setEmbedWidth(e.target.value)}
                        onBlur={handleEmbedOptionsChange}
                        placeholder="100%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="embed-height">Height</Label>
                      <Input
                        id="embed-height"
                        value={embedHeight}
                        onChange={(e) => setEmbedHeight(e.target.value)}
                        onBlur={handleEmbedOptionsChange}
                        placeholder="600px"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Embed Code</Label>
                    <div className="space-y-3">
                      <textarea
                        className="w-full h-32 p-3 text-sm font-mono border rounded-md resize-none bg-muted"
                        readOnly
                        value={embedCode}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleCopy(embedCode, 'Embed Code')}
                      >
                        {copiedField === 'Embed Code' ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Code className="w-4 h-4 mr-2" />
                        )}
                        {copiedField === 'Embed Code' ? 'Copied!' : 'Copy Embed Code'}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr" className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <img 
                      src={shareLink.qrCode} 
                      alt="QR Code for shared project" 
                      className="w-48 h-48 object-contain"
                      onError={(e) => {
                        console.error('QR code failed to load');
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    Scan this QR code with your mobile device to quickly access the shared project
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy(shareLink.url, 'QR Code URL')}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShareLink(null);
                  setEmbedCode('');
                }}
              >
                Create New
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteShare}
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Share
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
