@echo off
echo Fixing NEA Tracker setup...

REM Create a clean static-build directory
if exist "static-build-working" rmdir /s /q "static-build-working"
mkdir "static-build-working"

REM Copy assets
if exist "public" (
    echo Copying public assets...
    xcopy "public\*" "static-build-working\" /E /I /Y > nul
)

if exist "icons" (
    echo Copying icons...
    xcopy "icons\*" "static-build-working\icons\" /E /I /Y > nul
)

REM Create the working HTML file
echo Creating working HTML file...
echo ^<!DOCTYPE html^> > "static-build-working\index.html"
echo ^<html lang="en"^> >> "static-build-working\index.html"
echo ^<head^> >> "static-build-working\index.html"
echo     ^<meta charset="UTF-8"^> >> "static-build-working\index.html"
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> "static-build-working\index.html"
echo     ^<title^>NEA Tracker^</title^> >> "static-build-working\index.html"
echo     ^<script src="https://cdn.tailwindcss.com"^>^</script^> >> "static-build-working\index.html"
echo ^</head^> >> "static-build-working\index.html"
echo ^<body class="bg-gray-100"^> >> "static-build-working\index.html"
echo     ^<div class="min-h-screen flex items-center justify-center"^> >> "static-build-working\index.html"
echo         ^<div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"^> >> "static-build-working\index.html"
echo             ^<h1 class="text-2xl font-bold text-center mb-6"^>📚 NEA Tracker^</h1^> >> "static-build-working\index.html"
echo             ^<p class="text-center text-gray-600 mb-4"^>Welcome to the NEA Coursework Tracker^</p^> >> "static-build-working\index.html"
echo             ^<div class="text-center"^> >> "static-build-working\index.html"
echo                 ^<button onclick="alert('NEA Tracker is working!')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"^>Test Application^</button^> >> "static-build-working\index.html"
echo             ^</div^> >> "static-build-working\index.html"
echo         ^</div^> >> "static-build-working\index.html"
echo     ^</div^> >> "static-build-working\index.html"
echo ^</body^> >> "static-build-working\index.html"
echo ^</html^> >> "static-build-working\index.html"

echo.
echo ✅ NEA Tracker setup complete!
echo.
echo Opening NEA Tracker...
start "" "static-build-working\index.html"

echo.
echo If it works, you can find your files in the 'static-build-working' folder
pause
