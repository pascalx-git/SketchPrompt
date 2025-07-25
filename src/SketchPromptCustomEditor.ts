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
      console.log('[SketchPrompt] Status bar updated:', text);
    } else {
      // Recreate status bar if it was disposed
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
      this.statusBarItem.text = text;
      this.statusBarItem.tooltip = tooltip;
      this.statusBarItem.show();
      console.log('[SketchPrompt] Status bar recreated and updated:', text);
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
    console.log('[SketchPrompt] resolveCustomTextEditor called for', document.uri.fsPath);
    
    // Create status bar item for this editor instance
    if (!this.statusBarItem) {
      this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
      this.statusBarItem.text = '$(pencil) SketchPrompt: Ready';
      this.statusBarItem.tooltip = 'SketchPrompt is ready to use';
      this.statusBarItem.show();
      console.log('[SketchPrompt] Status bar item created and shown');
    }

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    // Notify if file does not exist
    try {
      // This will throw if the file does not exist
      await vscode.workspace.fs.stat(document.uri);
    } catch (err) {
      vscode.window.showWarningMessage(
        'File not found. If you renamed or deleted this file outside the editor, please refresh the file explorer.'
      );
    }

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    let lastSavedDocument: any = undefined;
    let ignoreNextWatcher = false;

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
          data: data // { document, session }
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
            data: data
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
          data: { document: {}, session: {} }
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

    // Debounced save logic
    const debouncedSave = debounce(async (data: any) => {
      try {
        if (document.uri.scheme === 'file') {
          // Only save if document actually changed
          if (!deepEqual(data.document, lastSavedDocument)) {
            // Update status bar to show saving
            this.updateStatusBar('$(sync~spin) SketchPrompt: Saving...', 'Saving sketch...');
            
            const edit = new vscode.WorkspaceEdit();
            // Always save the full snapshot (document + session)
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify({ document: data.document, session: data.session }, null, 2));
            ignoreNextWatcher = true;
            await vscode.workspace.applyEdit(edit);
            await document.save();
            lastSavedDocument = data.document;
            
            // Update status bar to show saved briefly, then return to ready
            this.updateStatusBar('$(pass-filled) SketchPrompt: Saved', 'Sketch saved successfully');
            this.scheduleStatusBarUpdate(() => {
              this.updateStatusBar('$(pencil) SketchPrompt: Ready', `Editing ${path.basename(document.uri.fsPath)}`);
            }, 2000);
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
    }, 300);

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
    console.log('[SketchPrompt] Setting up file watcher for', relativePattern);
    const fileWatcher = vscode.workspace.createFileSystemWatcher(relativePattern);
    fileWatcher.onDidChange(() => {
      console.log('[SketchPrompt] File watcher: onDidChange triggered for', document.uri.fsPath, 'ignoreNextWatcher:', ignoreNextWatcher);
      if (ignoreNextWatcher) {
        console.log('[SketchPrompt] Ignoring watcher event due to ignoreNextWatcher flag');
        ignoreNextWatcher = false;
        return;
      }
      debouncedReload();
    });
    fileWatcher.onDidCreate(() => {
      console.log('[SketchPrompt] File watcher: onDidCreate triggered for', document.uri.fsPath);
      debouncedReload();
    });
    fileWatcher.onDidDelete(() => {
      console.log('[SketchPrompt] File watcher: onDidDelete triggered for', document.uri.fsPath);
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
        console.log('[SketchPrompt] Status bar item disposed');
      }
    });

    // Debounced reload to avoid excessive reloads
    const debouncedReload = debounce(() => {
      console.log('[SketchPrompt] debouncedReload called for', document.uri.fsPath);
      try {
        if (!document.isDirty) {
          // Auto-reload if not dirty
          const text = document.getText();
          const data = text ? JSON.parse(text) : {};
          if (!deepEqual(data.document, lastSavedDocument)) {
            console.log('[SketchPrompt] Reloading sketch: file content differs from memory');
            vscode.window.showInformationMessage('Sketch file changed externally. Reloading...');
            // Always send the full snapshot
            webviewPanel.webview.postMessage({
              type: 'loadSketch',
              data: data // { document, session }
            });
            lastSavedDocument = data.document || {};
          } else {
            console.log('[SketchPrompt] No reload needed: file content matches memory');
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