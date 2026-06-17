#!/bin/bash

# Script to verify Vercel deployment readiness
# Run this before pushing to verify everything is configured correctly

set -e

echo "🔍 Vercel Deployment Readiness Check"
echo "===================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Found directory: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing directory: $1"
        return 1
    fi
}

# 1. Configuration files
echo "📋 Checking configuration files..."
check_file "vercel.json"
check_file "package.json"
check_file "vite.config.ts"
check_file ".nvmrc"
check_file ".vercelignore"
check_file ".env.example"
echo ""

# 2. Source files
echo "📁 Checking source structure..."
check_dir "src"
check_file "src/server.ts"
check_file "src/start.ts"
check_file "src/routes/__root.tsx"
echo ""

# 3. Build capability
echo "🔨 Checking build capability..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not installed"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not installed"
fi
echo ""

# 4. Dependencies
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC}  Dependencies not installed (run: npm ci)"
fi
echo ""

# 5. Scripts
echo "📜 Checking package.json scripts..."
if grep -q '"vercel-build"' package.json; then
    echo -e "${GREEN}✓${NC} vercel-build script configured"
else
    echo -e "${YELLOW}⚠${NC}  vercel-build script missing (optional)"
fi
echo ""

# 6. Environment
echo "🌍 Checking environment setup..."
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} .env.example exists"
    echo "   Configured variables:"
    grep "^[^#]" .env.example | sed 's/^/   - /'
else
    echo -e "${RED}✗${NC} .env.example missing"
fi
echo ""

# 7. Git status
echo "🔗 Checking Git status..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
    
    # Check for uncommitted changes
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} Working directory clean"
    else
        echo -e "${YELLOW}⚠${NC}  Uncommitted changes detected"
        git status --short | head -5
    fi
else
    echo -e "${RED}✗${NC} Not a Git repository"
fi
echo ""

# 8. Size check
echo "📊 Checking project size..."
if [ -d "src" ]; then
    SRC_SIZE=$(du -sh src | cut -f1)
    echo "   Source code: $SRC_SIZE"
fi

if [ -d "node_modules" ]; then
    NODE_MODULES_SIZE=$(du -sh node_modules | cut -f1)
    echo "   node_modules: $NODE_MODULES_SIZE"
    echo -e "   ${YELLOW}ℹ${NC}  Make sure this doesn't exceed 250MB"
fi
echo ""

# 9. Deployment readiness summary
echo "✨ Deployment Readiness Summary"
echo "==============================="
echo ""

READY=true

if ! check_file "vercel.json" &>/dev/null; then READY=false; fi
if ! check_file "package.json" &>/dev/null; then READY=false; fi
if ! check_file "vite.config.ts" &>/dev/null; then READY=false; fi
if ! check_file ".nvmrc" &>/dev/null; then READY=false; fi

if [ "$READY" = true ]; then
    echo -e "${GREEN}✓ Project is ready for Vercel deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Set environment variables in Vercel dashboard"
    echo "2. Push to main branch: git push origin main"
    echo "3. Vercel will auto-deploy"
    echo "4. Monitor at: https://vercel.com/dashboard"
else
    echo -e "${RED}✗ Project is NOT ready for deployment${NC}"
    echo ""
    echo "Please fix the missing files/directories above and try again."
    exit 1
fi
echo ""
