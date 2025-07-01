import * as vscode from 'vscode';
import * as path from 'path';

export class SketchPromptProvider implements vscode.WebviewViewProvider {
	public static readonly viewType = 'sketchPromptView';

	private _view?: vscode.WebviewView;

	constructor(
		private readonly _extensionUri: vscode.Uri,
	) { }

	public resolveWebviewView(
		webviewView: vscode.WebviewView,
		context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken,
	) {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				this._extensionUri
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		// Handle messages from the webview
		webviewView.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'copyToPrompt':
						this._copyToPrompt(message.data);
						return;
					case 'exportSketch':
						this._exportSketch(message.data);
						return;
					case 'newSketch':
						vscode.commands.executeCommand('sketchprompt.newSketch');
						return;
				}
			}
		);
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		// Get the local path to the script and uri for the webview
		const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'sketching.js'));
		const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'sketching.css'));

		// Use a nonce to only allow specific scripts to be run
		const nonce = getNonce();

		return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://cdn.tldraw.com; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tldraw.com; script-src 'nonce-${nonce}' 'unsafe-eval' https://cdn.tldraw.com; img-src data: blob: https://cdn.tldraw.com; font-src https://cdn.tldraw.com; connect-src https://cdn.tldraw.com;">
				<title>SketchPrompt Sketching Canvas</title>
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
					#new-sketch-btn {
						display: block;
						width: 90%;
						margin: 24px auto 16px auto;
						padding: 18px 0;
						font-size: 1.4em;
						font-weight: bold;
						background: var(--vscode-button-background, #007acc);
						color: var(--vscode-button-foreground, #fff);
						border: none;
						border-radius: 8px;
						cursor: pointer;
						box-shadow: 0 2px 8px rgba(0,0,0,0.08);
						transition: background 0.2s;
					}
					#new-sketch-btn:hover {
						background: var(--vscode-button-hoverBackground, #005a9e);
					}
				</style>
			</head>
			<body>
				<button id="new-sketch-btn">+ New Sketch</button>
				<div id="sketching-container"></div>
				<script nonce="${nonce}">
					const vscode = acquireVsCodeApi();
					document.getElementById('new-sketch-btn').onclick = () => {
						vscode.postMessage({ command: 'newSketch' });
					};
				</script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
	}

	private _copyToPrompt(data: any) {
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			// Insert the sketch data into the current document
			const position = editor.selection.active;
			editor.edit(editBuilder => {
				editBuilder.insert(position, `\n<!-- SketchPrompt Sketch -->\n![Sketch](${data.imageUrl})\n\n`);
			});
		} else {
			vscode.window.showInformationMessage('No active editor to copy sketch to');
		}
	}

	private _exportSketch(data: any) {
		// Handle sketch export
		vscode.window.showInformationMessage('Export functionality coming soon!');
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