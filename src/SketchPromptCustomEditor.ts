import * as vscode from 'vscode';
import * as path from 'path';

export class SketchPromptCustomEditor implements vscode.CustomTextEditorProvider {
  public static readonly viewType = 'sketchprompt.editor';

  constructor(private readonly context: vscode.ExtensionContext) {}

  public async resolveCustomTextEditor(
    document: vscode.TextDocument,
    webviewPanel: vscode.WebviewPanel,
    _token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri]
    };

    webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

    // Send the initial sketch data to the webview
    function sendSketchData() {
      try {
        const text = document.getText();
        const data = text ? JSON.parse(text) : {};
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: data
        });
      } catch (error) {
        console.error('Failed to parse sketch data:', error);
        webviewPanel.webview.postMessage({
          type: 'loadSketch',
          data: {}
        });
      }
    }
    sendSketchData();

    // Listen for messages from the webview
    webviewPanel.webview.onDidReceiveMessage(async (message) => {
      switch (message.type) {
        case 'saveSketch': {
          try {
            // Only save if the document is not untitled
            if (document.uri.scheme === 'file') {
              const edit = new vscode.WorkspaceEdit();
              edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(message.data, null, 2));
              await vscode.workspace.applyEdit(edit);
              await document.save();
            } else {
              // For untitled documents, just store the data in memory
              console.log('Document is untitled, storing data in memory');
            }
                      } catch (error) {
              console.error('Failed to save sketch:', error);
              // Don't show error for untitled documents
              if (document.uri.scheme === 'file') {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`Failed to save sketch: ${errorMessage}`);
              }
            }
          break;
        }
        case 'requestSketch': {
          sendSketchData();
          break;
        }
        case 'copyToClipboard': {
          // Handle copy to clipboard functionality
          try {
            // The clipboard operation is handled in the webview
            // This is just for user feedback
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

    // Update webview if document changes externally
    const changeDocDisposable = vscode.workspace.onDidChangeTextDocument(e => {
      if (e.document.uri.toString() === document.uri.toString()) {
        sendSketchData();
      }
    });
    webviewPanel.onDidDispose(() => {
      changeDocDisposable.dispose();
    });
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