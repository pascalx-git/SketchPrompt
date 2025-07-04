import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw, getSnapshot, loadSnapshot, exportToBlob } from 'tldraw';
import 'tldraw/tldraw.css';
import './ai-components.css';
import { AIPanel } from './components/AIPanel';

// VS Code API
// https://code.visualstudio.com/api/extension-guides/webview#webview-api

declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

function SketchPromptApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const loaded = useRef(false);
  const editorRef = useRef<any>(null);
  const [initialSnapshot, setInitialSnapshot] = useState<any | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Listen for messages from the extension (load sketch)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data;
      if (message.type === 'loadSketch' && !loaded.current) {
        try {
          if (message.data && (message.data.document || message.data.session)) {
            setInitialSnapshot(message.data); // Save for loading after mount
            loaded.current = true;
          } else if (message.data && Object.keys(message.data).length > 0) {
            // Fallback for old format
            setInitialSnapshot({ document: message.data });
            loaded.current = true;
          }
        } catch (error) {
          console.error('Failed to load sketch:', error);
        }
      }
    }
    window.addEventListener('message', handleMessage);
    vscode?.postMessage({ type: 'requestSketch' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle theme changes (optional, for VS Code theme integration)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.body.classList.contains('vscode-dark');
      setIsDarkMode(isDark);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.body.classList.contains('vscode-dark'));
    return () => observer.disconnect();
  }, []);

  // AI Integration Functions
  const handleAIRequest = async (request: any) => {
    setIsAIProcessing(true);
    setAiError(null);
    
    try {
      // Export canvas as image
      const imageBlob = await exportCanvasAsImage(request.useSelection);
      
      // Convert to base64
      const imageBuffer = await blobToArrayBuffer(imageBlob);
      
      // Send to extension for AI processing
      const response = await new Promise((resolve, reject) => {
        const messageHandler = (event: MessageEvent) => {
          if (event.data.type === 'aiResponse') {
            window.removeEventListener('message', messageHandler);
            resolve(event.data.response);
          } else if (event.data.type === 'aiError') {
            window.removeEventListener('message', messageHandler);
            reject(new Error(event.data.error));
          }
        };
        
        window.addEventListener('message', messageHandler);
        
        vscode?.postMessage({
          type: 'aiRequest',
          data: {
            prompt: request.prompt,
            image: Array.from(new Uint8Array(imageBuffer)),
            provider: request.provider,
            templateId: request.templateId,
          }
        });
      });
      
      return response;
    } catch (error) {
      setAiError(error instanceof Error ? error.message : 'Unknown error');
      throw error;
    } finally {
      setIsAIProcessing(false);
    }
  };

  const exportCanvasAsImage = async (useSelection: boolean = false) => {
    if (!editorRef.current) {
      throw new Error('Editor not ready');
    }
    
    try {
      // Use TLDraw's export functionality
      const blob = await exportToBlob({
        editor: editorRef.current,
        ids: useSelection ? editorRef.current.getSelectedShapeIds() : undefined,
        format: 'png',
        opts: { background: false },
      });
      
      return blob;
    } catch (error) {
      throw new Error('Failed to export canvas');
    }
  };

  const blobToArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  };

  const handleCopyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      vscode?.postMessage({ type: 'showInfo', message: 'Copied to clipboard!' });
    } catch (error) {
      vscode?.postMessage({ type: 'showError', message: 'Failed to copy to clipboard' });
    }
  };

  const handleInsertToEditor = (content: string) => {
    vscode?.postMessage({ type: 'insertToEditor', content });
  };

  // Save on change (https://tldraw.dev/docs/persistence)
  function handleMount(editor: any) {
    editorRef.current = editor;
    // Load initial snapshot if available
    if (initialSnapshot) {
      try {
        loadSnapshot(editor.store, initialSnapshot);
      } catch (error) {
        console.error('Failed to load snapshot:', error);
      }
    }
    // Listen for changes and save
    editor.store.listen(() => {
      try {
        const { document, session } = getSnapshot(editor.store);
        vscode?.postMessage({ type: 'saveSketch', data: { document, session } });
      } catch (error) {
        console.error('Failed to save sketch:', error);
      }
    });
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      {/* https://tldraw.dev/quick-start */}
      <Tldraw onMount={handleMount}>
        {/* AI Panel Toggle Button */}
        <button
          onClick={() => setShowAIPanel(!showAIPanel)}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1000,
            padding: '8px 12px',
            backgroundColor: '#007acc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {showAIPanel ? '✕ Close AI' : '🤖 AI Assistant'}
        </button>
      </Tldraw>
      
      {/* AI Panel */}
      {showAIPanel && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '350px',
          height: '100%',
          backgroundColor: 'var(--vscode-editor-background, #1e1e1e)',
          borderLeft: '1px solid var(--vscode-widget-border, #454545)',
          zIndex: 999,
          overflow: 'hidden'
        }}>
          <AIPanel
            onRequest={handleAIRequest}
            onCopyToClipboard={handleCopyToClipboard}
            onInsertToEditor={handleInsertToEditor}
            isLoading={isAIProcessing}
            error={aiError}
          />
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('sketching-container');
if (container) {
  createRoot(container).render(<SketchPromptApp />);
} 