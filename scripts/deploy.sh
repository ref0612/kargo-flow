#!/bin/bash
# Pre-deployment script for Vercel
# Ensures all optimizations are in place

echo "🚀 Preparing Kargo Flow for Vercel deployment..."

# Check Node version
echo "✅ Node version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --prefer-offline

# Lint check
echo "🔍 Running linter..."
npm run lint --max-warnings 0

# Build
echo "🏗️  Building project..."
npm run build

# Check build output
if [ -d "dist" ]; then
    echo "✅ Build output directory created successfully"
    echo "📊 Build size: $(du -sh dist | cut -f1)"
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✨ Ready for deployment!"
