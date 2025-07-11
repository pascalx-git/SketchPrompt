# Development Guide

## Local Development

### Prerequisites
- Node.js (v16 or higher)
- Cursor IDE
- Git

### Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Compile TypeScript: `npm run compile`
4. Press `F5` in Cursor to launch Extension Development Host

### Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run compile` to build
3. Press `Ctrl+R` (or `Cmd+R`) in the Extension Development Host to reload
4. Test your changes

### Building for Distribution
```bash
npm run compile
npx vsce package
```

This creates a `.vsix` file that can be installed manually in Cursor.

## Publishing to Cursor

### Current Status
Cursor uses its own marketplace for extensions. Extensions can be published directly to Cursor's marketplace.

### Publishing Steps

1. **Build the Extension**
   ```bash
   npm run compile
   npx vsce package
   ```

2. **Manual Installation (Current Method)**
   For immediate testing or distribution:
   1. Build the extension: `npx vsce package`
   2. Share the `.vsix` file
   3. Users can install via Cursor's "Install from VSIX" option

### Future Publishing
When Cursor's marketplace publishing becomes available:
1. Follow Cursor's official publishing guidelines
2. Submit extension for review
3. Publish directly to Cursor's marketplace

## Architecture

### Key Files
- `src/extension.ts` - Main extension entry point
- `src/SketchPromptProvider.ts` - Webview provider for the canvas
- `media/sketching.js` - Frontend sketching logic (using TLDraw for rich features)
- `media/sketching.css` - Styling for the canvas

### Extension Structure
- Uses VS Code's Webview API for the canvas
- Communicates between extension and webview via messages
- Integrates with Cursor's AI chat via text insertion
- Implements rich sketching using TLDraw (with fallback to basic canvas)

## Cursor-Specific Considerations

### Extension Compatibility
- Built specifically for Cursor IDE
- Uses VS Code extension API (which Cursor supports)
- May not work optimally in other VS Code-based editors

### AI Integration
- "Copy to Prompt" feature inserts sketches into Cursor's AI chat
- Leverages Cursor's native prompt interface
- Designed for multimodal AI workflows

### Performance
- Extension is lightweight (10KB packaged)
- Uses efficient webview communication
- Minimal impact on Cursor's performance

## Troubleshooting

### Common Issues
1. **Extension not loading**: Check console for errors, ensure all dependencies are installed
2. **Canvas not appearing**: Verify webview permissions in `package.json`
3. **Build errors**: Run `npm run compile` and check TypeScript errors

### Debug Mode
- Use `F5` to launch in debug mode
- Check Developer Tools in the Extension Development Host
- Monitor console for webview communication errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in Cursor
5. Submit a pull request

### Code Style
- Use TypeScript for all new code
- Follow VS Code extension best practices
- Ensure compatibility with Cursor's extension model
- Keep sketching implementation modular for easy replacement 