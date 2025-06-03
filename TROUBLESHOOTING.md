# Troubleshooting Static Build

## If No 'out' Folder is Created

### Step 1: Run Debug Build
\`\`\`bash
debug-build.bat
\`\`\`

### Step 2: Check Next.js Version
Make sure you're using a compatible Next.js version:
\`\`\`bash
npx next --version
\`\`\`

### Step 3: Manual Build Steps
Try building manually:
\`\`\`bash
# Clean everything
npm run clean

# Install dependencies
npm install

# Build step by step
npx next build
\`\`\`

### Step 4: Check for Errors
Look for these common issues:

1. **TypeScript Errors**: Check for any TypeScript compilation errors
2. **Missing Dependencies**: Ensure all packages are installed
3. **Configuration Issues**: Verify next.config.js is correct

### Step 5: Alternative Build Method
If the above doesn't work, try this alternative:

\`\`\`bash
# Create a simple build script
npx next build && npx next export
\`\`\`

### Step 6: Check Build Output Location
The files might be in a different location:
- Check `.next/` folder
- Check `dist/` folder
- Check `build/` folder

## Common Solutions

### Solution 1: Update Next.js
\`\`\`bash
npm install next@latest
\`\`\`

### Solution 2: Use Legacy Export
Add to package.json scripts:
\`\`\`json
"export": "next export"
\`\`\`

Then run:
\`\`\`bash
npm run build
npm run export
\`\`\`

### Solution 3: Check File Permissions
Make sure you have write permissions in the project directory.

### Solution 4: Clear Cache
\`\`\`bash
npm cache clean --force
\`\`\`

## If Build Succeeds But App Doesn't Work

1. **Check Console Errors**: Open browser dev tools
2. **Check File Paths**: Ensure all assets load correctly
3. **Test Locally**: Use `npm run serve-static`
