# SketchPrompt AI Collaboration MVP

## Executive Summary

Based on analysis of current codebase, existing documentation, and AI collaboration research, this document outlines the **MVP implementation plan** for AI-human sketching collaboration in SketchPrompt. The core challenge: **AI models struggle to understand visual sketches stored as TLDraw JSON without requiring manual screenshots**.

## Current Foundation Assessment

### Strengths ✅
- **TLDraw v3.13.4**: Latest version with robust export capabilities
- **Solid Architecture**: Content-aware auto-save, file-watching, security hardening
- **VS Code Integration**: Custom editor with webview communication established
- **File Format**: Structured `.sketchprompt` JSON format ready for AI analysis
- **Export Infrastructure**: Basic "Copy to Prompt" functionality exists

### Gaps Identified ⚠️
- **Visual→AI Bridge**: No automatic image generation for AI consumption
- **Scene Understanding**: JSON data not AI-digestible without manual interpretation
- **Real-time Integration**: No AI feedback loop during sketching process
- **Context Awareness**: Limited integration with Cursor's AI chat system

## Three-Phase Implementation Strategy

### Phase 1: Auto-Screenshot MVP (IMMEDIATE - Weeks)
**Goal**: Enable AI to "see" sketches without manual screenshots

#### Core Implementation
```typescript
interface SketchExportService {
  generatePreview(editor: Editor): Promise<{
    imageBlob: Blob;
    imageUrl: string;
    metadata: SketchMetadata;
  }>;
  
  savePreviewToWorkspace(preview: PreviewData): Promise<string>;
  
  generateMarkdownReference(imagePath: string, metadata: SketchMetadata): string;
}
```

#### Technical Approach
1. **Auto-Preview Generation**
   - Hook into existing `editor.store.listen()` in `sketching-app.tsx`
   - Use TLDraw's `editor.exportAs('png', shapes, opts)` API
   - Debounce preview generation (2-3 seconds after last change)
   - Save preview as `.sketchprompt/preview.png` in workspace

2. **Integration Points**
   - Extend existing `handleMount()` in `sketching-app.tsx`
   - Add preview generation to existing auto-save pipeline
   - Update `SketchPromptCustomEditor.ts` to handle preview requests

3. **User Experience**
   - Status bar shows "Generating AI preview..." during export
   - Preview automatically referenced in markdown format
   - One-click "Copy Sketch + Preview to Clipboard" command

#### Expected Output
```markdown
## Sketch: Login Flow Wireframe
![Sketch Preview](./.sketchprompt/login-wireframe-preview.png)

*Auto-generated preview of sketch containing 5 shapes, last updated 2 minutes ago*
```

#### Performance Considerations
- **Debounced Generation**: Only generate previews after 2-3 seconds of inactivity
- **Size Optimization**: Export at reasonable resolution (1200px max width)
- **Background Processing**: Use web workers for image generation if needed
- **Cache Management**: Clean up old previews (keep last 5)

#### Security Considerations
- **File Path Validation**: Reuse existing `validateFilePath()` function
- **Resource Limits**: Limit preview file sizes and generation frequency
- **Privacy**: All processing remains local, no external service calls

### Phase 2: Smart Scene Analysis (MEDIUM - Months)
**Goal**: Generate AI-digestible descriptions of sketch content

#### Scene Graph Parser
```typescript
interface SceneAnalyzer {
  analyzeSketch(snapshot: TLDrawSnapshot): SketchAnalysis;
  generateDescription(analysis: SketchAnalysis): string;
  extractRelationships(shapes: TLShape[]): ShapeRelationship[];
}

interface SketchAnalysis {
  shapeCount: number;
  shapeTypes: Record<string, number>;
  textContent: string[];
  spatialRelationships: ShapeRelationship[];
  layoutType: 'freeform' | 'flowchart' | 'wireframe' | 'diagram';
  complexity: 'simple' | 'moderate' | 'complex';
}
```

#### Implementation Details
1. **Shape Analysis**
   - Parse TLDraw JSON to extract shape types, positions, connections
   - Identify text content, arrows, groupings
   - Detect common patterns (flowcharts, wireframes, mind maps)

2. **Natural Language Generation**
   - Template-based description generation
   - "This sketch contains 3 rectangles labeled 'Login', 'Dashboard', 'Profile' connected by arrows indicating user flow"
   - Spatial relationship descriptions ("Login form in top-left, navigation below")

3. **Context Integration**
   - Combine image + description in single markdown block
   - Include metadata: creation time, file name, shape count
   - Optional: GPT-powered description enhancement (user preference)

#### Example Output
```markdown
## Sketch Analysis: User Authentication Flow

![Sketch Preview](./.sketchprompt/auth-flow-preview.png)

**Description**: This wireframe sketch shows a user authentication flow with 4 main screens connected by directional arrows. The flow begins with a login form (top-left) containing username and password fields, leads to a dashboard view (center) with navigation elements, branches to a profile page (right) and settings screen (bottom). The sketch uses a clean, structured layout typical of mobile app wireframing.

**Details**: 8 shapes total • 4 text elements • 3 arrow connections • Last modified: 5 minutes ago
```

### Phase 3: AI Collaboration Layer (ADVANCED - Later)
**Goal**: Enable AI to modify and interact with sketches

#### Architecture
```typescript
interface AICollaborationService {
  analyzeIntent(prompt: string, currentSketch: TLDrawSnapshot): AIAction[];
  applyAISuggestions(editor: Editor, actions: AIAction[]): Promise<void>;
  generateSketchFromPrompt(prompt: string): Promise<TLDrawSnapshot>;
}

interface AIAction {
  type: 'add_shape' | 'modify_shape' | 'add_annotation' | 'restructure';
  target?: TLShapeId;
  changes: Partial<TLShape>;
  reasoning: string;
}
```

#### Implementation Phases
1. **AI Layer Integration** (Weeks 1-2)
   - Create AI service interface
   - Add AI-triggered change detection to existing file-watching system
   - Implement visual indicators for AI modifications

2. **Intelligent Suggestions** (Weeks 3-4)
   - Parse user prompts: "Add a payment gateway between login and dashboard"
   - Generate TLDraw shape modifications
   - Apply changes with clear visual differentiation (AI layer)

3. **Bidirectional Communication** (Weeks 5-6)
   - AI can analyze sketch and suggest improvements
   - User can accept/reject AI suggestions
   - Version control for AI-assisted changes

## MVP Implementation Plan (Phase 1)

### Week 1: Core Infrastructure
- [ ] Add TLDraw export service to webview
- [ ] Implement debounced preview generation
- [ ] Create workspace preview directory management
- [ ] Update status bar for preview generation feedback

### Week 2: Integration & Testing
- [ ] Hook preview generation into existing auto-save pipeline
- [ ] Add "Copy Sketch + Preview" command
- [ ] Implement markdown reference generation
- [ ] Performance testing and optimization

### Week 3: Polish & Documentation
- [ ] Error handling and recovery
- [ ] User settings for preview preferences
- [ ] Update help documentation
- [ ] Integration testing with Cursor Chat

### Technical Implementation Details

#### TLDraw Export Integration
```typescript
// In sketching-app.tsx
const generatePreview = useCallback(async () => {
  if (!editorRef.current) return;
  
  try {
    const shapes = editorRef.current.getCurrentPageShapes();
    const blob = await editorRef.current.exportAs('png', shapes, {
      format: 'png',
      padding: 32,
      scale: 2,
      background: true
    });
    
    // Send to extension for file management
    vscode?.postMessage({
      type: 'savePreview',
      data: { blob, timestamp: Date.now() }
    });
  } catch (error) {
    console.error('Preview generation failed:', error);
  }
}, []);

// Debounced preview generation
const debouncedPreviewGeneration = useCallback(
  debounce(generatePreview, 2000),
  [generatePreview]
);
```

#### Extension-Side Preview Management
```typescript
// In SketchPromptCustomEditor.ts
case 'savePreview': {
  const { blob, timestamp } = message.data;
  const previewPath = await this.savePreviewImage(blob, document.uri, timestamp);
  const markdownRef = this.generateMarkdownReference(previewPath);
  
  // Update status bar
  this.updateStatusBar('$(camera) Preview Generated', 'AI-ready sketch preview created');
  break;
}
```

### Risk Mitigation

#### Performance Risks
- **Large Sketches**: Implement size limits and progressive loading
- **Frequent Updates**: Smart debouncing and change detection
- **Memory Usage**: Automatic cleanup of old previews

#### UX Risks  
- **Preview Lag**: Clear visual feedback during generation
- **File Clutter**: Organized preview directory structure
- **Integration Friction**: Seamless workflow integration

#### Security Risks
- **File System Access**: Reuse existing path validation
- **Resource Exhaustion**: Rate limiting and size constraints
- **Data Leakage**: Local-only processing guaranteed

### Success Metrics

#### Phase 1 Success Criteria
- [ ] Previews generate within 3 seconds of sketch changes
- [ ] Zero external dependencies or network calls
- [ ] Seamless integration with existing auto-save system
- [ ] Clear visual feedback during preview generation
- [ ] Markdown references work correctly in Cursor Chat

## Future Considerations

### AI Model Integration
- **Local AI**: Consider local models for privacy-first analysis
- **API Integration**: Optional cloud-based enhancement services
- **Multi-modal**: Combine visual + text understanding

### Advanced Features
- **Real-time Collaboration**: Build on existing multiplayer architecture
- **Version Control**: AI-aware sketch versioning
- **Context Awareness**: Integration with project files and AI chat history

### Monetization Alignment
- **Free**: Auto-preview generation (Phase 1)
- **Premium**: Advanced AI analysis and suggestions (Phases 2-3)
- **Enterprise**: Multi-user AI collaboration features

## Conclusion

This MVP implementation plan builds on SketchPrompt's solid foundation while addressing the core AI integration challenge. The auto-screenshot MVP (Phase 1) provides immediate value with minimal risk, while later phases enable advanced AI collaboration. The approach maintains SketchPrompt's privacy-first principles while creating a compelling differentiator in the AI coding tools market.

**Ready to Implement**: This document provides the complete roadmap for Phase 1 MVP. Begin with TLDraw export API research, then implement the debounced preview generation system.