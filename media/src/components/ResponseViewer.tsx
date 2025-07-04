import React, { useState, useCallback, useMemo } from 'react';

interface AIResponse {
  content: string;
  type: 'code' | 'text' | 'annotation';
  metadata?: {
    model: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

interface ResponseViewerProps {
  response: AIResponse;
  onCopy: () => void;
  onInsert: () => void;
  onRegenerate: () => void;
}

interface CodeBlock {
  language: string;
  code: string;
  startIndex: number;
  endIndex: number;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({
  response,
  onCopy,
  onInsert,
  onRegenerate,
}) => {
  const [activeTab, setActiveTab] = useState<'formatted' | 'raw'>('formatted');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const codeBlocks = useMemo((): CodeBlock[] => {
    const blocks: CodeBlock[] = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(response.content)) !== null) {
      blocks.push({
        language: match[1] || 'text',
        code: match[2].trim(),
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
    
    return blocks;
  }, [response.content]);

  const formattedContent = useMemo(() => {
    if (codeBlocks.length === 0) {
      return response.content;
    }

    let formatted = response.content;
    let offset = 0;

    codeBlocks.forEach((block, index) => {
      const codeBlockHtml = `
        <div class="code-block" data-language="${block.language}">
          <div class="code-block-header">
            <span class="code-language">${block.language}</span>
            <button class="copy-code-btn" data-index="${index}">Copy</button>
          </div>
          <pre class="code-content"><code>${escapeHtml(block.code)}</code></pre>
        </div>
      `;
      
      const originalBlock = formatted.substring(block.startIndex + offset, block.endIndex + offset);
      formatted = formatted.replace(originalBlock, codeBlockHtml);
      offset += codeBlockHtml.length - originalBlock.length;
    });

    return formatted;
  }, [response.content, codeBlocks]);

  const handleCopyCode = useCallback((index: number) => {
    const block = codeBlocks[index];
    if (block) {
      navigator.clipboard.writeText(block.code).then(() => {
        setCopiedSection(`code-${index}`);
        setTimeout(() => setCopiedSection(null), 2000);
      });
    }
  }, [codeBlocks]);

  const handleCopyAll = useCallback(() => {
    onCopy();
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  }, [onCopy]);

  const getResponseTypeIcon = () => {
    switch (response.type) {
      case 'code':
        return '💻';
      case 'annotation':
        return '📝';
      default:
        return '💬';
    }
  };

  const getResponseTypeColor = () => {
    switch (response.type) {
      case 'code':
        return '#22c55e';
      case 'annotation':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="response-viewer">
      <div className="response-header">
        <div className="response-type">
          <span className="response-icon">{getResponseTypeIcon()}</span>
          <span className="response-type-label" style={{ color: getResponseTypeColor() }}>
            {response.type.charAt(0).toUpperCase() + response.type.slice(1)}
          </span>
        </div>
        
        <div className="response-tabs">
          <button
            className={`tab-button ${activeTab === 'formatted' ? 'active' : ''}`}
            onClick={() => setActiveTab('formatted')}
          >
            Formatted
          </button>
          <button
            className={`tab-button ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw
          </button>
        </div>
      </div>

      <div className="response-content">
        {activeTab === 'formatted' ? (
          <div
            className="formatted-content"
            dangerouslySetInnerHTML={{ __html: formattedContent }}
            onClick={(e) => {
              const target = e.target as HTMLElement;
              if (target.classList.contains('copy-code-btn')) {
                const index = parseInt(target.dataset.index || '0');
                handleCopyCode(index);
              }
            }}
          />
        ) : (
          <pre className="raw-content">{response.content}</pre>
        )}
      </div>

      <div className="response-actions">
        <button
          onClick={handleCopyAll}
          className={`action-button ${copiedSection === 'all' ? 'success' : ''}`}
        >
          {copiedSection === 'all' ? '✓ Copied' : '📋 Copy'}
        </button>
        
        <button onClick={onInsert} className="action-button">
          📝 Insert
        </button>
        
        <button onClick={onRegenerate} className="action-button">
          🔄 Regenerate
        </button>
      </div>

      {response.metadata && (
        <div className="response-metadata">
          <span className="metadata-item">
            Model: {response.metadata.model}
          </span>
          {response.metadata.tokensUsed && (
            <span className="metadata-item">
              Tokens: {response.metadata.tokensUsed}
            </span>
          )}
          {response.metadata.processingTime && (
            <span className="metadata-item">
              Time: {response.metadata.processingTime}ms
            </span>
          )}
        </div>
      )}
    </div>
  );
};

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}