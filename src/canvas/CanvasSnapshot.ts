export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasMetadata {
  canvasSize: { width: number; height: number };
  selectedElements: string[];
  exportBounds?: Rectangle;
  timestamp: number;
}

export interface SnapshotOptions {
  format: 'png' | 'jpeg' | 'webp';
  quality?: number;
  backgroundColor?: string;
  padding?: number;
  scale?: number;
}

export class CanvasSnapshot {
  private defaultOptions: SnapshotOptions = {
    format: 'png',
    quality: 0.9,
    backgroundColor: 'transparent',
    padding: 10,
    scale: 1,
  };

  async exportSelection(bounds: Rectangle, options?: Partial<SnapshotOptions>): Promise<Uint8Array> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // This will be implemented when integrating with the TLDraw editor
    // For now, return a placeholder
    return new Uint8Array(0);
  }

  async exportFullCanvas(options?: Partial<SnapshotOptions>): Promise<Uint8Array> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // This will be implemented when integrating with the TLDraw editor
    // For now, return a placeholder
    return new Uint8Array(0);
  }

  async exportSelectedElements(elementIds: string[], options?: Partial<SnapshotOptions>): Promise<Uint8Array> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // This will be implemented when integrating with the TLDraw editor
    // For now, return a placeholder
    return new Uint8Array(0);
  }

  getCanvasMetadata(): CanvasMetadata {
    // This will be implemented when integrating with the TLDraw editor
    // For now, return placeholder metadata
    return {
      canvasSize: { width: 800, height: 600 },
      selectedElements: [],
      timestamp: Date.now(),
    };
  }

  calculateBounds(elementIds: string[]): Rectangle {
    // This will be implemented when integrating with the TLDraw editor
    // For now, return a default bounds
    return {
      x: 0,
      y: 0,
      width: 800,
      height: 600,
    };
  }

  async getSelectedBounds(): Promise<Rectangle | null> {
    // This will be implemented when integrating with the TLDraw editor
    // Return null if no selection
    return null;
  }

  async hasSelection(): Promise<boolean> {
    const bounds = await this.getSelectedBounds();
    return bounds !== null;
  }

  async getOptimalExportBounds(): Promise<Rectangle> {
    // Check if there's a selection first
    const selectionBounds = await this.getSelectedBounds();
    if (selectionBounds) {
      return selectionBounds;
    }

    // Otherwise, get the bounds of all content
    const metadata = this.getCanvasMetadata();
    return {
      x: 0,
      y: 0,
      width: metadata.canvasSize.width,
      height: metadata.canvasSize.height,
    };
  }

  private addPadding(bounds: Rectangle, padding: number): Rectangle {
    return {
      x: bounds.x - padding,
      y: bounds.y - padding,
      width: bounds.width + (padding * 2),
      height: bounds.height + (padding * 2),
    };
  }

  private scaleRectangle(bounds: Rectangle, scale: number): Rectangle {
    return {
      x: bounds.x * scale,
      y: bounds.y * scale,
      width: bounds.width * scale,
      height: bounds.height * scale,
    };
  }

  validateBounds(bounds: Rectangle): boolean {
    return bounds.width > 0 && bounds.height > 0;
  }

  async estimateImageSize(bounds: Rectangle, options?: Partial<SnapshotOptions>): Promise<number> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const area = bounds.width * bounds.height * Math.pow(mergedOptions.scale || 1, 2);
    
    // Rough estimate based on format
    switch (mergedOptions.format) {
      case 'png':
        return Math.floor(area * 4); // RGBA
      case 'jpeg':
        return Math.floor(area * 0.5); // Compressed
      case 'webp':
        return Math.floor(area * 0.3); // Highly compressed
      default:
        return Math.floor(area * 2);
    }
  }
}