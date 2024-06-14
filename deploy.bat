@echo on
setlocal
set "ROOT=%~dp0"
set "LIB_DIRS=MetaWorldNPT\JavaScripts\util MetaWorldNPT\JavaScripts\depend\log4ts MetaWorldNPT\JavaScripts\lui MetaWorldNPT\JavaScripts\depend\god-mod"
set "PROJ_DIRS=MetaWorldNPT"

::call:build
::call:createLink
call:link

:build
for %%d in (%LIB_DIRS%) do (
    echo Building...
    pushd %%d

    if exist package.json (
        echo Building "%%d"...
        npm run build
    ) else (
        echo No package.json found in %%d.
    )
    echo Building "%%d" Done.

    popd
)
goto:eof

:createLink
for %%d in (%LIB_DIRS%) do (
    echo Creating Link...
    pushd %%d

    if exist package.json (
        echo Creating link for "%%d"...
        npm run create-link
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
        npm run link-to-self-package
    ) else (
        echo No package.json found in %%d.
    )
    popd
)
goto:eof

echo.
echo Deploy done.
endlocal