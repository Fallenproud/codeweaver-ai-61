
import { GenerationSettings } from '@/contexts/AppContext';

export interface GenerationRequest {
  prompt: string;
  settings: GenerationSettings;
  context?: string;
  templateId?: string;
}

export interface GenerationResponse {
  code: string;
  files: Array<{
    name: string;
    content: string;
    language: string;
  }>;
  explanation: string;
}

export interface StreamingCallback {
  onProgress: (progress: number) => void;
  onPartialCode: (code: string) => void;
  onComplete: (response: GenerationResponse) => void;
  onError: (error: string) => void;
}

class AIService {
  private baseUrl = '/api/ai';

  async generateCode(
    request: GenerationRequest,
    callbacks?: StreamingCallback
  ): Promise<GenerationResponse> {
    try {
      callbacks?.onProgress(10);
      
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      callbacks?.onProgress(50);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedCode = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                callbacks?.onProgress(data.progress);
              } else if (data.type === 'partial_code') {
                accumulatedCode += data.content;
                callbacks?.onPartialCode(accumulatedCode);
              } else if (data.type === 'complete') {
                callbacks?.onComplete(data.response);
                return data.response;
              }
            }
          }
        }
      }

      // Fallback for non-streaming response
      const result = await response.json();
      callbacks?.onComplete(result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';
      callbacks?.onError(errorMessage);
      throw error;
    }
  }

  async improveCode(
    code: string,
    improvements: string[],
    settings: GenerationSettings
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        improvements,
        settings,
      }),
    });

    if (!response.ok) {
      throw new Error(`Code improvement failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.improvedCode;
  }

  async explainCode(code: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`Code explanation failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.explanation;
  }
}

export const aiService = new AIService();
