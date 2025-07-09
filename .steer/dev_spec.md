# SketchPrompt — Developer Specification (Cursor IDE Only)

## Purpose
SketchPrompt is a TLDraw-powered sketching extension built **specifically for Cursor IDE**. It enables visual thinkers — especially hybrid UX/design/AI professionals — to sketch, ideate, and communicate inside their AI coding workflow.

Unlike VS Code, which already has a TLDraw extension, Cursor currently has no native or third-party sketching integration. **SketchPrompt fills that void.**

---

## Target Platform
- **Platform:** Cursor IDE — https://www.cursor.sh  
- **Format:** VS Code-compatible extension (VSIX)  
- **Tested in:** Cursor Extension Development Host

---

## Core Tech Stack
- [TLDraw](https://tldraw.dev) — embedded sketching canvas (React)
- TypeScript
- VS Code Webview + WebviewViewProvider
- VSCE (Visual Studio Code Extension Manager) for packaging

---

## Project Structure
```
sketchprompt/
├── .vscode/                 # Dev configs
├── src/
│   ├── extension.ts         # Entry point (registers webview)
│   └── panel/               # Webview + sketching logic
├── media/
│   └── tldraw.html          # Prebuilt TLDraw app
├── package.json             # Manifest
└── tsconfig.json            # TypeScript config
```

---

## MVP Functionality
- [x] Launch via Cursor command palette (`SketchPrompt: Open Canvas`)
- [x] Display TLDraw canvas in sidebar or panel
- [x] Save sketches locally (.json, .png, .svg)
- [x] Inject sketch reference/image into Cursor prompt editor
- [x] Light/dark theme awareness

---

## User Flow
1. User runs `SketchPrompt: Open Canvas`
2. TLDraw canvas loads inside Cursor
3. User sketches UI idea, flow, or concept
4. Clicks "Copy to Prompt"
5. Markdown image reference or prompt snippet is injected into editor

---

## Manifest Snippet (`package.json`)
```json
{
  "contributes": {
    "commands": [
      {
        "command": "sketchprompt.openSketch",
        "title": "Open SketchPrompt Canvas"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "sketchPromptSidebar",
          "title": "SketchPrompt",
          "icon": "media/icon.svg"
        }
      ]
    },
    "views": {
      "sketchPromptSidebar": [
        {
          "id": "sketchPromptView",
          "name": "Canvas"
        }
      ]
    }
  }
}
```

---

## Future Dev Targets
- [ ] AI-generated prompt suggestions from sketch
- [ ] Sketch history + versioning
- [ ] GitHub sync / export-to-readme
- [ ] Shared sketch links (cloud sync)
- [ ] Inline sticky notes / annotations

---

## Monetization Strategy
- **Free tier:** basic sketch + prompt injection
- **Premium upgrades:**
  - Multiple canvases
  - AI-powered captioning
  - Export-to-Git
  - Team sketch collaboration

---

## Reference Links
- [TLDraw Quick Start](https://tldraw.dev/quick-start)
- [Cursor Docs](https://docs.cursor.sh)
- [VS Code Webview API](https://code.visualstudio.com/api/extension-guides/webview)

---

Ready to bring visual thinking to the AI-native dev world.
