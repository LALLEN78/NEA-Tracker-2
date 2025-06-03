#!/bin/bash

# Build script for NEA Tracker static export

echo "🚀 Building NEA Tracker as static HTML..."

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the static export
echo "🔨 Building static files..."
npm run build-static

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Static files are in the 'out' directory"
    echo ""
    echo "To test locally, run: npm run serve-static"
    echo "To deploy, upload the 'out' directory to your web server"
else
    echo "❌ Build failed!"
    exit 1
fi
