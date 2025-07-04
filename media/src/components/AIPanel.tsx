import React, { useState, useCallback, useRef } from 'react';
import { PromptInput } from './PromptInput';
import { ResponseViewer } from './ResponseViewer';
import { ProviderSelector } from './ProviderSelector';

interface AIRequest {
  prompt: string;
  templateId?: string;
  provider?: string;
  useSelection?: boolean;
}

interface AIResponse {
  content: string;
  type: 'code' | 'text' | 'annotation';
  metadata?: {
    model: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

interface AIPanelProps {
  onRequest: (request: AIRequest) => Promise<AIResponse>;
  onCopyToClipboard: (content: string) => void;
  onInsertToEditor: (content: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  onRequest,
  onCopyToClipboard,
  onInsertToEditor,
  isLoading = false,
  error = null,
}) => {
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('openai');
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseHistory, setResponseHistory] = useState<AIResponse[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRequest = useCallback(async (request: AIRequest) => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setCurrentResponse(null);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();

    try {
      const response = await onRequest({
        ...request,
        provider: selectedProvider,
      });
      
      setCurrentResponse(response);
      setResponseHistory(prev => [response, ...prev.slice(0, 4)]); // Keep last 5 responses
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled
        return;
      }
      
      console.error('AI request failed:', err);
      setCurrentResponse({
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`,
        type: 'text',
      });
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  }, [onRequest, selectedProvider, isProcessing]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
  }, []);

  const handleCopyResponse = useCallback(() => {
    if (currentResponse) {
      onCopyToClipboard(currentResponse.content);
    }
  }, [currentResponse, onCopyToClipboard]);

  const handleInsertResponse = useCallback(() => {
    if (currentResponse) {
      onInsertToEditor(currentResponse.content);
    }
  }, [currentResponse, onInsertToEditor]);

  const handleRegenerateResponse = useCallback(() => {
    if (currentResponse) {
      // Regenerate with the same prompt
      handleRequest({ prompt: 'Regenerate previous response' });
    }
  }, [currentResponse, handleRequest]);

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>AI Assistant</h3>
        <ProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
          disabled={isProcessing}
        />
      </div>

      <div className="ai-panel-content">
        <PromptInput
          onSubmit={handleRequest}
          disabled={isProcessing}
          placeholder="Describe what you want to generate from your sketch..."
        />

        {error && (
          <div className="ai-panel-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {isProcessing && (
          <div className="ai-panel-loading">
            <div className="loading-spinner"></div>
            <span>Processing your request...</span>
            <button onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
          </div>
        )}

        {currentResponse && !isProcessing && (
          <ResponseViewer
            response={currentResponse}
            onCopy={handleCopyResponse}
            onInsert={handleInsertResponse}
            onRegenerate={handleRegenerateResponse}
          />
        )}

        {responseHistory.length > 0 && !isProcessing && (
          <div className="ai-panel-history">
            <h4>Recent Responses</h4>
            <div className="response-history-list">
              {responseHistory.map((response, index) => (
                <div
                  key={index}
                  className="response-history-item"
                  onClick={() => setCurrentResponse(response)}
                >
                  <div className="response-preview">
                    {response.content.substring(0, 100)}
                    {response.content.length > 100 && '...'}
                  </div>
                  <div className="response-meta">
                    <span className="response-type">{response.type}</span>
                    {response.metadata?.processingTime && (
                      <span className="response-time">
                        {response.metadata.processingTime}ms
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};