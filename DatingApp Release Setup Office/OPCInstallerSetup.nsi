!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "Sections.nsh"
!include "x64.nsh"

Unicode False

Name "Dating App"
OutFile "DatingApp.exe"
BrandingText "GrowHigh Pvt Ltd"

; Default install dir (used if user does not change nginx path)
!define APP_NAME "DatingApp"
!define SOURCE_PATH "C:\Users\subhani\Desktop\MVC\DatingAppPublish"
!define NGINX_PATH  "C:\Users\subhani\Desktop\MVC\nginx-1.28.0"
!define IIS_DEPLOY_PATH "C:\inetpub\wwwroot\DatingApp"
!define SERVICE_NAME "DatingAppService"
InstallDir "${NGINX_PATH}"; 

RequestExecutionLevel admin

ShowInstDetails show
ShowUninstDetails show

SetCompressor /SOLID lzma
SetCompressorDictSize 12

;---------------- Variables ----------------
Var hwndNginxTextbox
Var hwndDotnetTextbox
Var hwndNginxBrowse
Var hwndDotnetBrowse
Var NGINX_PATH_FROM_USER
Var DOTNET_PATH_FROM_USER

;---------------- Icons --------------------

!define MUI_ICON   "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\DatingApp.ico"
!define MUI_UNICON "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\DatingApp.ico"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\DatingApp.bmp"
!define MUI_HEADERIMAGE_RIGHT
!define MUI_WELCOMEFINISHPAGE_BITMAP "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\DatingApp.bmp"

;---------------- Pages --------------------
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup Office\License.txt"

Page custom Page_SelectPaths Page_LeaveSelectPaths

!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"
; Uninstall SECTION

;  INSTALL SECTION
Section "DatingApp" DatingApp_ID
	
    ; DetailPrint "INSTALL DIR = $INSTDIR"
    ; DetailPrint "Copying files to install folder..."
	
	; nsExec::ExecToLog 'taskkill /IM DatingApp.exe'
	
    ; DetailPrint "Backend copied to IIS folder: ${IIS_DEPLOY_PATH}"

    ; ; Install everything into $INSTDIR (which is the NGINX path chosen by user)
    ; SetOutPath "$INSTDIR\bin"
    ; File /r "${SOURCE_PATH}\*.*"
	
	; ; Remove wwwroot so we can place Angular files correctly
    ; RMDir /r "$INSTDIR\wwwroot"
	
	; ;COPY ANGULAR BUILD FILES → NGINX/html
	; DetailPrint "Copying Angular files to NGINX html folder..."

    ; SetOutPath "$INSTDIR\html"
    ; File /r "${SOURCE_PATH}\wwwroot\*.*"

    ; DetailPrint "User selected DOTNET PATH = $DOTNET_PATH_FROM_USER"
	
	; ;START NGINX SERVER (nginx.exe)
	; DetailPrint "Starting DatingApp ..."
	; SetOutPath "$INSTDIR"
    ; Exec '"$INSTDIR\bin\DatingApp.exe"'     
	; Sleep 5000
	
	; ;RESTART NGINX SERVER
	; DetailPrint "Restarting nginx..."
    ; nsExec::ExecToLog 'taskkill /IM nginx.exe /F'
    ; Sleep 5000
	
	; ;START NGINX SERVER (nginx.exe)
	; DetailPrint "Starting nginx.exe ..."
	; SetOutPath "$INSTDIR"
    ; Exec '"$INSTDIR\nginx.exe"'     
	; Sleep 5000
	
	DetailPrint "INSTALL DIR = $INSTDIR"
    DetailPrint "Stopping any existing services..."
    
    ; Stop and remove existing service if it exists
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" stop ${SERVICE_NAME}'
    Sleep 3000
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" remove ${SERVICE_NAME} confirm'
    Sleep 2000
    
    ; ; fallback: kill any running processes
    ; detailprint "ensuring all processes are stopped..."
    ; nsexec::exectolog 'taskkill /im datingapp.exe /f'
    ; sleep 2000
    
    ; ; Copy NSSM first (needed for service management)
    ; DetailPrint "Copying NSSM service manager..."
    ; SetOutPath "$INSTDIR"
    ; File "nssm.exe"
    
    DetailPrint "Copying backend files..."
    SetOutPath "$INSTDIR\bin"
    File /r "${SOURCE_PATH}\*.*"
    
    ; Remove old wwwroot
    DetailPrint "Removing old wwwroot..."
    RMDir /r "$INSTDIR\wwwroot"
    
    ; Copy Angular files to NGINX html folder
    DetailPrint "Copying Angular files to NGINX html folder..."
    SetOutPath "$INSTDIR\html"
    File /r "${SOURCE_PATH}\wwwroot\*.*"
    
    ; Install DatingApp as Windows Service using NSSM
    DetailPrint "Installing ${APP_NAME} as Windows service..."
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" install ${SERVICE_NAME} "$INSTDIR\bin\DatingApp.exe"'
    Sleep 1000
    
    ; Configure service settings
    DetailPrint "Configuring service settings..."
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppDirectory "$INSTDIR\bin"'
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} DisplayName "${APP_NAME} Service"'
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} Description "Dating App Backend Service (Kestrel)"'
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} Start SERVICE_AUTO_START'
    
    ; Optional: Set up logging
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppStdout "$INSTDIR\logs\service-output.log"'
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" set ${SERVICE_NAME} AppStderr "$INSTDIR\logs\service-error.log"'
    
    ; Create logs directory
    CreateDirectory "$INSTDIR\logs"
    
    ; Start the service
    DetailPrint "Starting ${APP_NAME} service..."
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" start ${SERVICE_NAME}'
    Sleep 5000
    
    ; Verify service is running
    nsExec::ExecToLog '"$INSTDIR\nssm.exe" status ${SERVICE_NAME}'
    
    ; Restart NGINX
    DetailPrint "Restarting nginx..."
    nsExec::ExecToLog 'taskkill /IM nginx.exe /F'
    Sleep 2000
    
    ; Start NGINX
    DetailPrint "Starting nginx.exe..."
    SetOutPath "$INSTDIR"
    Exec '"$INSTDIR\nginx.exe"'
    Sleep 3000
    
    DetailPrint "Installation complete!"
	

SectionEnd


;  CUSTOM PAGE: NGINX + DOTNET PATHS
Function Page_SelectPaths
    nsDialogs::Create 1018
    Pop $0

    ; ---------- NGINX PATH (one line) ----------
    ${NSD_CreateLabel} 0 0 25% 12u "NGINX Path:"
    Pop $1

    ${NSD_CreateText} 26% 0 50% 12u ""
    Pop $hwndNginxTextbox
    ${NSD_SetText} $hwndNginxTextbox "${NGINX_PATH}"

    ${NSD_CreateButton} 78% 0 20% 12u "Browse..."
    Pop $hwndNginxBrowse
    ${NSD_OnClick} $hwndNginxBrowse OnBrowseNginx

    ; ---------- DOTNET PATH (one line) ----------
    ${NSD_CreateLabel} 0 20u 25% 12u "IIS Deployment Path:"
    Pop $2

    ${NSD_CreateText} 26% 20u 50% 12u ""
    Pop $hwndDotnetTextbox
	
	${NSD_SetText} $hwndDotnetTextbox "${IIS_DEPLOY_PATH}"
    ${NSD_CreateButton} 78% 20u 20% 12u "Browse..."
    Pop $hwndDotnetBrowse
    ${NSD_OnClick} $hwndDotnetBrowse OnBrowseDotnet

    nsDialogs::Show
FunctionEnd

Function OnBrowseNginx
    nsDialogs::SelectFolderDialog "Select NGINX Folder" "C:\"
    Pop $0
    ${If} $0 != ""
        ${NSD_SetText} $hwndNginxTextbox $0
    ${EndIf}
FunctionEnd

Function OnBrowseDotnet
    nsDialogs::SelectFolderDialog "Select IIS Deployment Folder" "C:\inetpub\wwwroot"
    Pop $0
    ${If} $0 != ""
        ${NSD_SetText} $hwndDotnetTextbox $0
    ${EndIf}
FunctionEnd

Function Page_LeaveSelectPaths
    ${NSD_GetText} $hwndNginxTextbox $NGINX_PATH_FROM_USER
    ${NSD_GetText} $hwndDotnetTextbox $DOTNET_PATH_FROM_USER

    ; Make the selected NGINX path the real install directory
    StrCpy $INSTDIR $NGINX_PATH_FROM_USER

    DetailPrint "User selected NGINX PATH  = $NGINX_PATH_FROM_USER"
    DetailPrint "User selected DOTNET PATH = $DOTNET_PATH_FROM_USER"
FunctionEnd
