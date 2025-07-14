import * as vscode from 'vscode';
import * as https from 'https';
import { UMAMI_CONFIG } from './umamiConfig';

// Umami Analytics Configuration
interface UmamiConfig {
  websiteId: string;
  enabled: boolean;
  debugMode: boolean;
}

// Event tracking interface for script-based tracking
interface UmamiEvent {
  name: string;
  data?: Record<string, any>;
}

export class UmamiAnalytics {
  private static instance: UmamiAnalytics;
  private config: UmamiConfig;
  private extensionVersion: string;

  private constructor() {
    this.extensionVersion = vscode.extensions.getExtension('PascalX.sketchprompt')?.packageJSON.version || 'unknown';
    
    // Initialize with config from umamiConfig.ts
    this.config = {
      websiteId: UMAMI_CONFIG.WEBSITE_ID,
      enabled: UMAMI_CONFIG.ENABLED,
      debugMode: UMAMI_CONFIG.DEBUG_MODE
    };
  }

  public static getInstance(): UmamiAnalytics {
    if (!UmamiAnalytics.instance) {
      UmamiAnalytics.instance = new UmamiAnalytics();
    }
    return UmamiAnalytics.instance;
  }

  /**
   * Configure Umami analytics with your credentials
   */
  public configure(websiteId: string, enabled: boolean = true, debugMode: boolean = false): void {
    this.config = {
      websiteId,
      enabled,
      debugMode
    };
  }

  /**
   * Track a custom event using the tracking script
   */
  public async trackEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    try {
      // For VS Code extensions, we'll use a simple HTTP request to simulate the tracking script
      // This is the closest we can get to the tracking script functionality in a VS Code extension
      const event: UmamiEvent = {
        name: eventName,
        data: {
          extensionVersion: this.extensionVersion,
          ...properties
        }
      };

      // Send to Umami using Node.js https module
      const postData = JSON.stringify({
        payload: {
          hostname: 'extension.vscode',
          language: 'en-US',
          referrer: '',
          screen: '1920x1080',
          title: 'SketchPrompt Extension',
          url: '/extension-event',
          website: this.config.websiteId,
          name: eventName,
          data: event.data
        },
        type: 'event'
      });

      const options = {
        hostname: 'cloud.umami.is',
        port: 443,
        path: '/api/send',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': `SketchPrompt-Extension/${this.extensionVersion}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      return new Promise<void>((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              if (this.config.debugMode) {
                console.log(`[SketchPrompt] Successfully tracked event: ${eventName}`, properties);
              }
              resolve();
            } else {
              console.warn(`[SketchPrompt] Umami tracking failed: ${res.statusCode} ${res.statusMessage}`);
              resolve(); // Don't reject to avoid disrupting user experience
            }
          });
        });

        req.on('error', (error) => {
          console.warn('[SketchPrompt] Umami tracking error:', error);
          resolve(); // Don't reject to avoid disrupting user experience
        });

        req.write(postData);
        req.end();
      });
    } catch (error) {
      // Silently fail to avoid disrupting user experience
      console.warn('[SketchPrompt] Umami tracking error:', error);
    }
  }

  /**
   * Track extension activation
   */
  public async trackActivation(): Promise<void> {
    await this.trackEvent('extension_activated');
  }

  /**
   * Track new sketch creation
   */
  public async trackNewSketch(): Promise<void> {
    await this.trackEvent('sketch_created');
  }

  /**
   * Track sketch save
   */
  public async trackSketchSaved(): Promise<void> {
    await this.trackEvent('sketch_saved');
  }

  /**
   * Track copy to clipboard action
   */
  public async trackCopyToClipboard(): Promise<void> {
    await this.trackEvent('copy_to_clipboard');
  }

  /**
   * Track help command usage
   */
  public async trackHelpViewed(): Promise<void> {
    await this.trackEvent('help_viewed');
  }

  /**
   * Track sketch file opened
   */
  public async trackSketchOpened(): Promise<void> {
    await this.trackEvent('sketch_opened');
  }

  /**
   * Track extension deactivation
   */
  public async trackDeactivation(): Promise<void> {
    await this.trackEvent('extension_deactivated');
  }

  /**
   * Track sketch file error
   */
  public async trackSketchError(errorType: string): Promise<void> {
    await this.trackEvent('sketch_error', { errorType });
  }

  /**
   * Track sketch export action
   */
  public async trackSketchExport(format: string): Promise<void> {
    await this.trackEvent('sketch_export', { format });
  }
}

// Convenience function for quick event tracking
export async function trackEvent(eventName: string, properties: Record<string, any> = {}): Promise<void> {
  await UmamiAnalytics.getInstance().trackEvent(eventName, properties);
} 