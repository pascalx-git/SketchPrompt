import { AIProvider, AIRequest, AIResponse } from './AIAdapter';
import { OpenAIAdapter } from './OpenAIAdapter';

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map();
  private defaultProvider: string = 'openai';

  constructor() {
    this.registerProvider('openai', new OpenAIAdapter());
  }

  registerProvider(name: string, provider: AIProvider): void {
    this.providers.set(name, provider);
  }

  getProvider(name?: string): AIProvider | undefined {
    const providerName = name || this.defaultProvider;
    return this.providers.get(providerName);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  getConfiguredProviders(): string[] {
    return Array.from(this.providers.entries())
      .filter(([_, provider]) => provider.isConfigured())
      .map(([name, _]) => name);
  }

  setDefaultProvider(name: string): void {
    if (this.providers.has(name)) {
      this.defaultProvider = name;
    } else {
      throw new Error(`Provider '${name}' not found`);
    }
  }

  async generateFromSketch(request: AIRequest, providerName?: string): Promise<AIResponse> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider '${providerName || this.defaultProvider}' not found`);
    }

    if (!provider.isConfigured()) {
      throw new Error(`Provider '${provider.name}' is not configured`);
    }

    return await provider.generateFromSketch(request);
  }

  async validateProvider(name: string): Promise<boolean> {
    const provider = this.getProvider(name);
    if (!provider) {
      return false;
    }

    try {
      return await provider.validateConfig();
    } catch (error) {
      return false;
    }
  }

  getProviderInfo(name: string): Partial<AIProvider> | undefined {
    const provider = this.getProvider(name);
    if (!provider) {
      return undefined;
    }

    return {
      name: provider.name,
      supportsVision: provider.supportsVision,
      maxImageSize: provider.maxImageSize,
    };
  }
}