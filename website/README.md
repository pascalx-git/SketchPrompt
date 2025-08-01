# SketchPrompt Website

This is the marketing website for SketchPrompt, a powerful VS Code extension for visual thinking and AI prompting—best used for quickly sketching ideas and intent to make human-AI collaboration more seamless. Works in any OpenVSX-compatible editor (Cursor IDE, Windsurf, Google Firebase Studio, etc).

## Quick Start

1. **Local Development**
   ```bash
   # Navigate to the website directory
   cd website
   
   # Open index.html in your browser
   open index.html
   # Or use a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Create a new repository for the website
   git init
   git add .
   git commit -m "Initial website commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/sketchprompt-website.git
   git push -u origin main
   
   # Enable GitHub Pages in repository settings
   # Go to Settings > Pages > Source > Deploy from a branch
   # Select main branch and / (root) folder
   ```

3. **Custom Domain Setup**
   - Purchase `sketch-prompt.com` from your domain registrar
   - In your domain registrar's DNS settings, add these records:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     Value: 185.199.109.153
     Value: 185.199.110.153
     Value: 185.199.111.153
     ```
   - In GitHub repository settings, go to Pages and add your custom domain
   - Check "Enforce HTTPS" option

## File Structure

```
website/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── images/             # Image assets
│   ├── logo.png        # SketchPrompt logo
│   ├── favicon.png     # Favicon
│   ├── hero-screenshot.png  # Hero section screenshot (placeholder)
│   ├── usage-demo.png  # Usage demonstration image (placeholder)
│   └── og-image.png    # Open Graph image for social sharing (placeholder)
└── README.md           # This file
```

## Customization

### Colors
The website uses CSS custom properties for easy color customization. Edit the `:root` section in `styles.css`:

```css
:root {
    --primary-color: #3b82f6;
    --primary-dark: #2563eb;
    --secondary-color: #06b6d4;
    --accent-color: #8b5cf6;
}
```

### Content Updates
- **Hero Section**: Update the main headline and description in `index.html`
- **Features**: Modify the feature cards to reflect current capabilities
- **Installation**: Update installation steps as the extension evolves
- **Roadmap**: Keep the development timeline current

## Missing Images

The following images are currently placeholders and need to be created:
- `hero-screenshot.png` - Screenshot of SketchPrompt in action
- `usage-demo.png` - Demonstration of usage workflow
- `og-image.png` - Open Graph image for social sharing
- `visual-thinking-illustration.svg` - Hero illustration

## Development Notes

### Current State
- Responsive design with modern CSS
- Interactive JavaScript features
- Development status banner
- Accurate installation instructions
- Missing hero screenshot
- Missing usage demo images
- Missing social sharing images

### Next Steps
1. Create actual screenshots of SketchPrompt in action
2. Add usage demonstration images
3. Create social sharing images
4. Update content as features are completed
5. Add analytics tracking
6. Optimize for performance

## Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure custom domain if desired

### Netlify
1. Connect GitHub repository to Netlify
2. Configure build settings (not needed for static site)
3. Deploy automatically on push

### Vercel
1. Import GitHub repository to Vercel
2. Configure as static site
3. Deploy automatically on push

## Analytics

Consider adding analytics to track website performance:
- Google Analytics
- Plausible Analytics
- Simple Analytics

## SEO

The website includes:
- Meta tags for social sharing
- Open Graph tags
- Twitter Card tags
- Semantic HTML structure
- Fast loading times

## Mobile Optimization

The website is fully responsive and optimized for:
- Mobile devices
- Tablets
- Desktop computers
- Various screen sizes

## Performance

Optimizations include:
- Minified CSS and JavaScript
- Optimized images
- Fast loading times
- Efficient animations
- Progressive enhancement 