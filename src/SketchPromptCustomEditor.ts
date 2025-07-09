import * as vscode from 'vscode';
import * as path from 'path';

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

export class SketchPromptCustomEditor implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'sketchprompt.editor';

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    console.log('[SketchPrompt] resolveCustomTextEditor called for', document.uri.fsPath);
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
        'File not found. If you renamed or deleted this file outside VS Code, please refresh the file explorer.'
      );
    }

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    let lastSavedDocument: any = undefined;
    let ignoreNextWatcher = false;

    // Send the initial sketch data to the webview
    function sendSketchData() {
      try {
        const text = document.getText();
        const data = text ? JSON.parse(text) : {};
        // Always send the full snapshot (document + session)
        lastSavedDocument = data.document || {};
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: data // { document, session }
        });
      } catch (error) {
        console.error('Failed to parse sketch data:', error);
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: { document: {}, session: {} }
        });
      }
    }
    sendSketchData();

    // Debounced save logic
    const debouncedSave = debounce(async (data: any) => {
      try {
        if (document.uri.scheme === 'file') {
          // Only save if document actually changed
          if (!deepEqual(data.document, lastSavedDocument)) {
            const edit = new vscode.WorkspaceEdit();
            // Always save the full snapshot (document + session)
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify({ document: data.document, session: data.session }, null, 2));
            ignoreNextWatcher = true;
            await vscode.workspace.applyEdit(edit);
            await document.save();
            lastSavedDocument = data.document;
          }
        }
      } catch (error) {
        console.error('Failed to save sketch:', error);
        if (document.uri.scheme === 'file') {
          const errorMessage = error instanceof Error ? error.message : String(error);
          vscode.window.showErrorMessage(`Failed to save sketch: ${errorMessage}`);
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
            'This sketch file was changed outside of Cursor. You have unsaved changes. Click to reload from disk and discard your edits.',
            'Reload from Disk'
          ).then(selection => {
            if (selection === 'Reload from Disk') {
              // Reopen the document to reload from disk (discarding unsaved changes)
              vscode.commands.executeCommand('workbench.action.files.revert');
              setTimeout(() => {
                sendSketchData();
              }, 500); // Give VS Code time to revert
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
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.tldraw.com; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tldraw.com; script-src 'nonce-${nonce}' 'unsafe-eval' https://cdn.tldraw.com; img-src data: blob: https://cdn.tldraw.com; font-src https://cdn.tldraw.com; connect-src https://cdn.tldraw.com;">
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