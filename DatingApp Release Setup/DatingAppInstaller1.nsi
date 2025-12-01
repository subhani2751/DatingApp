!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "Sections.nsh"
!include "x64.nsh"
;!include "psexec.nsh"
;!include "Locate.nsh"
;!include "StrFunc.nsh"
;!include "nsProcess.nsh"

Name "Dating App"
OutFile "DatingApp.exe"
RequestExecutionLevel admin

ShowInstDetails show
ShowUninstDetails show

 SetCompressor /SOLID lzma
 SetCompressorDictSize 12

Var ENV_VAR
Var ENV_VAR1

!define SOURCE_PATH "C:\Users\subhani\Desktop\MVC\DatingAppPublish"
!define NGINX_PATH "C:\Users\subhani\Desktop\MVC\nginx-1.28.0\bin"

Var hwndNginxTextbox
Var hwndDotnetTextbox
Var hwndNginxBrowse
Var hwndDotnetBrowse
Var NGINX_PATH_FROM_USER
Var DOTNET_PATH_FROM_USER
Unicode False

; EXE file icon
Icon "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingAppicon.ico"
UninstallIcon "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingAppicon.ico"

; Define Icons and Images
!define MUI_ICON "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingAppicon.ico"
!define MUI_UNICON "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingAppicon.ico"

!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingApp.bmp"
!define MUI_HEADERIMAGE_RIGHT

!define MUI_WELCOMEFINISHPAGE_BITMAP "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\DatingApp.bmp"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "C:\Users\subhani\Desktop\MVC\DatingApp\DatingApp Release Setup\License.txt"

Page custom Page_SelectPaths Page_LeaveSelectPaths

!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"



; Install Section
Section "DatingApp" DatingApp_ID

    DetailPrint "Copying files to install folder..."
    SetOutPath "$INSTDIR"
    File /r "${SOURCE_PATH}\*.*"

    ; Copy to NGINX
    IfFileExists "$NGINX_PATH_FROM_USER" 0 noNginx
        SetOutPath "$NGINX_PATH_FROM_USER"
        File /r "${SOURCE_PATH}\*.*"
    noNginx:

    ; Use DOTNET path example
    DetailPrint "User selected DOTNET PATH = $DOTNET_PATH_FROM_USER"

SectionEnd

Function Page_SelectPaths
    nsDialogs::Create 1018
    Pop $0

    ; ---------------- NGINX PATH (ONE SINGLE LINE) ----------------

    ${NSD_CreateLabel} 0 0 25% 12u "NGINX Path:"
    Pop $1

    ${NSD_CreateText} 26% 0 50% 12u ""
    Pop $hwndNginxTextbox
    ${NSD_SetText} $hwndNginxTextbox "C:\Users\subhani\Desktop\MVC\nginx-1.28.0\bin"

    ${NSD_CreateButton} 78% 0 20% 12u "Browse..."
    Pop $hwndNginxBrowse

    ${NSD_OnClick} $hwndNginxBrowse OnBrowseNginx


    ; ---------------- DOTNET PATH (ONE SINGLE LINE) ----------------

    ${NSD_CreateLabel} 0 20u 25% 12u ".NET Path:"
    Pop $2

    ${NSD_CreateText} 26% 20u 50% 12u ""
    Pop $hwndDotnetTextbox
    ${NSD_SetText} $hwndDotnetTextbox "C:\Program Files\dotnet"

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
    nsDialogs::SelectFolderDialog "Select .NET Folder" "C:\"
    Pop $0
    ${If} $0 != ""
        ${NSD_SetText} $hwndDotnetTextbox $0
    ${EndIf}
FunctionEnd


Function Page_LeaveSelectPaths
    ${NSD_GetText} $hwndNginxTextbox $NGINX_PATH_FROM_USER
    ${NSD_GetText} $hwndDotnetTextbox $DOTNET_PATH_FROM_USER

    DetailPrint "User selected NGINX PATH = $NGINX_PATH_FROM_USER"
    DetailPrint "User selected DOTNET PATH = $DOTNET_PATH_FROM_USER"
FunctionEnd