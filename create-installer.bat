@echo off
echo 🚀 Creating NEA Tracker Installer...

REM Create installer directory
if not exist "installer" mkdir "installer"
if not exist "installer\NEA-Tracker" mkdir "installer\NEA-Tracker"

REM Copy application files
echo 📁 Copying application files...
xcopy "static-build\*" "installer\NEA-Tracker\" /E /I /Y

REM Create launcher script
echo 📝 Creating launcher...
(
echo @echo off
echo cd /d "%%~dp0"
echo start "" "index.html"
) > "installer\NEA-Tracker\Launch NEA Tracker.bat"

REM Create desktop shortcut script
echo 📝 Creating desktop shortcut installer...
(
echo @echo off
echo echo Creating desktop shortcut...
echo set "shortcutPath=%%USERPROFILE%%\Desktop\NEA Tracker.lnk"
echo set "targetPath=%%~dp0Launch NEA Tracker.bat"
echo set "iconPath=%%~dp0icons\icon-192x192.png"
echo powershell -Command "$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%%shortcutPath%%'^); $Shortcut.TargetPath = '%%targetPath%%'; $Shortcut.WorkingDirectory = '%%~dp0'; $Shortcut.Save(^)"
echo echo Desktop shortcut created successfully!
echo pause
) > "installer\NEA-Tracker\Create Desktop Shortcut.bat"

REM Create installation instructions
echo 📝 Creating installation instructions...
(
echo NEA TRACKER - INSTALLATION INSTRUCTIONS
echo =======================================
echo.
echo QUICK START:
echo 1. Double-click "Launch NEA Tracker.bat" to run the application
echo 2. Bookmark the page that opens for easy access
echo.
echo DESKTOP SHORTCUT:
echo 1. Double-click "Create Desktop Shortcut.bat"
echo 2. A shortcut will appear on your desktop
echo.
echo SYSTEM REQUIREMENTS:
echo - Windows 7 or later
echo - Any modern web browser ^(Chrome, Firefox, Edge^)
echo - No internet connection required after installation
echo.
echo FEATURES:
echo - Track student NEA progress
echo - Manage student data
echo - Generate progress reports
echo - Print functionality
echo - Offline operation
echo.
echo SUPPORT:
echo If you need help, contact your IT administrator.
echo.
echo DATA STORAGE:
echo All data is stored locally on your computer.
echo Your data is private and secure.
) > "installer\NEA-Tracker\README.txt"

REM Create uninstaller
echo 📝 Creating uninstaller...
(
echo @echo off
echo echo Uninstalling NEA Tracker...
echo echo.
echo echo This will remove the NEA Tracker application.
echo echo Your data will be preserved in your browser.
echo echo.
echo set /p confirm="Are you sure you want to uninstall? (Y/N): "
echo if /i "%%confirm%%" NEQ "Y" goto :cancel
echo.
echo echo Removing desktop shortcut...
echo if exist "%%USERPROFILE%%\Desktop\NEA Tracker.lnk" del "%%USERPROFILE%%\Desktop\NEA Tracker.lnk"
echo.
echo echo Removing application files...
echo cd ..
echo rmdir /s /q "NEA-Tracker"
echo.
echo echo NEA Tracker has been uninstalled.
echo echo Your browser data has been preserved.
echo pause
echo exit
echo.
echo :cancel
echo echo Uninstall cancelled.
echo pause
) > "installer\NEA-Tracker\Uninstall.bat"

echo ✅ Installer created successfully!
echo 📁 Files are in the 'installer' directory
echo.
echo TO DISTRIBUTE:
echo 1. Zip the 'installer' folder
echo 2. Send to teachers
echo 3. They extract and run "Launch NEA Tracker.bat"
echo.
pause
