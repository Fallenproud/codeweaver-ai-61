
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
  private readonly baseUrl = 'https://api.codeweaver.ai'; // Replace with actual API endpoint

  async createShareLink(project: Project, options: ShareOptions): Promise<ShareLink> {
    try {
      const response = await fetch(`${this.baseUrl}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            id: project.id,
            name: project.name,
            description: project.description,
            files: project.files
          },
          options
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Generate QR code using a real QR code service
      const qrCodeUrl = await this.generateQRCode(data.url);
      
      return {
        id: data.id,
        url: data.url,
        shortUrl: data.shortUrl,
        qrCode: qrCodeUrl,
        expiresAt: data.expiresAt,
        createdAt: data.createdAt
      };
    } catch (error) {
      // Fallback to local implementation if API is not available
      console.warn('Share API not available, using local implementation');
      return this.createLocalShareLink(project, options);
    }
  }

  private async createLocalShareLink(project: Project, options: ShareOptions): Promise<ShareLink> {
    const shareId = `share_${project.id}_${Date.now()}`;
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}/shared/${shareId}`;
    
    // Store project data locally
    const shareData = {
      project,
      options,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`share_${shareId}`, JSON.stringify(shareData));
    
    // Generate short URL
    const shortUrl = `${baseUrl}/s/${shareId.slice(-8)}`;
    
    // Generate QR code
    const qrCode = await this.generateQRCode(fullUrl);
    
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

    return {
      id: shareId,
      url: fullUrl,
      shortUrl,
      qrCode,
      expiresAt,
      createdAt: new Date().toISOString()
    };
  }

  private async generateQRCode(url: string): Promise<string> {
    try {
      // Use QR Server API for generating QR codes
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
      
      // Test if the QR service is available
      const response = await fetch(qrApiUrl, { method: 'HEAD' });
      
      if (response.ok) {
        return qrApiUrl;
      }
      
      throw new Error('QR service unavailable');
    } catch (error) {
      // Fallback: generate a simple SVG QR code placeholder
      const svgQR = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white" stroke="#e5e7eb" stroke-width="2"/>
        <rect x="20" y="20" width="20" height="20" fill="black"/>
        <rect x="60" y="20" width="20" height="20" fill="black"/>
        <rect x="100" y="20" width="20" height="20" fill="black"/>
        <rect x="140" y="20" width="20" height="20" fill="black"/>
        <rect x="20" y="60" width="20" height="20" fill="black"/>
        <rect x="140" y="60" width="20" height="20" fill="black"/>
        <rect x="20" y="100" width="20" height="20" fill="black"/>
        <rect x="60" y="100" width="20" height="20" fill="black"/>
        <rect x="100" y="100" width="20" height="20" fill="black"/>
        <rect x="140" y="100" width="20" height="20" fill="black"/>
        <rect x="60" y="140" width="20" height="20" fill="black"/>
        <rect x="100" y="140" width="20" height="20" fill="black"/>
        <text x="100" y="180" text-anchor="middle" font-size="12" fill="#6b7280">QR Code</text>
      </svg>`;
      
      return `data:image/svg+xml;base64,${btoa(svgQR)}`;
    }
  }

  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // Fallback for older browsers or when clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Could not copy text', err);
        throw new Error('Could not copy to clipboard');
      }
      
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
  allowfullscreen
  sandbox="allow-scripts allow-same-origin allow-forms"
  loading="lazy">
</iframe>`;
  }

  async getSharedProject(shareId: string): Promise<{ project: Project; options: ShareOptions } | null> {
    try {
      // Try to fetch from API first
      const response = await fetch(`${this.baseUrl}/share/${shareId}`);
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Could not fetch from API, trying local storage');
    }
    
    // Fallback to local storage
    const localData = localStorage.getItem(`share_${shareId}`);
    if (localData) {
      return JSON.parse(localData);
    }
    
    return null;
  }

  async deleteShareLink(shareId: string): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/share/${shareId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.warn('Could not delete from API, removing from local storage');
    }
    
    // Remove from local storage
    localStorage.removeItem(`share_${shareId}`);
  }
}

export const shareService = new ShareService();
