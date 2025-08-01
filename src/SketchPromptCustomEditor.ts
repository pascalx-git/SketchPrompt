import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import Ajv from 'ajv';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout | null = null;
  return function(this: any, ...args: any[]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  } as T;
}

function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

// JSON Schema for TLDraw sketch data validation
interface SketchData {
  document?: object;
  session?: object;
}

const sketchDataSchema = {
  type: "object",
  properties: {
    document: {
      type: "object",
      nullable: true
    },
    session: {
      type: "object", 
      nullable: true
    }
  },
  additionalProperties: false,
  required: []
};

const ajv = new Ajv();
const validateSketchData = ajv.compile(sketchDataSchema);

function sanitizeSketchData(rawData: any): SketchData {
  if (!rawData || typeof rawData !== 'object') {
    return { document: {}, session: {} };
  }
  
  if (!validateSketchData(rawData)) {
    console.warn('Invalid sketch data structure, using safe defaults:', validateSketchData.errors);
    return { document: {}, session: {} };
  }
  
  return {
    document: rawData.document || {},
    session: rawData.session || {}
  };
}

function tryRecoverFromCorruptedJSON(text: string): { recovered: boolean; data: any; error?: string } {
  try {
    // Try to parse as-is first
    const parsed = JSON.parse(text);
    return { recovered: true, data: parsed };
  } catch (error) {
    // Try to recover by finding valid JSON parts
    const jsonMatch = text.match(/\{[^{}]*\}/);
    if (jsonMatch) {
      try {
        const partialData = JSON.parse(jsonMatch[0]);
        return { recovered: true, data: partialData, error: 'Partial recovery - some data may be lost' };
      } catch (partialError) {
        return { recovered: false, data: null, error: 'Unable to recover from corrupted file' };
      }
    }
    return { recovered: false, data: null, error: 'No valid JSON found' };
  }
}

function createBackup(filePath: string, content: string): string {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupPath = `${filePath}.backup-${timestamp}`;
    fs.writeFileSync(backupPath, content);
    
    // Note: Backup cleanup disabled for now - keeping all backups for user control
    // TODO: Add configurable backup retention in settings
    
    return backupPath;
  } catch (error) {
    console.error('Failed to create backup:', error);
    return '';
  }
}

export class SketchPromptCustomEditor implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'sketchprompt.editor';
  private statusBarItem: vscode.StatusBarItem | undefined;
  private statusBarTimeouts: NodeJS.Timeout[] = [];

  constructor(private readonly context: vscode.ExtensionContext) {
    // Status bar item will be created when editor is resolved
  }

  private updateStatusBar(text: string, tooltip: string) {
    if (this.statusBarItem) {
      this.statusBarItem.text = text;
      this.statusBarItem.tooltip = tooltip;
      
    } else {
      // Recreate status bar if it was disposed
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
      this.statusBarItem.text = text;
      this.statusBarItem.tooltip = tooltip;
      this.statusBarItem.show();
      
    }
  }

  private scheduleStatusBarUpdate(callback: () => void, delay: number): void {
    const timeout = setTimeout(callback, delay);
    this.statusBarTimeouts.push(timeout);
  }

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    
    
    // Create status bar item for this editor instance
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
      this.statusBarItem.text = '$(pencil) SketchPrompt: Ready';
      this.statusBarItem.tooltip = 'SketchPrompt is ready to use';
      this.statusBarItem.show();
      
    }

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    // Enhanced file path validation
    try {
      const filePath = document.uri.fsPath;
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        const errorMessage = `File not found: ${path.basename(filePath)}. The file may have been moved, renamed, or deleted.`;
        vscode.window.showErrorMessage(errorMessage);
        this.updateStatusBar('$(error) SketchPrompt: File Not Found', errorMessage);
        return;
      }

      // Check if file is readable
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
      } catch (accessError) {
        const errorMessage = `Cannot read file: ${path.basename(filePath)}. Check file permissions.`;
        vscode.window.showErrorMessage(errorMessage);
        this.updateStatusBar('$(error) SketchPrompt: Access Denied', errorMessage);
        return;
      }

      // Validate file path for special characters or problematic names
      const fileName = path.basename(filePath);
      if (fileName.includes('..') || fileName.includes('//') || fileName.includes('\\')) {
        const errorMessage = `Invalid file path detected: ${fileName}. Please use a different file name.`;
        vscode.window.showWarningMessage(errorMessage);
        this.updateStatusBar('$(warning) SketchPrompt: Path Issue', errorMessage);
      }

    } catch (err) {
      const errorMessage = `Unable to access file: ${path.basename(document.uri.fsPath)}. Please check if the file exists and is accessible.`;
      vscode.window.showErrorMessage(errorMessage);
      this.updateStatusBar('$(error) SketchPrompt: File Error', errorMessage);
      return;
    }

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    let lastSavedDocument: any = undefined;
    let ignoreNextWatcher = false;

    // Create unique persistence key based on file path to prevent interference between files
    const filePath = document.uri.fsPath;
    // Include file modification time to ensure uniqueness when files are recreated
    // This prevents TLDraw from loading old data from localStorage when a file is deleted and recreated
    const stats = fs.statSync(filePath);
    const fileTime = stats.mtime.getTime();
    const pathHash = Buffer.from(filePath).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
    const persistenceKey = `sketchprompt-${pathHash}-${fileTime}`;

    // Send the initial sketch data to the webview
    const sendSketchData = () => {
      try {
        const text = document.getText();
        const rawData = text ? JSON.parse(text) : {};
        const data = sanitizeSketchData(rawData);
        // Always send the full snapshot (document + session)
        lastSavedDocument = data.document || {};
        
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: data, // { document, session }
          persistenceKey: persistenceKey
        });
        // Update status bar to show loaded
        this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
      } catch (error) {
        console.error('Failed to parse sketch data:', error);
        
        // Create backup before attempting recovery
        const text = document.getText();
        const backupPath = createBackup(document.uri.fsPath, text);
        
        // Try to recover from corrupted JSON
        const recovery = tryRecoverFromCorruptedJSON(text);
        
        if (recovery.recovered) {
          // Successfully recovered some data
          const data = sanitizeSketchData(recovery.data);
          lastSavedDocument = data.document || {};
          webviewPanel.webview.postMessage({
            type: 'loadSketch',
            data: data,
            persistenceKey: persistenceKey
          });
          
          // Show recovery message with multiple feedback channels
          const message = backupPath 
            ? `Recovered sketch data. Backup saved as ${path.basename(backupPath)}`
            : 'Recovered sketch data from corrupted file';
          
          // 1. Toast notification
          vscode.window.showInformationMessage(message);
          
          // 2. Status bar with recovery indicator
          this.updateStatusBar('$(pencil) SketchPrompt: Ready (Recovered)', `Editing ${path.basename(document.uri.fsPath)} - ${message}`);
          
          // 3. Show in output channel for persistent visibility
          const outputChannel = vscode.window.createOutputChannel('SketchPrompt');
          outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] ${message}`);
          outputChannel.show();
          
          // 4. Show notification in webview for maximum visibility
          webviewPanel.webview.postMessage({
            type: 'showNotification',
            data: {
              type: 'info',
              message: `🔄 ${message}`,
              duration: 5000
            }
          });
        } else {
          // Complete failure - use empty sketch but preserve backup
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: { document: {}, session: {} },
          persistenceKey: persistenceKey
        });
          
          const message = backupPath 
            ? `Unable to recover sketch. Backup saved as ${path.basename(backupPath)}`
            : 'Unable to recover sketch data';
          
          // 1. Toast notification
          vscode.window.showWarningMessage(message);
          
          // 2. Status bar with error indicator
          this.updateStatusBar('$(error) SketchPrompt: Load Failed', `Failed to load sketch file - ${message}`);
          
          // 3. Show in output channel for persistent visibility
          const outputChannel = vscode.window.createOutputChannel('SketchPrompt');
          outputChannel.appendLine(`[${new Date().toLocaleTimeString()}] WARNING: ${message}`);
          outputChannel.show();
          
          // 4. Show notification in webview for maximum visibility
          webviewPanel.webview.postMessage({
            type: 'showNotification',
            data: {
              type: 'warning',
              message: `⚠️ ${message}`,
              duration: 8000
            }
          });
          this.scheduleStatusBarUpdate(() => {
            this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
          }, 3000);
        }
        
        // Ensure status bar is visible after error recovery
        if (this.statusBarItem) {
          this.statusBarItem.show();
        }
      }
    };
    sendSketchData();

    // Improved debounced save logic with better performance monitoring
    let saveCount = 0;
    let lastSaveTime = 0;
    const MIN_SAVE_INTERVAL = 1000; // Minimum 1 second between saves
    const MAX_SAVE_INTERVAL = 10000; // Maximum 10 seconds between saves
    
    const debouncedSave = debounce(async (data: any) => {
      try {
        if (document.uri.scheme === 'file') {
          const now = Date.now();
          const timeSinceLastSave = now - lastSaveTime;
          
          // Only save if document actually changed and enough time has passed
          if (!deepEqual(data.document, lastSavedDocument) && timeSinceLastSave >= MIN_SAVE_INTERVAL) {
            saveCount++;
            
            // Update status bar to show saving
            this.updateStatusBar('$(sync~spin) SketchPrompt: Saving...', 'Saving sketch...');
            
            const edit = new vscode.WorkspaceEdit();
            // Always save the full snapshot (document + session)
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify({ document: data.document, session: data.session }, null, 2));
            ignoreNextWatcher = true;
            await vscode.workspace.applyEdit(edit);
            await document.save();
            lastSavedDocument = data.document;
            lastSaveTime = now;
            
            // Update status bar to show saved briefly, then return to ready
            this.updateStatusBar('$(pass-filled) SketchPrompt: Saved', `Sketch saved successfully (${saveCount} saves)`);
            this.scheduleStatusBarUpdate(() => {
              this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
            }, 2000);
          } else if (timeSinceLastSave < MIN_SAVE_INTERVAL) {
            // Show that save was skipped due to timing
            this.updateStatusBar('$(clock) SketchPrompt: Save Skipped', 'Save skipped - too frequent');
            this.scheduleStatusBarUpdate(() => {
              this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Failed to save sketch:', error);
        if (document.uri.scheme === 'file') {
          // Don't expose internal error details - use sanitized message
          vscode.window.showErrorMessage('Failed to save sketch. Please check file permissions and try again.');
          // Update status bar to show error briefly, then return to ready
          this.updateStatusBar('$(error) SketchPrompt: Save Failed', 'Failed to save sketch');
          this.scheduleStatusBarUpdate(() => {
            this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
          }, 3000);
        }
      }
    }, 500); // Increased debounce delay for better performance

    // Listen for messages from the webview
    webviewPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'saveSketch': {
          debouncedSave(message.data);
          break;
        }
        case 'requestSketch': {
          sendSketchData();
          break;
        }
        case 'copyToClipboard': {
          try {
            vscode.window.showInformationMessage('Image copied to clipboard! You can now paste it in chat.');
          } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            vscode.window.showErrorMessage('Failed to copy image to clipboard');
          }
          break;
        }
        case 'showInfo': {
          vscode.window.showInformationMessage(message.message);
          break;
        }
        case 'showError': {
          vscode.window.showErrorMessage(message.message);
          break;
        }
        case 'showNotification': {
          // Handle webview notifications (for recovery messages)
          const { type, message: msg, duration } = message.data;
          if (type === 'info') {
            vscode.window.showInformationMessage(msg);
          } else if (type === 'warning') {
            vscode.window.showWarningMessage(msg);
          }
          break;
        }
      }
    });

    // Watch for file changes on disk (auto-reload)
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const relativePattern = workspaceFolder ? new vscode.RelativePattern(workspaceFolder, path.basename(document.uri.fsPath)) : document.uri.fsPath;
    
    const fileWatcher = vscode.workspace.createFileSystemWatcher(relativePattern);
    fileWatcher.onDidChange(() => {
      
      debouncedReload();
    });
    fileWatcher.onDidCreate(() => {
      
      debouncedReload();
    });
    fileWatcher.onDidDelete(() => {
      
      vscode.window.showWarningMessage('Sketch file was deleted.');
    });

    // Update webview if document changes externally (in-memory changes)
    const changeDocDisposable = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        sendSketchData();
      }
    });
    webviewPanel.onDidDispose(() => {
      changeDocDisposable.dispose();
      fileWatcher.dispose();
      // Clear all pending status bar timeouts
      this.statusBarTimeouts.forEach(timeout => clearTimeout(timeout));
      this.statusBarTimeouts = [];
      // Dispose status bar item
      if (this.statusBarItem) {
        this.statusBarItem.dispose();
        
      }
    });

    // Debounced reload to avoid excessive reloads
    const debouncedReload = debounce(() => {
      
      try {
        if (!document.isDirty) {
          // Auto-reload if not dirty
          const text = document.getText();
          const data = text ? JSON.parse(text) : {};
          if (!deepEqual(data.document, lastSavedDocument)) {
            
            vscode.window.showInformationMessage('Sketch file changed externally. Reloading...');
            // Always send the full snapshot
            webviewPanel.webview.postMessage({
              type: 'loadSketch',
              data: data, // { document, session }
              persistenceKey: persistenceKey
            });
            lastSavedDocument = data.document || {};
          } else {
            
          }
        } else {
          // If dirty, show notification with reload button
          vscode.window.showWarningMessage(
            'This sketch file was changed outside of the editor. You have unsaved changes. Click to reload from disk and discard your edits.',
            'Reload from Disk'
          ).then(selection => {
            if (selection === 'Reload from Disk') {
              // Reopen the document to reload from disk (discarding unsaved changes)
              vscode.commands.executeCommand('workbench.action.files.revert');
              setTimeout(() => {
                sendSketchData();
              }, 500); // Give the editor time to revert
            }
          });
        }
      } catch (error) {
        console.error('[SketchPrompt] Failed to reload sketch:', error);
      }
    }, 500);
  }

  private getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'sketching.js'));
    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this.context.extensionUri, 'media', 'sketching.css'));
    const nonce = getNonce();
    return `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src 'self' data: blob: https://cdn.tldraw.com; font-src 'self' https://cdn.tldraw.com; connect-src 'self' https://cdn.tldraw.com;">
        <title>SketchPrompt Editor</title>
        <link rel="stylesheet" href="${styleUri}">
        <style>
          html, body, #sketching-container {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: var(--vscode-editor-background, #222);
            color: var(--vscode-editor-foreground, #fff);
          }
          
          /* Theme-aware styling for better integration */
          body {
            background-color: var(--vscode-editor-background, #222);
            color: var(--vscode-editor-foreground, #fff);
          }
          
          /* Ensure proper theme inheritance */
          body.vscode-light {
            background-color: var(--vscode-editor-background, #ffffff);
            color: var(--vscode-editor-foreground, #000000);
          }
          
          body.vscode-dark {
            background-color: var(--vscode-editor-background, #1e1e1e);
            color: var(--vscode-editor-foreground, #ffffff);
          }
          
          /* Make TLDraw menus wider and show more items */
          .tlui-menu {
            min-width: 320px !important;
            max-width: 400px !important;
          }
          
          .tlui-menu__content {
            min-width: 320px !important;
          }
          
          /* Ensure menu items don't get hidden under "more" button */
          .tlui-menu__group {
            display: flex !important;
            flex-direction: column !important;
          }
          
          .tlui-menu__item {
            display: flex !important;
            align-items: center !important;
          }
        </style>
      </head>
      <body>
        <div id="sketching-container"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
} 