@echo off
REM Shree Krishna Properties - Windows Deployment Script
REM This script helps deploy the application to Vercel or Netlify

echo 🏠 Shree Krishna Properties - Deployment Helper
echo ================================================

REM Check if environment file exists
if not exist .env (
    echo ❌ Error: .env file not found!
    echo Please create a .env file with your Supabase credentials:
    echo.
    echo VITE_SUPABASE_URL=your_supabase_url
    echo VITE_SUPABASE_ANON_KEY=your_anon_key
    echo SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    echo.
    pause
    exit /b 1
)

echo ✅ Environment file found

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run TypeScript check
echo 🔍 Running TypeScript check...
call npm run typecheck

if errorlevel 1 (
    echo ❌ TypeScript errors found. Please fix them before deploying.
    pause
    exit /b 1
)

echo ✅ TypeScript check passed

REM Build the application
echo 🔨 Building application...
call npm run build

if errorlevel 1 (
    echo ❌ Build failed. Please check the errors above.
    pause
    exit /b 1
)

echo ✅ Build successful

REM Try to seed admin account
echo 👤 Attempting to seed admin account...
call npx tsx scripts/seed-admin.ts
echo ✅ Admin account setup attempted

echo.
echo 🔐 Admin Login Credentials:
echo    Email: g.mehta1971@gmail.com
echo    Mobile: 7877059117
echo    Password: Kota2020
echo.

echo 🚀 Deployment Options:
echo.
echo 1. Deploy to Vercel:
echo    - Push your code to GitHub
echo    - Connect repository to Vercel
echo    - Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
echo    - Deploy!
echo.
echo 2. Deploy to Netlify:
echo    - Drag and drop the 'dist' folder to Netlify
echo    - Or connect to GitHub for continuous deployment
echo    - Add environment variables in site settings
echo.
echo 3. Preview locally:
echo    npm run preview
echo.
echo 📱 Your app is ready for production deployment!
echo Visit the deployed URL to test with admin credentials above.
echo.
pause