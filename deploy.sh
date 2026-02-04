#!/bin/bash

echo "🚀 Chess Renaissance Deployment"
echo "==============================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Installation failed"
    exit 1
fi

# Build
echo "🔨 Building..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful!"
echo "🌐 Deploy to Vercel: vercel --prod"
echo ""
echo "♔ The Magister awaits..."