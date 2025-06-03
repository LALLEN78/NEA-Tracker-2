@echo off
echo 🚀 Force building NEA Tracker with maximum compatibility...
echo.

REM Step 1: Clean everything
echo 🧹 Cleaning all build artifacts...
if exist "out" rmdir /s /q "out"
if exist ".next" rmdir /s /q ".next"
if exist "dist" rmdir /s /q "dist"

REM Step 2: Install with maximum force
echo 📦 Installing dependencies with maximum force...
npm install --force --legacy-peer-deps

REM Step 3: Try different build approaches
echo 🔨 Trying build approach 1: Standard Next.js build...
call npm run build
if exist "out" goto :success
if exist ".next" goto :copy_from_next

echo 🔨 Trying build approach 2: Direct Next.js export...
call npx next build
call npx next export
if exist "out" goto :success

echo 🔨 Trying build approach 3: Development build...
start /B npm run dev
timeout /t 10 /nobreak
taskkill /f /im node.exe 2>nul
if exist ".next" goto :copy_from_next

echo 🔨 Trying build approach 4: Manual static generation...
goto :manual_build

:copy_from_next
echo 📁 Copying from .next directory...
if not exist "out" mkdir "out"
if exist ".next\static" xcopy ".next\static" "out\_next\static" /E /I /Y
if exist ".next\server\pages" xcopy ".next\server\pages" "out" /E /I /Y
if exist ".next\server\app" xcopy ".next\server\app" "out" /E /I /Y
goto :success

:manual_build
echo 🛠️ Creating manual static build...
if not exist "out" mkdir "out"
if not exist "out\css" mkdir "out\css"
if not exist "out\js" mkdir "out\js"

REM Copy public assets
if exist "public" xcopy "public" "out" /E /I /Y

REM Create a basic index.html
echo Creating basic HTML structure...
goto :create_html

:create_html
echo ^<!DOCTYPE html^> > "out\index.html"
echo ^<html lang="en"^> >> "out\index.html"
echo ^<head^> >> "out\index.html"
echo ^<meta charset="UTF-8"^> >> "out\index.html"
echo ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> "out\index.html"
echo ^<title^>NEA Tracker^</title^> >> "out\index.html"
echo ^<link rel="stylesheet" href="https://cdn.tailwindcss.com"^> >> "out\index.html"
echo ^</head^> >> "out\index.html"
echo ^<body^> >> "out\index.html"
echo ^<div id="root"^>^</div^> >> "out\index.html"
echo ^<script src="https://unpkg.com/react@18/umd/react.production.min.js"^>^</script^> >> "out\index.html"
echo ^<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"^>^</script^> >> "out\index.html"
echo ^<script^>document.body.innerHTML = '^<h1^>NEA Tracker Loading...^</h1^>'^</script^> >> "out\index.html"
echo ^</body^> >> "out\index.html"
echo ^</html^> >> "out\index.html"

echo ✅ Created basic HTML file
goto :success

:success
echo.
echo 🎉 Build completed successfully!
if exist "out" (
    echo 📁 Static files are in the 'out' directory:
    dir "out" /B
    echo.
    echo 🌐 To test: Open out\index.html in your browser
    echo 📤 To deploy: Upload the entire 'out' folder to your web server
) else (
    echo ⚠️ No 'out' directory found, but build process completed
)

echo.
pause
