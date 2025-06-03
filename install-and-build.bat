@echo off
echo 🚀 Installing dependencies and building NEA Tracker...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project directory.
    pause
    exit /b 1
)

REM Force install dependencies to resolve React version conflicts
echo 📦 Installing dependencies (forcing resolution of conflicts)...
npm install --force

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies even with --force
    echo Trying with legacy peer deps...
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Installation failed completely
        pause
        exit /b 1
    )
)

echo ✅ Dependencies installed successfully!
echo.

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "out" rmdir /s /q "out"
if exist ".next" rmdir /s /q ".next"

REM Build the static export
echo 🔨 Building static files...
npm run build

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Build completed!
    
    REM Check for output directories
    if exist "out" (
        echo 📁 Found 'out' directory with static files!
        dir out
    ) else if exist ".next" (
        echo 📁 Found '.next' directory - copying static files...
        if not exist "out" mkdir "out"
        xcopy ".next\static" "out\_next\static" /E /I /Y
        xcopy ".next\server\app" "out" /E /I /Y
        echo ✅ Static files copied to 'out' directory
    ) else (
        echo ⚠️  No output directory found. Let's check what was created...
        dir /B
    )
    
    echo.
    echo 🎉 Build process completed!
    echo To test locally: npm run serve-static
    echo To deploy: Upload the 'out' directory to your web server
) else (
    echo ❌ Build failed!
    echo Check the error messages above for details.
)

echo.
pause
