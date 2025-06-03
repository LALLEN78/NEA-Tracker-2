# Building NEA Tracker as Static HTML

This guide explains how to build the NEA Tracker application as static HTML files that can be hosted anywhere without requiring a Node.js server.

## Prerequisites

Make sure you have Node.js installed on your computer.

## Build Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Build Static Version
\`\`\`bash
npm run build-static
\`\`\`

This will create an `out` folder containing all the static HTML files.

### 3. Test Locally (Optional)
\`\`\`bash
npm run serve-static
\`\`\`

This will serve the static files locally for testing.

## Output Structure

After building, you'll find these files in the `out` directory:

\`\`\`
out/
├── index.html                 # Home page
├── dashboard/
│   └── index.html            # Dashboard page
├── students/
│   └── index.html            # Students page
├── progress/
│   └── index.html            # Progress page
├── moderation/
│   └── index.html            # Moderation page
├── nea-page-tracker/
│   └── index.html            # NEA Page Tracker
├── _next/                    # Static assets (CSS, JS, images)
├── icons/                    # App icons
├── manifest.json             # PWA manifest
└── sw.js                     # Service worker
\`\`\`

## Deployment Options

### Option 1: Web Server
Upload the entire `out` folder to any web server (Apache, Nginx, etc.)

### Option 2: GitHub Pages
1. Push the `out` folder contents to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Your app will be available at `https://username.github.io/repository-name`

### Option 3: Netlify/Vercel
1. Drag and drop the `out` folder to Netlify or Vercel
2. Your app will be deployed automatically

### Option 4: Local Network
Serve the files on your local network for school use:
\`\`\`bash
# Install a simple HTTP server
npm install -g http-server

# Serve the files
cd out
http-server -p 8080

# Access at http://your-ip:8080
\`\`\`

## Features Preserved

All functionality is preserved in the static build:
- ✅ Offline functionality
- ✅ Data persistence (localStorage)
- ✅ PWA installation
- ✅ Print functionality
- ✅ Dual-screen support
- ✅ All interactive features

## File Sizes

The static build is optimized and typically results in:
- Total size: ~2-5 MB
- Initial load: ~500KB-1MB
- Subsequent pages: ~50-200KB

## Browser Compatibility

The static build works in all modern browsers:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Troubleshooting

### Images not loading
Make sure all image paths are relative and don't start with `/`

### Service Worker issues
The service worker will only work over HTTPS or localhost

### Data not persisting
Ensure localStorage is enabled in the browser

## Security Notes

- All data is stored locally in the browser
- No server-side processing
- Safe to use on any network
- No external dependencies at runtime
