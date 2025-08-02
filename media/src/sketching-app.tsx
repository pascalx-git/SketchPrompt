import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Tldraw, getSnapshot, loadSnapshot } from 'tldraw';
import 'tldraw/tldraw.css';
import { SketchExportService } from './SketchExportService';

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
  const [persistenceKey, setPersistenceKey] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const exportService = SketchExportService.getInstance();

  // Preview generation function
  const generatePreview = useCallback(async () => {
    if (!editorRef.current || isGeneratingPreview) return;
    
    try {
      setIsGeneratingPreview(true);
      
      // Update status to show preview generation
      vscode?.postMessage({ 
        type: 'updateStatus', 
        data: { 
          text: '$(sync~spin) Generating AI preview...',
          tooltip: 'Creating preview for AI analysis'
        }
      });

      const previewData = await exportService.generatePreview(editorRef.current);
      
      // Send preview data to extension
      vscode?.postMessage({
        type: 'savePreview',
        data: {
          blob: previewData.imageBlob,
          metadata: previewData.metadata,
          timestamp: Date.now()
        }
      });

      // Update status to show success
      vscode?.postMessage({ 
        type: 'updateStatus', 
        data: { 
          text: '$(pass-filled) Preview Generated',
          tooltip: 'AI-ready preview created successfully'
        }
      });

    } catch (error) {
      console.error('Preview generation failed:', error);
      
      // Update status to show error
      vscode?.postMessage({ 
        type: 'updateStatus', 
        data: { 
          text: '$(error) Preview Failed',
          tooltip: 'Failed to generate preview'
        }
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [isGeneratingPreview]);

  // Debounced preview generation
  const debouncedPreviewGeneration = useCallback(
    debounce(generatePreview, 2000),
    [generatePreview]
  );

  // Debounce utility function
  function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timer: NodeJS.Timeout | null = null;
    return function(this: any, ...args: any[]) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    } as T;
  }

  // Enhanced theme detection for VS Code
  const detectVSCodeTheme = (): boolean => {
    // Method 1: Check for VS Code theme classes
    const isDark = document.body.classList.contains('vscode-dark') || 
                   document.body.classList.contains('dark') ||
                   document.body.classList.contains('dark-theme');
    
    // Method 2: Check for VS Code theme attributes
    const themeAttribute = document.body.getAttribute('data-vscode-theme-kind');
    const isDarkByAttribute = themeAttribute === 'dark' || themeAttribute === 'vscode-dark';
    
    // Method 3: Check for VS Code theme data attribute
    const themeData = document.body.getAttribute('data-vscode-theme');
    const isDarkByData = Boolean(themeData && (themeData.includes('dark') || themeData.includes('Dark')));
    
    // Method 4: Check computed styles for background color (fallback)
    const computedStyle = window.getComputedStyle(document.body);
    const backgroundColor = computedStyle.backgroundColor;
    const isDarkByBackground = Boolean(backgroundColor && 
      (backgroundColor.includes('rgb(30, 30, 30)') || 
       backgroundColor.includes('rgb(51, 51, 51)') ||
       backgroundColor.includes('#1e1e1e') ||
       backgroundColor.includes('#333333')));
    
    return isDark || isDarkByAttribute || isDarkByData || isDarkByBackground;
  };

  // Listen for messages from the extension (load sketch)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const message = event.data;
      if (message.type === 'loadSketch' && !loaded.current) {
        try {
          // Set persistence key if provided
          if (message.persistenceKey) {
            setPersistenceKey(message.persistenceKey);
            
          }
          
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
      } else if (message.type === 'generatePreview') {
        // Handle manual preview generation command
        generatePreview();
      }
    }
    window.addEventListener('message', handleMessage);
    vscode?.postMessage({ type: 'requestSketch' });
    return () => window.removeEventListener('message', handleMessage);
  }, [generatePreview]);

  // Enhanced theme detection and monitoring
  useEffect(() => {
    // Initial theme detection
    const updateTheme = () => {
      const newIsDarkMode = detectVSCodeTheme();
      setIsDarkMode(newIsDarkMode);
      
    };

    // Set initial theme
    updateTheme();

    // Monitor for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'class' || 
             mutation.attributeName === 'data-vscode-theme-kind' ||
             mutation.attributeName === 'data-vscode-theme')) {
          updateTheme();
        }
      });
    });

    // Observe body element for theme changes
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class', 'data-vscode-theme-kind', 'data-vscode-theme'] 
    });

    // Also listen for VS Code theme change events
    const handleThemeChange = () => {
      setTimeout(updateTheme, 100); // Small delay to ensure DOM is updated
    };

    // Listen for potential theme change events
    window.addEventListener('focus', handleThemeChange);
    window.addEventListener('storage', handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('focus', handleThemeChange);
      window.removeEventListener('storage', handleThemeChange);
    };
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
        
        // Trigger debounced preview generation
        debouncedPreviewGeneration();
      } catch (error) {
        console.error('Failed to save sketch:', error);
      }
    });
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      exportService.cleanupCache();
    };
  }, [exportService]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      {/* Use TLDraw's inferDarkMode for automatic theme detection */}
      <Tldraw 
        onMount={handleMount} 
        inferDarkMode={true}
        persistenceKey={persistenceKey || `sketchprompt-fallback-${Date.now()}`}
      />
    </div>
  );
}

const container = document.getElementById('sketching-container');
if (container) {
  createRoot(container).render(<SketchPromptApp />);
} 