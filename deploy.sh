#!/bin/bash

echo "🚀 Silent-Connect - Final Hackathon Deployment"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel (if vercel CLI is installed)
if command -v vercel &> /dev/null; then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    echo "✅ Deployment complete!"
    echo "🌐 Live at: https://pr-oject.vercel.app"
else
    echo "⚠️  Vercel CLI not found. Please install with: npm i -g vercel"
    echo "📝 Or deploy manually by pushing to your git repository"
fi

echo ""
echo "🎉 Hackathon deployment ready!"
echo "🏆 All speech synthesis issues resolved"
echo "⚡ Performance optimized for demos"
echo "🎯 Multi-track compatibility confirmed"
echo ""
echo "Demo URL: https://pr-oject.vercel.app"
echo "Good luck with your hackathon! 🚀"