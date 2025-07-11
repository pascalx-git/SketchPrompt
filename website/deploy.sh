#!/bin/bash

# SketchPrompt Website Deployment Script
# This script helps you deploy the website to GitHub Pages

echo "🚀 SketchPrompt Website Deployment"
echo "=================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the website directory
if [ ! -f "index.html" ]; then
    echo "❌ Please run this script from the website directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Initialize git repository if not already done
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .
echo "✅ Files added"

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update SketchPrompt website"
echo "✅ Changes committed"

# Check if remote origin exists
if ! git remote get-url origin &> /dev/null; then
    echo ""
    echo "🌐 Setting up remote repository..."
    git remote add origin https://github.com/pascalx-git/SketchPrompt-Website.git
    echo "✅ Remote repository configured"
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main
echo "✅ Website pushed to GitHub"

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/pascalx-git/SketchPrompt-Website"
echo "2. Navigate to Settings > Pages"
echo "3. Set Source to 'Deploy from a branch'"
echo "4. Select 'main' branch and '/' folder"
echo "5. Click Save"
echo ""
echo "🌐 Your website will be available at:"
echo "   https://pascalx-git.github.io/SketchPrompt-Website"
echo ""
echo "🔗 For custom domain (sketch-prompt.com):"
echo "1. Purchase the domain"
echo "2. Add DNS records pointing to GitHub Pages"
echo "3. Add custom domain in GitHub repository settings"
echo "4. Enable HTTPS"
echo ""
echo "📸 Don't forget to replace placeholder images with actual screenshots!" 