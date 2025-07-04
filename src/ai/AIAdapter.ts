export interface AIRequest {
  image: Uint8Array;
  prompt: string;
  context?: SketchContext;
  options?: AIOptions;
}

export interface AIResponse {
  content: string;
  type: 'code' | 'text' | 'annotation';
  metadata?: ResponseMetadata;
}

export interface SketchContext {
  canvasSize: { width: number; height: number };
  selectedElements?: string[];
  projectType?: string;
  additionalContext?: string;
}

export interface AIOptions {
  maxTokens?: number;
  temperature?: number;
  language?: string;
  responseFormat?: 'code' | 'analysis' | 'explanation';
}

export interface ResponseMetadata {
  model: string;
  tokensUsed?: number;
  processingTime?: number;
  confidence?: number;
}

export interface AIProvider {
  readonly name: string;
  readonly supportsVision: boolean;
  readonly maxImageSize: number;
  
  generateFromSketch(request: AIRequest): Promise<AIResponse>;
  isConfigured(): boolean;
  validateConfig(): Promise<boolean>;
}

export abstract class BaseAIAdapter implements AIProvider {
  abstract readonly name: string;
  abstract readonly supportsVision: boolean;
  abstract readonly maxImageSize: number;
  
  abstract generateFromSketch(request: AIRequest): Promise<AIResponse>;
  abstract isConfigured(): boolean;
  abstract validateConfig(): Promise<boolean>;
  
  protected formatPrompt(userPrompt: string, context?: SketchContext): string {
    let fullPrompt = userPrompt;
    
    if (context) {
      fullPrompt += `\n\nContext:`;
      if (context.canvasSize) {
        fullPrompt += `\n- Canvas size: ${context.canvasSize.width}x${context.canvasSize.height}`;
      }
      if (context.projectType) {
        fullPrompt += `\n- Project type: ${context.projectType}`;
      }
      if (context.additionalContext) {
        fullPrompt += `\n- Additional context: ${context.additionalContext}`;
      }
    }
    
    return fullPrompt;
  }
  
  protected validateImageSize(imageBuffer: Uint8Array): boolean {
    return imageBuffer.length <= this.maxImageSize;
  }
}