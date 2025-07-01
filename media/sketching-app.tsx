import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

// Declare the VS Code API
declare global {
  interface Window {
    acquireVsCodeApi?: () => any;
  }
}

const vscode = window.acquireVsCodeApi ? window.acquireVsCodeApi() : null;

function SketchPromptApp() {
  const appRef = useRef<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const loaded = useRef(false);

  // Listen for messages from the extension
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data;
      if (message.type === 'loadSketch' && appRef.current && !loaded.current) {
        try {
          appRef.current.loadDocument(message.data);
          loaded.current = true;
        } catch (error) {
          console.error('Failed to load sketch:', error);
        }
      }
    }
    window.addEventListener('message', handleMessage);
    // Request initial data
    vscode?.postMessage({ type: 'requestSketch' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.body.classList.contains('vscode-dark');
      setIsDarkMode(isDark);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    setIsDarkMode(document.body.classList.contains('vscode-dark'));
    return () => observer.disconnect();
  }, []);

  // Save on change
  function handleMount(app: any) {
    appRef.current = app;
    app.on('change', () => {
      try {
        const data = app.getDocument();
        vscode?.postMessage({ type: 'saveSketch', data });
      } catch (error) {
        console.error('Failed to save sketch:', error);
      }
    });
  }

  // Copy to Prompt and Export PNG
  function handleCopyToPrompt() {
    if (!appRef.current) return;
    try {
      appRef.current.exportImage('png', { scale: 2, quality: 1 }).then((dataUrl: string) => {
        vscode?.postMessage({
          command: 'copyToPrompt',
          data: {
            imageUrl: dataUrl,
            timestamp: new Date().toISOString(),
            format: 'png',
          },
        });
      });
    } catch (error) {
      console.error('Failed to copy to prompt:', error);
    }
  }

  function handleExportPNG() {
    if (!appRef.current) return;
    try {
      appRef.current.exportImage('png', { scale: 2, quality: 1 }).then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = `sketchprompt-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      });
    } catch (error) {
      console.error('Failed to export PNG:', error);
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Tldraw onMount={handleMount} />
      <div style={{ 
        position: 'fixed', 
        top: 10, 
        right: 10, 
        zIndex: 1000,
        background: 'var(--vscode-panel-background)',
        border: '1px solid var(--vscode-panel-border)',
        borderRadius: '6px',
        padding: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <button 
          onClick={handleCopyToPrompt} 
          style={{ 
            margin: 2, 
            padding: '6px 12px',
            background: 'var(--vscode-button-background)',
            color: 'var(--vscode-button-foreground)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Copy to Prompt
        </button>
        <button 
          onClick={handleExportPNG} 
          style={{ 
            margin: 2, 
            padding: '6px 12px',
            background: 'var(--vscode-button-background)',
            color: 'var(--vscode-button-foreground)',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Export PNG
        </button>
      </div>
    </div>
  );
}

const container = document.getElementById('sketching-container');
if (container) {
  createRoot(container).render(<SketchPromptApp />);
} 