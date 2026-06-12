@echo off
echo Starting MongoDB...

REM Create data directory if it doesn't exist
if not exist "C:\data\db" mkdir "C:\data\db"

REM Try to start MongoDB service first
echo Attempting to start MongoDB service...
net start MongoDB 2>nul
if %errorlevel% == 0 (
    echo MongoDB service started successfully!
    goto :end
)

REM If service doesn't exist, try to start mongod manually
echo MongoDB service not found. Trying to start mongod manually...

REM Check common installation paths
if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" (
    echo Found MongoDB 8.0, starting...
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath "C:\data\db"
    goto :end
)

if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    echo Found MongoDB 7.0, starting...
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath "C:\data\db"
    goto :end
)

if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    echo Found MongoDB 6.0, starting...
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "C:\data\db"
    goto :end
)

REM Try chocolatey installation path
if exist "C:\ProgramData\chocolatey\lib\mongodb\tools\mongodb\bin\mongod.exe" (
    echo Found MongoDB via Chocolatey, starting...
    "C:\ProgramData\chocolatey\lib\mongodb\tools\mongodb\bin\mongod.exe" --dbpath "C:\data\db"
    goto :end
)

echo MongoDB not found in common locations.
echo Please install MongoDB from: https://www.mongodb.com/try/download/community
echo Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

:end
pause