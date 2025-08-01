# SketchPrompt Brand Guidelines

## Core Messaging

### Primary Description
**Visual thinking for coding with AI. Sketch ideas and use them in your prompts to improve your workflow with AI models. Works in OpenVSX-compatible editors like Cursor, Windsurf, Firebase Studio, etc.**

### Alternative Descriptions (for different contexts)

#### Short Version
**Visual thinking for coding with AI**

#### Medium Version  
**Visual thinking for coding with AI. Sketch ideas and use them in your prompts to improve your workflow with AI models.**

#### Long Version
**Visual thinking for coding with AI. Sketch ideas and use them in your prompts to improve your workflow with AI models. Works in OpenVSX-compatible editors like Cursor, Windsurf, Firebase Studio, etc.**

### When to Use Each Version
- **Primary Description**: README, package.json, website hero, marketplace listings
- **Short Version**: Headlines, titles, badges
- **Medium Version**: Social media, brief descriptions
- **Long Version**: Detailed documentation, help files

### What NOT to Lead With
- ❌ "VS Code extension" (gives too much credit to VS Code)
- ❌ "Powerful" (overused, not specific)
- ❌ "Best used for" (redundant)
- ❌ "Sketch > Copy > Paste" (too technical)

### What to Emphasize
- ✅ "Visual thinking" (unique value)
- ✅ "Coding with AI" (clear use case)
- ✅ "Improve workflow" (benefit-focused)
- ✅ "OpenVSX-compatible" (technical accuracy)

### Key Value Propositions
- **Visual thinking** - Emphasize the visual aspect
- **Coding with AI** - Clear use case for developers
- **Sketch ideas** - Simple, actionable benefit
- **Improve workflow** - Focus on productivity
- **OpenVSX-compatible** - Technical compatibility

### Editor Compatibility
**Works in OpenVSX-compatible editors like Cursor, Windsurf, Firebase Studio, etc.**

### Target Audience
- Developers who use AI coding assistants
- Visual thinkers and designers
- Prompt engineers
- Anyone who wants to communicate ideas visually to AI

### Files to Update for Messaging
**These files contain descriptions that need to be updated when messaging changes:**
- `README.md` - Main project description and features
- `package.json` - Extension description for marketplace
- `website/index.html` - Meta tags, hero section, and social sharing
- `HELP.md` - Help documentation description
- `CHANGELOG.md` - Release notes introduction
- `SECURITY.md` - Security documentation header
- `.steer/SECURITY_ANALYSIS_REPORT.md` - Security analysis description
- `website/README.md` - Website documentation

## Visual Brand Identity

### Color Palette
```css
/* Primary Colors */
--primary-color: #3b82f6;      /* Blue - Primary brand color */
--primary-dark: #2563eb;       /* Darker blue - Hover states */
--secondary-color: #06b6d4;    /* Cyan - Secondary actions */
--accent-color: #8b5cf6;       /* Purple - Accent elements */

/* Neutral Colors */
--border-color: #e5e7eb;       /* Light gray - Borders */
--text-primary: #1f2937;       /* Dark gray - Primary text */
--text-secondary: #6b7280;     /* Medium gray - Secondary text */
--bg-primary: #ffffff;         /* White - Primary background */
--bg-secondary: #f9fafb;       /* Light gray - Secondary background */
```

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700
- **Headings**: 600-700 weight
- **Body Text**: 400 weight
- **Small Text**: 300 weight

### Design Elements

#### Buttons
- **Primary**: Blue background (`--primary-color`)
- **Secondary**: White background with blue border
- **Hover States**: Darker blue (`--primary-dark`)
- **Border Radius**: `0.5rem` (8px)
- **Padding**: `0.75rem 1.5rem`

#### Cards
- **Background**: White (`--bg-primary`)
- **Border**: Light gray (`--border-color`)
- **Border Radius**: `1rem` (16px)
- **Shadow**: Subtle drop shadow
- **Padding**: `1.5rem`

#### Icons
- **Primary Icons**: Blue (`--primary-color`)
- **Secondary Icons**: Cyan (`--secondary-color`)
- **Accent Icons**: Purple (`--accent-color`)
- **Size**: 24px (1.5rem) for feature icons

### Spacing System
```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 0.75rem;  /* 12px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
--spacing-2xl: 3rem;    /* 48px */
```

### Border Radius System
```css
--radius-sm: 0.375rem;  /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
```

### Files to Update for Visual Brand
**These files contain visual brand elements that need to be maintained:**
- `website/styles.css` - Main CSS with brand variables and design system
- `media/logo.png` - Primary logo for extension and website
- `media/logo.svg` - Vector logo for scalable use
- `website/images/` - All brand images, screenshots, and visual assets
- `media/logo-icon.png` - Extension icon for marketplace

## Version Control

### Last Updated
- **Date**: July 31 2025
- **Version**: 0.2.4
- **Description**: Updated to focus on visual thinking for AI coding workflows

### Next Review
- Review descriptions during each release process
- Update when new features change positioning
- Ensure consistency across all platforms 