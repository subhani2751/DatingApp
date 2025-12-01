!define APP_NAME "DatingApp"
!define SOURCE_PATH "C:\Users\subhani\Desktop\MVC\DatingAppPublish"
!define NGINX_PATH "C:\Users\subhani\Desktop\MVC\nginx-1.28.0\bin"

OutFile "DatingAppInstaller.exe"
InstallDir "${NGINX_PATH}"
RequestExecutionLevel admin

SetOverwrite on
ShowInstDetails show
ShowUninstDetails show

Page Directory
Page InstFiles

Section "Install DatingApp"

    ; Create output path
    SetOutPath "$INSTDIR"

    ; Copy all published files into NGINX folder
    File /r "${SOURCE_PATH}\*.*"

    ; OPTIONAL → restart nginx if needed
    ; nsExec::ExecToLog 'powershell -Command "Restart-Service nginx"'

SectionEnd

Section "Uninstall"
    RMDir /r "$INSTDIR"
SectionEnd