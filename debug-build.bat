@echo off
echo 🔍 Debug Build Process...
echo.

echo Current directory:
cd

echo.
echo Checking for package.json:
if exist "package.json" (
    echo ✅ package.json found
) else (
    echo ❌ package.json not found
)

echo.
echo Checking Next.js version:
npx next --version

echo.
echo Running build with verbose output:
npm run build-static -- --debug

echo.
echo Checking what was created:
echo Contents of current directory:
dir

echo.
echo Looking for output folders:
if exist "out" (
    echo ✅ Found 'out' folder:
    dir out
) else (
    echo ❌ No 'out' folder found
)

if exist ".next" (
    echo ✅ Found '.next' folder:
    dir .next
) else (
    echo ❌ No '.next' folder found
)

if exist "dist" (
    echo ✅ Found 'dist' folder:
    dir dist
) else (
    echo ❌ No 'dist' folder found
)

echo.
pause
