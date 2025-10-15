#!/bin/bash

# Shree Krishna Properties - Deployment Script
# This script helps deploy the application to Vercel or Netlify

echo "🏠 Shree Krishna Properties - Deployment Helper"
echo "================================================"

# Check if environment file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your Supabase credentials:"
    echo ""
    echo "VITE_SUPABASE_URL=your_supabase_url"
    echo "VITE_SUPABASE_ANON_KEY=your_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    exit 1
fi

# Source environment variables
source .env

# Validate required environment variables
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Required environment variables missing!"
    echo "Please ensure .env contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
    exit 1
fi

echo "✅ Environment variables validated"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run TypeScript check
echo "🔍 Running TypeScript check..."
npm run typecheck

if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found. Please fix them before deploying."
    exit 1
fi

echo "✅ TypeScript check passed"

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo "✅ Build successful"

# Seed admin account if service role key is available
if [ ! -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "👤 Seeding admin account..."
    npm run seed-admin
    echo "✅ Admin account ready"
    echo ""
    echo "🔐 Admin Login Credentials:"
    echo "   Email: g.mehta1971@gmail.com"
    echo "   Mobile: 7877059117"
    echo "   Password: Kota2020"
    echo ""
else
    echo "⚠️  Warning: SUPABASE_SERVICE_ROLE_KEY not found."
    echo "   You'll need to seed the admin account manually."
fi

echo ""
echo "🚀 Deployment Options:"
echo ""
echo "1. Deploy to Vercel:"
echo "   - Push your code to GitHub"
echo "   - Connect repository to Vercel"
echo "   - Add environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)"
echo "   - Deploy!"
echo ""
echo "2. Deploy to Netlify:"
echo "   - Drag and drop the 'dist' folder to Netlify"
echo "   - Or connect to GitHub for continuous deployment"
echo "   - Add environment variables in site settings"
echo ""
echo "3. Preview locally:"
echo "   npm run preview"
echo ""
echo "📱 Your app is ready for production deployment!"
echo "Visit the deployed URL to test with admin credentials above."