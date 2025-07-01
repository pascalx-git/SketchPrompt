import * as vscode from 'vscode';
import { SketchPromptProvider } from './SketchPromptProvider';
import { SketchPromptCustomEditor } from './SketchPromptCustomEditor';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	console.log('SketchPrompt is now active!');

	// Register the webview provider (for legacy panel/sidebar)
	const provider = new SketchPromptProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			'sketchPromptView',
			provider
		)
	);

	// Register the custom editor provider
	context.subscriptions.push(
		vscode.window.registerCustomEditorProvider(
			SketchPromptCustomEditor.viewType,
			new SketchPromptCustomEditor(context),
			{ webviewOptions: { retainContextWhenHidden: true } }
		)
	);

	// Register the command to open canvas (legacy)
	let disposable = vscode.commands.registerCommand('sketchprompt.openCanvas', () => {
		vscode.commands.executeCommand('workbench.view.extension.sketchPromptPanel');
		vscode.commands.executeCommand('sketchPromptView.focus');
	});
	context.subscriptions.push(disposable);

	// Register the command to create a new sketch
	let newSketchDisposable = vscode.commands.registerCommand('sketchprompt.newSketch', async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('Please open a workspace folder to use SketchPrompt.');
			return;
		}
		const rootPath = workspaceFolders[0].uri.fsPath;
		const sketchesFolder = path.join(rootPath, 'sketchprompt');
		if (!fs.existsSync(sketchesFolder)) {
			fs.mkdirSync(sketchesFolder);
		}
		// Find a unique untitled name
		let i = 1;
		let filePath;
		while (true) {
			filePath = path.join(sketchesFolder, `Untitled-${i}.sketchprompt`);
			if (!fs.existsSync(filePath)) break;
			i++;
		}
		// Write empty JSON to file
		fs.writeFileSync(filePath, JSON.stringify({}));
		const fileUri = vscode.Uri.file(filePath);
		await vscode.commands.executeCommand('vscode.openWith', fileUri, SketchPromptCustomEditor.viewType);
	});
	context.subscriptions.push(newSketchDisposable);
}

export function deactivate() {} 