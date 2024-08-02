@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "DIRECTORIES=battleworld dragon-verse pet-simulator"

for %%D in (%DIRECTORIES%) do (
    echo Running npm run update gsc depend in %%D...
    pushd "%ROOT_DIR%%%D"
    if exist package.json (
        call npm run "update gsc depend"
    ) else (
        echo package.json not found in %%D.
    )
    popd
)

echo.
echo All done.
endlocal
