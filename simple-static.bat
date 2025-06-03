@echo off
echo 🚀 Creating simple static version...

REM Create output directory
if not exist "static-build" mkdir "static-build"
if not exist "static-build\css" mkdir "static-build\css"
if not exist "static-build\js" mkdir "static-build\js"

REM Copy public files
if exist "public" xcopy "public" "static-build" /E /I /Y

REM Create main HTML file
echo Creating static HTML file...

(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>NEA Tracker^</title^>
echo     ^<script src="https://cdn.tailwindcss.com"^>^</script^>
echo     ^<script src="https://unpkg.com/react@18/umd/react.development.js"^>^</script^>
echo     ^<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"^>^</script^>
echo     ^<script src="https://unpkg.com/@babel/standalone/babel.min.js"^>^</script^>
echo     ^<style^>
echo         body { margin: 0; font-family: system-ui; }
echo         .sidebar { width: 250px; background: #1f2937; color: white; height: 100vh; position: fixed; }
echo         .main { margin-left: 250px; padding: 20px; }
echo         .nav-item { padding: 10px 20px; cursor: pointer; }
echo         .nav-item:hover { background: #374151; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div id="root"^>^</div^>
echo     ^<script type="text/babel"^>
echo         const { useState, useEffect } = React;
echo         
echo         function App^(^) {
echo             const [currentPage, setCurrentPage] = useState^('dashboard'^);
echo             
echo             return React.createElement^('div', { className: 'flex' },
echo                 React.createElement^('div', { className: 'sidebar' },
echo                     React.createElement^('h2', { className: 'p-4 text-xl font-bold' }, 'NEA Tracker'^),
echo                     React.createElement^('nav', null,
echo                         React.createElement^('div', { 
echo                             className: 'nav-item', 
echo                             onClick: ^(^) =^> setCurrentPage^('dashboard'^) 
echo                         }, 'Dashboard'^),
echo                         React.createElement^('div', { 
echo                             className: 'nav-item', 
echo                             onClick: ^(^) =^> setCurrentPage^('students'^) 
echo                         }, 'Students'^),
echo                         React.createElement^('div', { 
echo                             className: 'nav-item', 
echo                             onClick: ^(^) =^> setCurrentPage^('progress'^) 
echo                         }, 'Progress'^)
echo                     ^)
echo                 ^),
echo                 React.createElement^('div', { className: 'main' },
echo                     React.createElement^('h1', { className: 'text-3xl font-bold mb-4' }, 
echo                         currentPage.charAt^(0^).toUpperCase^(^) + currentPage.slice^(1^)
echo                     ^),
echo                     React.createElement^('p', null, 'NEA Tracker - ' + currentPage + ' page'^)
echo                 ^)
echo             ^);
echo         }
echo         
echo         ReactDOM.render^(React.createElement^(App^), document.getElementById^('root'^)^);
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > "static-build\index.html"

echo ✅ Static build created in 'static-build' directory
echo 🌐 Open static-build\index.html in your browser to test
echo.
pause
