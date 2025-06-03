@echo off
echo 🚀 Simple build process for NEA Tracker...
echo.

REM Try the simplest approach first
echo Step 1: Force install dependencies...
npm install --force

echo.
echo Step 2: Build the project...
npx next build

echo.
echo Step 3: Check what was created...
if exist "out" (
    echo ✅ Success! Found 'out' directory
    dir out
) else if exist ".next" (
    echo ⚠️  Found '.next' directory instead of 'out'
    echo This means the build worked but didn't export to static files
    echo.
    echo Trying to export manually...
    npx next export
    if exist "out" (
        echo ✅ Export successful! Found 'out' directory
        dir out
    ) else (
        echo ❌ Export failed
    )
) else (
    echo ❌ No build output found
)

echo.
pause
