## This script will run npm install or npm run dev in all directories in the current folder

@echo off

setlocal enabledelayedexpansion

set "type=%~1"

IF "%type%" EQU "install" (
    set "command=npm install"
) ELSE (
    set "command=npm run %type%"
)

IF "%type%" EQU "dev" (
    set "command=npm run dev"
)

for /f "delims=" %%d in ('dir /b /A:D') do (
    pushd "%%d"
    start cmd /c "%command%"
    popd
)

endlocal