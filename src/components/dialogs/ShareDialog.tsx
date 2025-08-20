
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Copy, QrCode, Code, Loader2, Check } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { shareService, ShareOptions, ShareLink } from '@/services/shareService';
import { toast } from '@/components/ui/use-toast';

interface ShareDialogProps {
  children: React.ReactNode;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ children }) => {
  const { state } = useAppContext();
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [options, setOptions] = useState<ShareOptions>({
    includePreview: true,
    allowForks: true,
    expiresIn: 'never'
  });

  const handleCreateShareLink = async () => {
    if (!state.currentProject) return;

    setIsSharing(true);
    try {
      const link = await shareService.createShareLink(state.currentProject, options);
      setShareLink(link);
      toast({
        title: "Share Link Created",
        description: "Your project is now ready to share.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to create share link. Please try again.",
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
        title: "Copied",
        description: `${fieldName} copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const getEmbedCode = async () => {
    if (!shareLink) return '';
    return await shareService.generateEmbedCode(shareLink);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share Project</span>
          </DialogTitle>
        </DialogHeader>
        
        {!shareLink ? (
          <div className="space-y-4">
            <div className="space-y-3">
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
          <Tabs defaultValue="link" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="link">Link</TabsTrigger>
              <TabsTrigger value="embed">Embed</TabsTrigger>
              <TabsTrigger value="qr">QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-3">
              <div className="space-y-2">
                <Label>Share URL</Label>
                <div className="flex space-x-2">
                  <Input value={shareLink.url} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(shareLink.url, 'Share URL')}
                  >
                    {copiedField === 'Share URL' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Short URL</Label>
                <div className="flex space-x-2">
                  <Input value={shareLink.shortUrl} readOnly />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(shareLink.shortUrl, 'Short URL')}
                  >
                    {copiedField === 'Short URL' ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {shareLink.expiresAt && (
                <p className="text-sm text-muted">
                  Expires: {new Date(shareLink.expiresAt).toLocaleString()}
                </p>
              )}
            </TabsContent>

            <TabsContent value="embed" className="space-y-3">
              <div className="space-y-2">
                <Label>Embed Code</Label>
                <div className="space-y-2">
                  <textarea
                    className="w-full h-24 p-2 text-sm border rounded-md resize-none"
                    readOnly
                    value={`<iframe src="${shareLink.url}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleCopy(
                      `<iframe src="${shareLink.url}" width="100%" height="600px" frameborder="0" allowfullscreen></iframe>`,
                      'Embed Code'
                    )}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Copy Embed Code
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="qr" className="space-y-3">
              <div className="flex flex-col items-center space-y-3">
                <img src={shareLink.qrCode} alt="QR Code" className="w-48 h-48 border rounded-md" />
                <p className="text-sm text-muted text-center">
                  Scan this QR code to access the shared project
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};
