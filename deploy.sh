#!/bin/bash

# Golf Tournament Netlify Deployment Script

echo "🚀 Preparing for Netlify deployment..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors before deploying."
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=.next

echo "🎉 Deployment complete!"
echo "📝 Remember to set environment variables in Netlify dashboard:"
echo "   - Go to Site Settings > Environment Variables"
echo "   - Add all variables from .env.example"