import { BaseAIAdapter, AIRequest, AIResponse } from './AIAdapter';

export class OpenAIAdapter extends BaseAIAdapter {
  readonly name = 'OpenAI GPT-4 Vision';
  readonly supportsVision = true;
  readonly maxImageSize = 20 * 1024 * 1024; // 20MB

  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly defaultModel = 'gpt-4o';

  async generateFromSketch(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured. Please set your API key in settings.');
    }

    if (!this.validateImageSize(request.image)) {
      throw new Error(`Image size exceeds maximum allowed size (${this.maxImageSize / (1024 * 1024)}MB)`);
    }

    const config = this.getConfiguration();
    const prompt = this.formatPrompt(request.prompt, request.context);
    
    try {
      const response = await this.makeAPICall(prompt, request.image, config);
      const processingTime = Date.now() - startTime;
      
      return {
        content: response.choices[0].message.content,
        type: this.inferResponseType(response.choices[0].message.content),
        metadata: {
          model: response.model,
          tokensUsed: response.usage?.total_tokens,
          processingTime,
        }
      };
    } catch (error) {
      throw new Error(`OpenAI API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  isConfigured(): boolean {
    // This will be implemented when we integrate with the extension
    return true; // Placeholder
  }

  async validateConfig(): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      // Simple validation for now
      return true;
    } catch (error) {
      return false;
    }
  }

  private getConfiguration() {
    // This will be implemented when we integrate with the extension
    return {
      apiKey: '', // Will be populated from VS Code settings
      model: this.defaultModel,
      maxTokens: 4000,
      temperature: 0.7,
    };
  }

  private async makeAPICall(prompt: string, imageBuffer: Uint8Array, config: any): Promise<any> {
    const base64Image = this.bufferToBase64(imageBuffer);
    
    const body = {
      model: config.model,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    };

    // Using a simple HTTP request implementation that will be replaced with proper Node.js implementation
    const response = await this.httpRequest(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify(body)
    });

    return response;
  }

  private async httpRequest(url: string, options: any): Promise<any> {
    // This is a placeholder implementation
    // In the actual implementation, this would use Node.js http/https modules
    throw new Error('HTTP request not implemented - this will be completed in the integration phase');
  }

  private bufferToBase64(buffer: Uint8Array): string {
    // Convert Uint8Array to base64 string
    const chunks = [];
    for (let i = 0; i < buffer.length; i += 1024) {
      chunks.push(String.fromCharCode(...buffer.slice(i, i + 1024)));
    }
    const binaryString = chunks.join('');
    
    // Simple base64 encoding
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    let i = 0;
    
    while (i < binaryString.length) {
      const a = binaryString.charCodeAt(i++);
      const b = i < binaryString.length ? binaryString.charCodeAt(i++) : 0;
      const c = i < binaryString.length ? binaryString.charCodeAt(i++) : 0;
      
      const combined = (a << 16) | (b << 8) | c;
      
      result += chars.charAt((combined >> 18) & 63);
      result += chars.charAt((combined >> 12) & 63);
      result += chars.charAt((combined >> 6) & 63);
      result += chars.charAt(combined & 63);
    }
    
    // Add padding
    const padding = binaryString.length % 3;
    if (padding > 0) {
      result = result.slice(0, -padding) + '='.repeat(padding);
    }
    
    return result;
  }

  private inferResponseType(content: string): 'code' | 'text' | 'annotation' {
    // Simple heuristic to determine response type
    if (content.includes('```') || content.includes('function') || content.includes('class')) {
      return 'code';
    }
    if (content.includes('analysis:') || content.includes('recommendation:')) {
      return 'annotation';
    }
    return 'text';
  }
}