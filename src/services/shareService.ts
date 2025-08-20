
import { Project } from '@/contexts/AppContext';

export interface ShareOptions {
  includePreview: boolean;
  allowForks: boolean;
  expiresIn?: '1h' | '24h' | '7d' | '30d' | 'never';
  password?: string;
}

export interface ShareLink {
  id: string;
  url: string;
  shortUrl: string;
  qrCode: string;
  expiresAt?: string;
  createdAt: string;
}

class ShareService {
  async createShareLink(project: Project, options: ShareOptions): Promise<ShareLink> {
    // Mock implementation - would connect to real sharing service
    const shareId = `share_${project.id}_${Date.now()}`;
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/shared/${shareId}`;
    const shortUrl = `https://cwai.link/${shareId.slice(-8)}`;
    
    // Generate QR code data URL (mock)
    const qrCode = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black">QR Code</text></svg>`)}`;
    
    let expiresAt: string | undefined;
    if (options.expiresIn && options.expiresIn !== 'never') {
      const expirationHours = {
        '1h': 1,
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      };
      
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + expirationHours[options.expiresIn]);
      expiresAt = expiry.toISOString();
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      id: shareId,
      url: fullUrl,
      shortUrl,
      qrCode,
      expiresAt,
      createdAt: new Date().toISOString()
    };
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  async generateEmbedCode(shareLink: ShareLink, options: { width?: string; height?: string } = {}): Promise<string> {
    const { width = '100%', height = '600px' } = options;
    
    return `<iframe 
  src="${shareLink.url}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  allowfullscreen>
</iframe>`;
  }
}

export const shareService = new ShareService();
