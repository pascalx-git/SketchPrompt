import { Editor } from 'tldraw';

export interface SketchMetadata {
  shapeCount: number;
  shapeTypes: Record<string, number>;
  textContent: string[];
  lastModified: Date;
  fileName: string;
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface PreviewData {
  imageBlob: Blob;
  imageUrl: string;
  metadata: SketchMetadata;
}

export class SketchExportService {
  private static instance: SketchExportService;
  private previewCache: Map<string, PreviewData> = new Map();

  static getInstance(): SketchExportService {
    if (!SketchExportService.instance) {
      SketchExportService.instance = new SketchExportService();
    }
    return SketchExportService.instance;
  }

  async generatePreview(editor: Editor): Promise<PreviewData> {
    try {
      // Get current page shapes
      const shapes = editor.getCurrentPageShapes();
      
      // Generate image blob using TLDraw's export API
      const blob = await editor.exportAs('png', shapes, {
        format: 'png',
        padding: 32,
        scale: 2,
        background: true
      });

      // Create object URL for the blob
      const imageUrl = URL.createObjectURL(blob);

      // Generate metadata
      const metadata = this.generateMetadata(editor, shapes);

      const previewData: PreviewData = {
        imageBlob: blob,
        imageUrl,
        metadata
      };

      return previewData;
    } catch (error) {
      console.error('Failed to generate preview:', error);
      throw new Error('Preview generation failed');
    }
  }

  private generateMetadata(editor: Editor, shapes: any[]): SketchMetadata {
    const shapeTypes: Record<string, number> = {};
    const textContent: string[] = [];

    // Analyze shapes
    shapes.forEach(shape => {
      const type = shape.type;
      shapeTypes[type] = (shapeTypes[type] || 0) + 1;

      // Extract text content
      if (shape.props?.text) {
        textContent.push(shape.props.text);
      }
    });

    // Determine complexity based on shape count and types
    const totalShapes = shapes.length;
    const uniqueShapeTypes = Object.keys(shapeTypes).length;
    
    let complexity: 'simple' | 'moderate' | 'complex';
    if (totalShapes <= 5 && uniqueShapeTypes <= 2) {
      complexity = 'simple';
    } else if (totalShapes <= 15 && uniqueShapeTypes <= 4) {
      complexity = 'moderate';
    } else {
      complexity = 'complex';
    }

    return {
      shapeCount: totalShapes,
      shapeTypes,
      textContent,
      lastModified: new Date(),
      fileName: 'sketch', // Will be updated by the extension
      complexity
    };
  }

  generateMarkdownReference(imagePath: string, metadata: SketchMetadata): string {
    const timestamp = metadata.lastModified.toLocaleTimeString();
    const shapeSummary = Object.entries(metadata.shapeTypes)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');

    return `## Sketch: ${metadata.fileName}
![Sketch Preview](${imagePath})

*Auto-generated preview of sketch containing ${metadata.shapeCount} shapes (${shapeSummary}), complexity: ${metadata.complexity}, last updated ${timestamp}*

**Text Content**: ${metadata.textContent.length > 0 ? metadata.textContent.join(', ') : 'No text content'}`;
  }

  cleanupCache(): void {
    // Clean up old object URLs to prevent memory leaks
    this.previewCache.forEach((data) => {
      if (data.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(data.imageUrl);
      }
    });
    this.previewCache.clear();
  }
} 