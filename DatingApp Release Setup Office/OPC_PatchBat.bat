@echo off
setlocal enabledelayedexpansion

REM 1 SET YOUR PATHS
set ANGULAR_PATH=C:\Users\subhani\Desktop\MVC\DatingApp\client
set DOTNET_PATH=C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp
set PUBLISH_PATH=C:\Users\subhani\Desktop\MVC\DatingAppPublish
set NSIS_SCRIPT=C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\OPCInstallerSetup.nsi
set PATCH_ROOT=C:\Users\subhani\Desktop\MVC\Patch

REM 2️ CLEAN PUBLISH FOLDER
echo Cleaning publish folder...
IF EXIST "%PUBLISH_PATH%" (
    rmdir /s /q "%PUBLISH_PATH%"
)

REM 3 BUILD ANGULAR
echo Building Angular...
cd "%ANGULAR_PATH%"
call npm install
call ng build --configuration production
IF %ERRORLEVEL% NEQ 0 (
    echo Angular build failed!
    pause
    exit /b 1
)

REM 4 BUILD DOTNET (NEWLY ADDED)
echo BUILDING DOTNET APPLICATION...
cd "%DOTNET_PATH%"
dotnet build --configuration Release
IF %ERRORLEVEL% NEQ 0 (
    echo ❌ Dotnet BUILD failed!
    pause
    exit /b 1
)

REM 4️ PUBLISH DOTNET
echo Publishing .NET...
cd "%DOTNET_PATH%"
dotnet publish -c Release -o "%PUBLISH_PATH%"
IF %ERRORLEVEL% NEQ 0 (
    echo Dotnet publish failed!
    pause
    exit /b 1
)

REM CREATE DATE + HOUR + MINUTE FOLDER NAME
for /f "tokens=1-5 delims=/:. " %%a in ("%date% %time%") do (
    set DATETIME_FOLDER=%%a_%%b_%%c
)

REM Remove invalid chars
set DATETIME_FOLDER=%DATETIME_FOLDER::=%

REM Create patch folder path:
set PATCH_FOLDER=%PATCH_ROOT%\%DATETIME_FOLDER%

echo Creating patch folder: %PATCH_FOLDER%
mkdir "%PATCH_FOLDER%"

REM 6️ RUN NSIS
echo Creating NSIS installer...
"C:\Program Files (x86)\NSIS\makensis.exe" /NOCD "%NSIS_SCRIPT%"
IF %ERRORLEVEL% NEQ 0 (
    echo NSIS build failed!
    pause
    exit /b 1
)

REM 7️ MOVE INSTALLER TO PATCH FOLDER
echo Moving installer to: %PATCH_FOLDER%
move DatingApp.exe "%PATCH_FOLDER%\DatingApp.exe"

echo.
echo -----------------------------------------------------
echo BUILD COMPLETE!
echo Installer generated at:
echo %PATCH_FOLDER%\DatingApp.exe
echo -----------------------------------------------------

pause
exit /b
