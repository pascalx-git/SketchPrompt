import * as vscode from 'vscode';
import { SketchPromptCustomEditor } from './SketchPromptCustomEditor';
import * as path from 'path';
import * as fs from 'fs';

export async function activate(context: vscode.ExtensionContext) {
	console.log('[SketchPrompt] Extension activated');
	console.log('SketchPrompt is now active!');

	// On activation, ensure SketchPrompt folder and default file exist
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const rootPath = workspaceFolders[0].uri.fsPath;
		const sketchesFolder = path.join(rootPath, 'SketchPrompt');
		if (!fs.existsSync(sketchesFolder)) {
			fs.mkdirSync(sketchesFolder);
		}
		// Check for existing .sketchprompt files
		const files = fs.readdirSync(sketchesFolder).filter(f => f.endsWith('.sketchprompt'));
		if (files.length === 0) {
			// Use 'sketch' as the base name
			let baseName = 'sketch';
			let defaultName = `${baseName}.sketchprompt`;
			let i = 1;
			while (fs.existsSync(path.join(sketchesFolder, defaultName))) {
				defaultName = `${baseName}-${i}.sketchprompt`;
				i++;
			}
			const defaultPath = path.join(sketchesFolder, defaultName);
			fs.writeFileSync(defaultPath, JSON.stringify({}));
			const defaultUri = vscode.Uri.file(defaultPath);
			setTimeout(() => {
				vscode.commands.executeCommand('vscode.openWith', defaultUri, 'sketchprompt.editor');
			}, 300);
		}
	}

	// Register the command to create a new sketch
	let newSketchDisposable = vscode.commands.registerCommand('sketchprompt.newSketch', async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('Please open a workspace folder to use SketchPrompt.');
			return;
		}
		const rootPath = workspaceFolders[0].uri.fsPath;
		const sketchesFolder = path.join(rootPath, 'SketchPrompt');
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
		await vscode.commands.executeCommand('vscode.openWith', fileUri, 'sketchprompt.editor');
	});
	context.subscriptions.push(newSketchDisposable);

	// Register the help command to open Help.md
	let helpDisposable = vscode.commands.registerCommand('sketchprompt.help', async () => {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders) {
			vscode.window.showErrorMessage('Please open a workspace folder to use SketchPrompt.');
			return;
		}
		const rootPath = workspaceFolders[0].uri.fsPath;
		const helpPath = path.join(rootPath, 'Help.md');
		if (!fs.existsSync(helpPath)) {
			fs.writeFileSync(helpPath, '# SketchPrompt Help\n\nHelp content coming soon.');
		}
		const helpUri = vscode.Uri.file(helpPath);
		await vscode.commands.executeCommand('vscode.open', helpUri);
	});
	context.subscriptions.push(helpDisposable);

	// Register the custom editor for .sketchprompt files
	const customEditorProvider = vscode.window.registerCustomEditorProvider(
		SketchPromptCustomEditor.viewType,
		new SketchPromptCustomEditor(context)
	);
	context.subscriptions.push(customEditorProvider);
}

export function deactivate() {} 