export interface ParsedResponse {
  content: string;
  codeBlocks: CodeBlock[];
  metadata: ResponseMetadata;
  summary?: string;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
  description?: string;
  startLine?: number;
  endLine?: number;
}

export interface ResponseMetadata {
  type: 'code' | 'text' | 'annotation' | 'mixed';
  confidence: number;
  hasCode: boolean;
  hasImages: boolean;
  wordCount: number;
  processingTime?: number;
}

export class ResponseParser {
  private codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  private inlineCodeRegex = /`([^`]+)`/g;
  private filenameRegex = /(?:\/\/|#|<!--)\s*([^\s]+\.(js|ts|jsx|tsx|py|html|css|sql|json|md))/i;

  parse(content: string): ParsedResponse {
    const startTime = Date.now();
    
    const codeBlocks = this.extractCodeBlocks(content);
    const metadata = this.analyzeContent(content, codeBlocks);
    const summary = this.generateSummary(content, codeBlocks);
    
    metadata.processingTime = Date.now() - startTime;
    
    return {
      content,
      codeBlocks,
      metadata,
      summary,
    };
  }

  private extractCodeBlocks(content: string): CodeBlock[] {
    const blocks: CodeBlock[] = [];
    let match;
    
    while ((match = this.codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2].trim();
      
      if (code.length > 0) {
        const block: CodeBlock = {
          language,
          code,
          startLine: this.getLineNumber(content, match.index),
          endLine: this.getLineNumber(content, match.index + match[0].length),
        };

        // Try to extract filename from comments
        const filenameMatch = this.filenameRegex.exec(code);
        if (filenameMatch) {
          block.filename = filenameMatch[1];
        }

        blocks.push(block);
      }
    }

    return blocks;
  }

  private analyzeContent(content: string, codeBlocks: CodeBlock[]): ResponseMetadata {
    const hasCode = codeBlocks.length > 0;
    const hasImages = /!\[.*?\]\(.*?\)/.test(content);
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Determine content type
    let type: ResponseMetadata['type'];
    if (hasCode && codeBlocks.length > 2) {
      type = 'mixed';
    } else if (hasCode) {
      type = 'code';
    } else if (content.includes('analysis') || content.includes('recommendation')) {
      type = 'annotation';
    } else {
      type = 'text';
    }

    // Calculate confidence based on content structure
    let confidence = 0.5;
    if (hasCode) confidence += 0.3;
    if (content.includes('```')) confidence += 0.2;
    if (wordCount > 50) confidence += 0.1;
    if (content.includes('function') || content.includes('class')) confidence += 0.1;

    return {
      type,
      confidence: Math.min(confidence, 1.0),
      hasCode,
      hasImages,
      wordCount,
    };
  }

  private generateSummary(content: string, codeBlocks: CodeBlock[]): string {
    let summary = '';
    
    if (codeBlocks.length > 0) {
      const languages = [...new Set(codeBlocks.map(block => block.language))];
      summary += `Generated ${codeBlocks.length} code block${codeBlocks.length > 1 ? 's' : ''} (${languages.join(', ')})`;
    }

    const lines = content.split('\n');
    const firstLine = lines.find(line => line.trim().length > 0);
    if (firstLine && firstLine.length > 10) {
      const preview = firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
      if (summary) summary += '. ';
      summary += preview;
    }

    return summary || 'AI response processed';
  }

  private getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
  }

  extractMainCodeBlock(blocks: CodeBlock[]): CodeBlock | null {
    if (blocks.length === 0) return null;
    
    // Prefer blocks with common languages
    const preferredLanguages = ['javascript', 'typescript', 'jsx', 'tsx', 'python', 'html', 'css', 'sql'];
    
    for (const lang of preferredLanguages) {
      const block = blocks.find(b => b.language.toLowerCase() === lang);
      if (block) return block;
    }

    // Return the largest block
    return blocks.reduce((largest, current) => 
      current.code.length > largest.code.length ? current : largest
    );
  }

  formatForClipboard(parsed: ParsedResponse): string {
    let formatted = '';
    
    if (parsed.summary) {
      formatted += `// ${parsed.summary}\n\n`;
    }

    if (parsed.codeBlocks.length > 0) {
      const mainBlock = this.extractMainCodeBlock(parsed.codeBlocks);
      if (mainBlock) {
        formatted += mainBlock.code;
      }
    } else {
      formatted += parsed.content;
    }

    return formatted;
  }

  formatForDisplay(parsed: ParsedResponse): string {
    let formatted = parsed.content;
    
    // Add metadata information
    if (parsed.metadata.hasCode) {
      formatted += `\n\n---\n`;
      formatted += `Found ${parsed.codeBlocks.length} code block(s)`;
      
      const languages = [...new Set(parsed.codeBlocks.map(b => b.language))];
      if (languages.length > 0) {
        formatted += ` in ${languages.join(', ')}`;
      }
    }

    return formatted;
  }

  validateCodeBlock(block: CodeBlock): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!block.code.trim()) {
      errors.push('Code block is empty');
    }

    if (block.language === 'javascript' || block.language === 'typescript') {
      // Basic syntax validation
      if (!block.code.includes('{') && !block.code.includes('}') && block.code.length > 50) {
        errors.push('JavaScript/TypeScript code might be missing braces');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}