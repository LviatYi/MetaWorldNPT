@echo off

set projectRootPath=%~dp0
set "buildToolPath=%projectRootPath%..\..\..\..\..\..\WindowsNoEditor\MW\Content\BuildTool"
set "mainPath=%buildToolPath%\compile_all_projects_main.cjs"
set "buildPath=%buildToolPath%\compile_all_projects_build.cjs"

@REM if not exist "%mainPath%" (
@REM   copy %projectRootPath%\compile_all_projects\compile_all_projects_main.cjs %mainPath%
@REM )
@REM if not exist "%buildPath%" (
@REM   copy %projectRootPath%\compile_all_projects\compile_all_projects_build.cjs %buildPath%
@REM )
copy %projectRootPath%\compile_all_projects\compile_all_projects_main.cjs %mainPath%
copy %projectRootPath%\compile_all_projects\compile_all_projects_build.cjs %buildPath%
%buildToolPath%\node.exe %mainPath% %projectRootPath% %buildPath%
