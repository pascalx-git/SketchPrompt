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
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' 'unsafe-eval'; img-src data: blob:;">
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
				</style>
			</head>
			<body>
				<div id="sketching-container"></div>
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