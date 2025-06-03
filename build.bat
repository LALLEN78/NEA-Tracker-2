@echo off
echo 🚀 Building NEA Tracker as static HTML...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project directory.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "out" rmdir /s /q "out"
if exist ".next" rmdir /s /q ".next"

REM Build the static export
echo 🔨 Building static files...
npm run build-static

REM Check if build was successful and out folder exists
if %errorlevel% equ 0 (
    if exist "out" (
        echo ✅ Build successful!
        echo 📁 Static files are in the 'out' directory
        echo.
        dir out
        echo.
        echo To test locally, run: npm run serve-static
        echo To deploy, upload the 'out' directory to your web server
    ) else (
        echo ⚠️  Build completed but 'out' folder not found.
        echo This might be because the files are in a different location.
        echo Checking for alternative locations...
        if exist ".next" (
            echo Found .next folder - this contains the build files
            dir .next
        )
        if exist "dist" (
            echo Found dist folder
            dir dist
        )
    )
) else (
    echo ❌ Build failed!
    echo Check the error messages above for details.
)

echo.
pause
