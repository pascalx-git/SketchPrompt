import * as vscode from 'vscode';
import { SketchPromptCustomEditor } from './SketchPromptCustomEditor';
import * as path from 'path';
import * as fs from 'fs';

// Security function to validate file paths and prevent path traversal
function validateFilePath(basePath: string, userPath: string): string {
	const resolvedBase = path.resolve(basePath);
	const resolvedPath = path.resolve(basePath, userPath);
	
	// Ensure the resolved path is within the base directory
	if (!resolvedPath.startsWith(resolvedBase + path.sep) && resolvedPath !== resolvedBase) {
		throw new Error('Invalid file path: Path traversal detected');
	}
	
	// Additional validation: ensure the filename is safe
	const filename = path.basename(userPath);
	if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
		throw new Error('Invalid filename: Contains unsafe characters');
	}
	
	return resolvedPath;
}

// Feedback collection utilities
class FeedbackManager {
	private static readonly FEEDBACK_URL = 'https://form.typeform.com/to/uaM98Tzb';
	private static readonly USAGE_COUNT_KEY = 'sketchprompt.usageCount';
	
	constructor(private context: vscode.ExtensionContext) {}
	
	// Track usage for analytics (auto-prompting moved to backlog)
	async trackUsage(): Promise<void> {
		const usageCount = this.context.globalState.get(FeedbackManager.USAGE_COUNT_KEY, 0) + 1;
		await this.context.globalState.update(FeedbackManager.USAGE_COUNT_KEY, usageCount);
		
	}
	
	// Manual feedback command
	async requestFeedback(): Promise<void> {
		await this.openFeedbackForm();
	}
	
	// Open feedback form in browser
	async openFeedbackForm(): Promise<void> {
		await vscode.env.openExternal(vscode.Uri.parse(FeedbackManager.FEEDBACK_URL));
	}
}

// Create demo sketch content to show users what they can do
// This function returns the demo content by reading from the bundled resource or workspace
async function createDemoSketchContent(context: vscode.ExtensionContext): Promise<any> {
	// First, try to read from the workspace root (for development)
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const rootPath = workspaceFolders[0].uri.fsPath;
		const demoTemplatePath = path.join(rootPath, 'SketchPrompt', 'demo.sketchprompt');
		
		if (fs.existsSync(demoTemplatePath)) {
			try {
				const demoContent = fs.readFileSync(demoTemplatePath, 'utf8');
				return JSON.parse(demoContent);
			} catch (error) {
				console.error('Failed to read demo template from workspace:', error);
			}
		}
	}
	
	// Try to read from bundled resources (for production)
	try {
		const demoResourceUri = vscode.Uri.joinPath(context.extensionUri, 'resources', 'demo.sketchprompt');
		const demoContentBytes = await vscode.workspace.fs.readFile(demoResourceUri);
		const demoContent = Buffer.from(demoContentBytes).toString('utf8');
		return JSON.parse(demoContent);
	} catch (error) {
		console.error('Failed to read demo template from resources:', error);
	}
	
	// Fallback: Return empty object if demo file doesn't exist
	return {
		document: {
			store: {},
			schema: {
				schemaVersion: 2,
				sequences: {}
			}
		},
		session: {
			version: 0,
			currentPageId: "page:page",
			exportBackground: true,
			isFocusMode: false,
			isDebugMode: false,
			isToolLocked: false,
			isGridMode: false,
			pageStates: [
				{
					pageId: "page:page",
					camera: { x: 0, y: 0, z: 1 },
					selectedShapeIds: [],
					focusedGroupId: null
				}
			]
		}
	};
}

export async function activate(context: vscode.ExtensionContext) {
	// Store custom editor instances
	const customEditorInstances = new Map<string, SketchPromptCustomEditor>();

	// Initialize feedback manager
	const feedbackManager = new FeedbackManager(context);

	// On activation, ensure SketchPrompt folder exists and create demo file if needed
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders) {
		const rootPath = workspaceFolders[0].uri.fsPath;
		const sketchesFolder = path.join(rootPath, 'SketchPrompt');
		if (!fs.existsSync(sketchesFolder)) {
			fs.mkdirSync(sketchesFolder);
		}
		
		// Create demo.sketchprompt file with prefilled content to show users what they can do
		// Only create it if it doesn't already exist
		const demoPath = path.join(sketchesFolder, 'demo.sketchprompt');
		if (!fs.existsSync(demoPath)) {
			try {
				const validatedDemoPath = validateFilePath(sketchesFolder, 'demo.sketchprompt');
				const demoContent = await createDemoSketchContent(context);
				fs.writeFileSync(validatedDemoPath, JSON.stringify(demoContent, null, 2));
			} catch (error) {
				console.error('Failed to create demo sketch file:', error);
			}
		}
	}

	// Register the command to create a new sketch
	let newSketchDisposable = vscode.commands.registerCommand('sketchprompt.newSketch', async () => {
		// Track usage for feedback
		await feedbackManager.trackUsage();
		
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
			try {
				const filename = `Untitled-${i}.sketchprompt`;
				filePath = validateFilePath(sketchesFolder, filename);
				if (!fs.existsSync(filePath)) break;
				i++;
			} catch (error) {
				vscode.window.showErrorMessage(`Failed to create sketch file: ${error}`);
				return;
			}
		}
		// Write empty JSON to file
		fs.writeFileSync(filePath, JSON.stringify({}));
		const fileUri = vscode.Uri.file(filePath);
		
		// Open the new sketch file
		await vscode.commands.executeCommand('vscode.open', fileUri);
		

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

	// Register feedback command
	let feedbackDisposable = vscode.commands.registerCommand('sketchprompt.feedback', async () => {
		await feedbackManager.requestFeedback();
	});
	context.subscriptions.push(feedbackDisposable);

	// Register generate preview command
	let generatePreviewDisposable = vscode.commands.registerCommand('sketchprompt.generatePreview', async () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor || !activeEditor.document.fileName.endsWith('.sketchprompt')) {
			vscode.window.showErrorMessage('Please open a .sketchprompt file to generate a preview.');
			return;
		}

		// Find the custom editor instance for this document
		const customEditor = customEditorInstances.get(activeEditor.document.uri.toString());

		if (customEditor) {
			// Send message to trigger preview generation
			customEditor.sendMessageToWebview({ type: 'generatePreview' });
			vscode.window.showInformationMessage('Generating AI preview...');
		} else {
			vscode.window.showErrorMessage('SketchPrompt editor not found. Please open the file in SketchPrompt editor.');
		}
	});
	context.subscriptions.push(generatePreviewDisposable);

	// Register the custom editor for .sketchprompt files
	const customEditorProvider = vscode.window.registerCustomEditorProvider(
		SketchPromptCustomEditor.viewType,
		new SketchPromptCustomEditor(context, customEditorInstances)
	);
	context.subscriptions.push(customEditorProvider);
}

export function deactivate() {} 