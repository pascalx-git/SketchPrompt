# SketchPrompt

A Cursor IDE extension that provides rich sketching capabilities for visual thinking and AI prompting.

## Features

- **Rich Sketching**: Full TLDraw integration with shapes, text, drawing tools, and more
- **Structured Data Understanding**: Cursor can read and analyze the raw JSON structure of `.sketchprompt` files, providing deep semantic understanding beyond just visual content
- **File Persistence**: Save and load sketches as `.sketchprompt` files
- **Copy to Prompt**: Export sketches as images and seamlessly insert them into your prompts
- **Custom Editor**: Dedicated editor for `.sketchprompt` files

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run vscode:prepublish`
4. Package the extension: `npx vsce package`
5. Install the `.vsix` file in Cursor IDE

## Usage

### Creating a New Sketch

1. Open the command palette (`Cmd/Ctrl + Shift + P`)
2. Run "SketchPrompt: New Sketch"
3. A new `.sketchprompt` file will be created in the `sketchprompt` folder
4. The file will open in the SketchPrompt editor

### Using the Panel

1. Open the SketchPrompt panel from the sidebar
2. Use the sketching tools to create your visual
3. Click "Copy to Prompt" to export as an image and insert into your active document
4. Click "Export PNG" to download the sketch as a PNG file

### Working with .sketchprompt Files

- `.sketchprompt` files are automatically opened in the SketchPrompt editor
- Sketches are automatically saved as you work
- Files contain JSON data that can be version controlled

## Development

### Building

```bash
# Build the webview (React app)
npm run build-webview

# Build the extension
npm run compile

# Build both
npm run vscode:prepublish
```

### Watching for Changes

```bash
# Watch webview changes
npm run watch-webview

# Watch extension changes
npm run watch
```

### Testing

1. Press `F5` in VS Code to launch the extension in debug mode
2. Create a new sketch and test the functionality
3. Check the developer console for any errors

## Architecture

- **Extension**: TypeScript-based VS Code extension
- **Webview**: React app with TLDraw integration
- **Build**: Vite for webview bundling, TypeScript for extension compilation

## Dependencies

- `@tldraw/tldraw`: Rich sketching library
- `react` & `react-dom`: UI framework
- `vite`: Build tool for the webview
- `typescript`: Extension development

## License

MIT
