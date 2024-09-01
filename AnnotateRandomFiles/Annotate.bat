@echo off
setlocal EnableDelayedExpansion

:START
REM Step 1: Prompt the user for an executable name
set "exe_name="
set /p exe_name="Enter the executable name (without extension): "

REM Step 2: Ask the user to drag and drop a C++ file to get the file path
echo Drag and drop the C++ file:
set /p dropped_file=

REM Step 3: Handle file paths with spaces
set "dropped_file=%dropped_file:"=%"
set "file_path=%dropped_file%"
if not exist "%file_path%" (
    echo The file "%file_path%" does not exist. Please try again.
    goto START
)

REM Step 4: Change the directory to that of the dragged file
cd /d "%~dp0"
cd /d "%~dp1"

REM Step 5: List the content of the current directory
echo The contents of the directory:
dir /b

REM Step 6: Ask if compile in Debug or Release mode
set "build_mode="
set /p build_mode="Compile in Debug or Release mode? (d/r): "
if /i "%build_mode%"=="d" (
    set "build_mode=/Zi /Od /DDEBUG"
) else (
    set "build_mode=/O2 /DNDEBUG"
)

REM Step 7: Compile all .cpp files in the directory, with main.cpp as the first file
set "compile_list="
if exist "main.cpp" (
    set "compile_list=main.cpp "
)
for %%f in (*.cpp) do (
    if not "%%f"=="main.cpp" (
        set "compile_list=!compile_list! %%f"
    )
)

REM Step 8: Display and execute the compilation command
set "compile_cmd=g++ -o "%exe_name%" !compile_list! !build_mode!"
echo Executing: !compile_cmd!
!compile_cmd!

REM Step 9: Show a completion message after compilation
echo Compilation complete.

REM Step 10: Ask if the user wants to restart the process (by pressing 'X')
set "restart="
set /p restart="Press 'X' to restart or any other key to exit: "
if /i "%restart%"=="X" (
    goto START
)

endlocal
exit /b
         