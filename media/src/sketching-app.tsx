import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw, getSnapshot, loadSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';

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
      <Tldraw onMount={handleMount} />
    </div>
  );
}

const container = document.getElementById('sketching-container');
if (container) {
  createRoot(container).render(<SketchPromptApp />);
} 