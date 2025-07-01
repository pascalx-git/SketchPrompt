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
            const edit = new vscode.WorkspaceEdit();
            edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), JSON.stringify(message.data, null, 2));
            await vscode.workspace.applyEdit(edit);
            await document.save();
          } catch (error) {
            console.error('Failed to save sketch:', error);
          }
          break;
        }
        case 'requestSketch': {
          sendSketchData();
          break;
        }
        case 'copyToPrompt': {
          // Handle copy to prompt functionality
          const editor = vscode.window.activeTextEditor;
          if (editor) {
            const position = editor.selection.active;
            editor.edit(editBuilder => {
              editBuilder.insert(position, `\n<!-- SketchPrompt Sketch -->\n![Sketch](${message.data.imageUrl})\n\n`);
            });
          } else {
            vscode.window.showInformationMessage('No active editor to copy sketch to');
          }
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
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src data: blob:;">
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