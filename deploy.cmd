@echo on
setlocal enabledelayedexpansion
set "ROOT=%~dp0"
set "LIB_DIRS=MetaWorldNPT\JavaScripts\util MetaWorldNPT\JavaScripts\depend\log4ts MetaWorldNPT\JavaScripts\lui MetaWorldNPT\JavaScripts\depend\god-mod"
set "PROJ_DIRS=MetaWorldNPT"

call:build
call:createLink
call:link
call:clean

echo.
echo Deploy done.
endlocal

goto:eof

:build
for %%d in (%LIB_DIRS%) do (
    echo Building...
    pushd %%d
    echo !cd!

    if exist package.json (
        echo Building "%%d"...
        call npm run build
    ) else (
        echo No package.json found in %%d.
    )
    echo Building "%%d" Done.

    popd
    echo !cd!
)
goto:eof

:createLink
for %%d in (%LIB_DIRS%) do (
    echo Creating Link...
    pushd %%d

    if exist package.json (
        echo Creating link for "%%d"...
        call npm run create-link
    ) else (
        echo No package.json found in %%d.
    )
    echo Creating Link "%%d" Done.

    popd
)
goto:eof

:link
for %%d in (%PROJ_DIRS%) do (
    echo Linking
    pushd %%d
    echo %cd%
    if exist package.json (
        call npm run link-to-self-package
    ) else (
        echo No package.json found in %%d.
    )
    popd
)
goto:eof

:clean
for %%d in (%LIB_DIRS%) do (
    echo Clean...
    pushd %%d

    if exist package.json (
        echo Clean "%%d"...
        call npm run clean
    ) else (
        echo No package.json found in %%d.
    )
    echo Creating Link "%%d" Done.

    popd
)
goto:eof