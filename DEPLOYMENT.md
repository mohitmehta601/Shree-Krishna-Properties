# Deployment Guide - Shree Krishna Properties

This guide provides step-by-step instructions for deploying the Shree Krishna Properties application to production.

## 🚀 Quick Start Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Admin account seeded
- [ ] Sample data added (optional)
- [ ] Application deployed to Vercel/Netlify
- [ ] Admin login verified
- [ ] User flow tested

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- GitHub account (for deployment)
- Supabase account
- Vercel or Netlify account

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Visit [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in project details:
   - Name: `shree-krishna-properties`
   - Database Password: (Generate a strong password)
   - Region: Choose closest to your users
5. Click **"Create New Project"**
6. Wait 2-3 minutes for project initialization

### 1.2 Get API Credentials

1. Go to **Project Settings** (gear icon) > **API**
2. Copy the following values:

```
Project URL: https://xxxxx.supabase.co
anon public: eyJhbGc...
service_role: eyJhbGc... (Keep secret!)
```

3. Save these in a secure location

### 1.3 Verify Database Tables

The database should already have these tables:
- `profiles` - User information
- `properties` - Property listings
- `inquiries` - Visit requests

To verify:
1. Go to **Table Editor** in Supabase dashboard
2. Confirm all three tables exist
3. Check that RLS is enabled on all tables

### 1.4 Verify Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Confirm `property-images` bucket exists
3. Check bucket is set to **Public**

### 1.5 Seed Admin Account

On your local machine:

```bash
# Clone or download the project
cd shree-krishna-properties

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your Supabase credentials
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJxxx...
# SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Seed admin account
npx tsx scripts/seed-admin.ts
```

Expected output:
```
Admin user created successfully!
Email: g.mehta1971@gmail.com
Mobile: 7877059117
Password: Kota2020

You can now login using either:
- Email: g.mehta1971@gmail.com
- Mobile: 7877059117
```

### 1.6 Add Sample Data (Optional)

```bash
npx tsx scripts/seed-sample-data.ts
```

This creates 6 sample properties with images from Pexels.

## Part 2: Deploy to Vercel

### 2.1 Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Shree Krishna Properties"

# Create GitHub repository
# Visit https://github.com/new
# Name: shree-krishna-properties
# Leave everything else default
# Click "Create repository"

# Push to GitHub
git remote add origin https://github.com/YOUR-USERNAME/shree-krishna-properties.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy on Vercel

1. Visit [https://vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New..."** > **"Project"**
4. **Import** your `shree-krishna-properties` repository
5. Configure project settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

6. Add **Environment Variables**:

```
VITE_SUPABASE_URL = https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY = eyJxxx...
```

⚠️ **IMPORTANT**: Do NOT add `SUPABASE_SERVICE_ROLE_KEY` to Vercel!

7. Click **"Deploy"**
8. Wait for deployment (usually 2-3 minutes)
9. Your app is live at: `https://shree-krishna-properties.vercel.app`

### 2.3 Configure Custom Domain (Optional)

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Part 3: Alternative - Deploy to Netlify

### 3.1 Build Locally

```bash
npm run build
```

This creates a `dist` folder with production files.

### 3.2 Deploy to Netlify

**Option A: Drag & Drop**
1. Visit [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag the `dist` folder to the upload area
3. Wait for deployment
4. Site is live!

**Option B: Git Integration**
1. Visit [https://app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** > **"Import an existing project"**
3. Connect to GitHub
4. Select `shree-krishna-properties` repository
5. Configure build settings:

```
Build command: npm run build
Publish directory: dist
```

6. Add **Environment Variables**:
   - Go to Site Settings > Environment Variables
   - Add same variables as Vercel

7. Click **"Deploy site"**

## Part 4: Post-Deployment Verification

### 4.1 Test Admin Access

1. Visit your deployed URL
2. Click **"Sign In"**
3. Enter: `g.mehta1971@gmail.com` or `7877059117`
4. Password: `Kota2020`
5. Verify you see the Admin Dashboard

### 4.2 Add First Property

1. Click **"Add New Property"**
2. Fill all required fields
3. Upload 1-4 images
4. Select one as thumbnail
5. Click **"Add Property"**
6. Verify property appears in list

### 4.3 Test User Flow

1. Sign out from admin account
2. Click **"Get Started"** or **"Sign Up"**
3. Fill signup form:
   - Name: Test User
   - Mobile: 9876543210
   - Email: test@example.com
   - Address: Test Address
   - Password: Test1234
4. Click **"Create Account"**
5. Sign in with the new account
6. Browse properties
7. Click on a property
8. Click **"Schedule Visit"**
9. Select date/time and submit
10. Go to **"My Inquiries"** to see status

### 4.4 Verify Admin Inquiry Management

1. Sign out from user account
2. Sign in as admin
3. Click **"View Inquiries"**
4. See the inquiry from test user
5. Click **"Take Action"**
6. Approve with date/time or deny
7. Verify status updates

## Part 5: Continuous Deployment

With Vercel/Netlify + GitHub, every push automatically deploys:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel/Netlify automatically builds and deploys
```

## Part 6: Monitoring & Maintenance

### Check Application Health

**Vercel:**
- Go to your project > Deployments
- Check build logs and runtime logs
- Monitor function invocations

**Netlify:**
- Go to your site > Deploys
- Check deploy logs
- Monitor bandwidth usage

### Supabase Monitoring

1. Go to Supabase Dashboard
2. Check **Database** > **Usage**
3. Monitor:
   - Database size
   - API requests
   - Storage usage
4. Set up alerts for limits

### Regular Maintenance Tasks

- **Weekly**: Check inquiry statuses, respond to users
- **Monthly**: Review database size, clean up old data
- **Quarterly**: Update dependencies, review security

## 🔧 Troubleshooting

### Issue: White screen on deployment

**Cause**: Environment variables not set
**Solution**:
1. Go to Vercel/Netlify settings
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

### Issue: Admin can't login

**Cause**: Admin account not seeded
**Solution**:
```bash
npx tsx scripts/seed-admin.ts
```

### Issue: Images not uploading

**Cause**: Storage bucket missing or RLS misconfigured
**Solution**:
1. Check bucket exists: `property-images`
2. Verify bucket is public
3. Check storage policies

### Issue: Users can't see properties

**Cause**: RLS policies too restrictive
**Solution**:
1. Go to Supabase > Authentication > Policies
2. Verify `properties` table has public SELECT policy
3. Run: `SELECT * FROM properties;` to test

### Issue: Build fails on Vercel

**Cause**: TypeScript errors or missing dependencies
**Solution**:
1. Run `npm run build` locally
2. Fix any TypeScript errors
3. Commit and push again

## 📞 Support

For deployment issues:
1. Check Vercel/Netlify docs
2. Review Supabase documentation
3. Check application logs
4. Contact support team

## 🎉 Success!

Your application is now live and ready for users! 

Next steps:
- Share the URL with potential users
- Add more properties via admin dashboard
- Monitor user inquiries and respond promptly
- Gather feedback and iterate

---

**Deployment completed successfully! 🚀**
