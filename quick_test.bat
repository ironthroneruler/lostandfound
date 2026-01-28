@echo off
REM Quick Test Script for Lost & Found Django Project (Windows)

:menu
cls
echo ============================================
echo   Lost and Found Testing Utility
echo ============================================
echo.
echo What would you like to do?
echo.
echo 1) Reset database and seed test data
echo 2) Seed test data only (keep existing data)
echo 3) Reset database without seeding
echo 4) Setup test images
echo 5) Full reset (database + test images)
echo 6) Run development server
echo 7) Create superuser
echo 8) Show test accounts
echo 9) Exit
echo.

set /p choice="Enter choice [1-9]: "

if "%choice%"=="1" goto reset_and_seed
if "%choice%"=="2" goto seed_only
if "%choice%"=="3" goto reset_only
if "%choice%"=="4" goto test_images
if "%choice%"=="5" goto full_reset
if "%choice%"=="6" goto run_server
if "%choice%"=="7" goto create_superuser
if "%choice%"=="8" goto show_accounts
if "%choice%"=="9" goto end

echo Invalid choice!
pause
goto menu

:reset_and_seed
echo.
echo Resetting database and seeding...
python manage.py reset_database
pause
goto menu

:seed_only
echo.
echo Seeding test data...
python manage.py seed_data
pause
goto menu

:reset_only
echo.
echo Resetting database only...
python manage.py reset_database --no-seed
pause
goto menu

:test_images
echo.
echo Setting up test images...
python setup_test_images.py
pause
goto menu

:full_reset
echo.
echo Full reset...
python manage.py reset_database
echo.
echo Setting up test images...
python setup_test_images.py
pause
goto menu

:run_server
echo.
echo Starting development server...
python manage.py runserver
pause
goto menu

:create_superuser
echo.
echo Creating superuser...
python manage.py createsuperuser
pause
goto menu

:show_accounts
echo.
echo ============================================
echo   Test Accounts
echo ============================================
echo Admin:    username=admin,    password=admin123
echo Teacher:  username=teacher1, password=password123
echo Student:  username=student1, password=password123
echo Student:  username=student2, password=password123
echo Student:  username=student3, password=password123
echo.
pause
goto menu

:end
echo.
echo Goodbye!