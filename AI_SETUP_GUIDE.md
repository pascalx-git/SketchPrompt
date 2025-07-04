# SketchPrompt AI Integration - Setup & Usage Guide

## 🚀 Overview

SketchPrompt now includes powerful AI capabilities that allow you to transform your sketches into code, analyze UI designs, and get intelligent insights from your visual diagrams. This guide will help you set up and use these new features.

## 📋 Prerequisites

- Cursor IDE or VS Code
- SketchPrompt extension installed
- OpenAI API key (for AI features)

## ⚙️ Setup Instructions

### 1. Install/Update SketchPrompt

1. Open Cursor IDE
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "SketchPrompt"
4. Install or update to the latest version

### 2. Configure OpenAI API Key

1. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key
   - Copy the key (starts with `sk-`)

2. Configure in SketchPrompt:
   ```
   Method 1 - Settings UI:
   - Open Settings (Ctrl+, / Cmd+,)
   - Search for "SketchPrompt"
   - Paste your API key in "OpenAI API Key" field
   
   Method 2 - Command Palette:
   - Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
   - Type "SketchPrompt: Configure AI Providers"
   - Follow the setup wizard
   ```

### 3. Verify Setup

1. Create a new sketch file (`.sketchprompt`)
2. Draw a simple UI element
3. Click the "🤖 AI Assistant" button
4. Try generating code from your sketch
5. If you see AI responses, setup is complete!

## 🎯 Features & Usage

### Core AI Features

#### 1. **Sketch-to-Code Generation**
Transform your UI sketches into working code:

**Quick Actions:**
- Click **React** for React components
- Click **HTML/CSS** for web layouts
- Click **Analyze** for design feedback

**Custom Prompts:**
- Use the text area for specific requirements
- Example: "Convert this to a Vue.js component with TypeScript"

#### 2. **Smart Templates**
Pre-built prompts for common tasks:

| Template | Use Case | Example Output |
|----------|----------|----------------|
| **React Component** | UI mockups | JSX with hooks and props |
| **HTML/CSS** | Web layouts | Semantic HTML + modern CSS |
| **UI Analysis** | Design review | UX recommendations |
| **Architecture Analysis** | System diagrams | Architecture insights |
| **Database Schema** | Data models | SQL DDL statements |

#### 3. **Intelligent Context**
AI automatically considers:
- Canvas size and layout
- Selected elements vs. full canvas
- Project context (when available)
- Visual hierarchy and relationships

### Using the AI Panel

#### Opening the AI Assistant
1. **In any sketch file**: Click the "🤖 AI Assistant" button in the top-right
2. **Panel appears**: Shows AI controls on the right side

#### AI Panel Components

**Provider Selector:**
- Choose between AI models (currently OpenAI GPT-4)
- View configuration status
- Access provider settings

**Prompt Builder:**
- **Template Dropdown**: Pre-built prompts for common tasks
- **Custom Input**: Write your own specific requirements
- **Selection Toggle**: Use selected elements only
- **Quick Actions**: One-click buttons for common tasks

**Response Viewer:**
- **Formatted View**: Syntax-highlighted code and structured text
- **Raw View**: Plain text response
- **Action Buttons**: Copy, Insert, Regenerate
- **Metadata**: Model info, tokens used, processing time

#### Workflow Examples

**Example 1: Create a React Login Form**
1. Sketch a login form with email, password fields, and submit button
2. Select the form elements
3. Click "React" quick action
4. Review generated JSX code
5. Click "Insert" to add code to active editor

**Example 2: Analyze UI Design**
1. Draw a complex dashboard layout
2. Open AI panel
3. Select "UI Analysis" template
4. Add custom note: "Focus on mobile responsiveness"
5. Click "Generate"
6. Review UX recommendations

**Example 3: Database from Diagram**
1. Create entity relationship diagram
2. Use "Database Schema" template
3. Get SQL CREATE TABLE statements
4. Copy to your database migration file

### Advanced Usage

#### Custom Prompt Engineering
Write effective prompts for better results:

```
Good Prompt Examples:
- "Convert this wireframe to a responsive React component using Tailwind CSS"
- "Analyze this user flow for accessibility issues and suggest improvements"
- "Generate TypeScript interfaces from this data structure diagram"

Tips:
- Be specific about technology stack
- Mention styling frameworks (Tailwind, Bootstrap, etc.)
- Specify accessibility requirements
- Include responsive design needs
```

#### Selection Strategies
- **Full Canvas**: Use for complete layouts or pages
- **Selected Elements**: Focus on specific components
- **Multiple Selections**: Process different sections separately

#### Response Management
- **Copy**: Get code/text to clipboard
- **Insert**: Add directly to active editor
- **Regenerate**: Try again with same prompt
- **History**: Access recent responses

## 🔧 Configuration Options

### AI Settings
Configure via Settings > SketchPrompt:

| Setting | Default | Description |
|---------|---------|-------------|
| `openai.apiKey` | "" | Your OpenAI API key |
| `openai.model` | "gpt-4o" | AI model to use |
| `openai.maxTokens` | 4000 | Maximum response length |
| `openai.temperature` | 0.7 | Creativity level (0-2) |
| `ai.defaultProvider` | "openai" | Default AI provider |
| `ai.autoExportSelection` | true | Auto-use selected elements |

### Model Options
- **gpt-4o**: Best for complex code generation and analysis
- **gpt-4-turbo**: Fast responses for simple tasks
- **gpt-4-vision-preview**: Latest vision capabilities

### Performance Tuning
- **Lower temperature** (0.1-0.3) for deterministic code
- **Higher temperature** (0.7-1.0) for creative solutions
- **Adjust maxTokens** based on response length needs

## 🎨 Best Practices

### Creating Effective Sketches

**For Code Generation:**
- Draw clear, labeled UI elements
- Use consistent shapes for similar components
- Add text labels for functionality
- Show data flow with arrows

**For Analysis:**
- Include complete user flows
- Show different screen states
- Indicate interactions and transitions
- Add annotations for complex features

### Prompt Writing

**Be Specific:**
```
❌ "Make this a component"
✅ "Convert this to a React component with TypeScript, using hooks for state management"
```

**Include Context:**
```
❌ "Analyze this design"
✅ "Analyze this mobile app login screen for accessibility and suggest improvements for users with disabilities"
```

**Specify Output Format:**
```
❌ "Create CSS"
✅ "Generate CSS using flexbox for layout and CSS custom properties for theming"
```

## 🔍 Troubleshooting

### Common Issues

**"API key not configured"**
- Solution: Add your OpenAI API key in settings
- Check: Settings > SketchPrompt > OpenAI API Key

**"Failed to export canvas"**
- Solution: Ensure you have drawn something on the canvas
- Check: Try selecting specific elements before sending to AI

**"AI request failed"**
- Solutions:
  - Check internet connection
  - Verify API key is valid
  - Try again with a simpler prompt
  - Check OpenAI service status

**"No response from AI"**
- Solutions:
  - Wait a moment (responses can take 5-10 seconds)
  - Check if you have sufficient OpenAI credits
  - Try reducing maxTokens in settings

### Error Messages

| Error | Cause | Solution |
|-------|--------|----------|
| `Invalid API key` | Wrong or expired key | Update API key in settings |
| `Rate limit exceeded` | Too many requests | Wait and try again later |
| `Image too large` | Canvas export too big | Select smaller area or simplify sketch |
| `Token limit exceeded` | Response too long | Reduce maxTokens or simplify prompt |

### Performance Tips

**For Faster Responses:**
- Use specific templates instead of custom prompts
- Select smaller canvas areas
- Reduce maxTokens for shorter responses
- Use simpler sketches for quick iterations

**For Better Quality:**
- Provide clear, detailed sketches
- Use descriptive prompts
- Include technology requirements
- Iterate with feedback prompts

## 🔮 Future Features

### Coming Soon
- **Claude 3.5 Sonnet** integration
- **Google Gemini** support
- **Voice-to-sketch** prompting
- **Code-to-sketch** reverse workflow
- **Team prompt templates**
- **Custom model endpoints**

### Planned Enhancements
- Real-time collaboration
- Sketch annotation with AI insights
- Integration with project context
- Advanced prompt templates
- Response versioning
- Batch processing multiple sketches

## 📞 Support

### Getting Help
- **Issues**: Report bugs on GitHub
- **Feature Requests**: Submit via GitHub Issues
- **Questions**: Check existing documentation
- **Community**: Join our Discord/Slack

### Resources
- [Official Documentation](link-to-docs)
- [Video Tutorials](link-to-videos)
- [Example Sketches](link-to-examples)
- [Community Templates](link-to-templates)

---

## 📊 Usage Analytics

The extension collects anonymous usage data to improve features:
- Feature usage frequency
- Error rates and types
- Performance metrics
- Template popularity

No sketch content or personal data is collected. You can opt out in settings.

---

**Happy Sketching with AI! 🎨🤖**

Transform your visual ideas into working code with the power of AI-assisted development.