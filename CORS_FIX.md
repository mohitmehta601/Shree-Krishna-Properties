# CORS 403 Forbidden Error Fix

## The Problem

You're getting a `403 Forbidden` error when trying to sign up users. This is NOT a typical CORS issue - it's Supabase blocking the request.

## Root Cause

The 403 error from Supabase Auth API typically means one of these issues:

### 1. Email Confirmation is Required (Most Common)

Your Supabase project requires email confirmation, but users aren't confirming their emails.

### 2. Sign-ups Might Be Disabled

Sign-ups could be disabled in your project settings.

### 3. Invalid Configuration

Your project might have restrictions on which URLs can trigger auth flows.

## Solution Steps

### Step 1: Check Supabase Dashboard Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: `xpxqqlvrmbavondphekq`
3. Navigate to **Authentication** → **Settings** (or **URL Configuration**)

### Step 2: Configure Email Authentication

Navigate to **Authentication** → **Providers** → **Email**:

1. Make sure **Enable Email provider** is turned ON
2. For development, **disable "Confirm email"**:
   - Uncheck **"Confirm email"** option
   - This allows users to sign up without email confirmation
3. For production, you'll need to:
   - Set up proper email templates
   - Configure SMTP settings or use Supabase's email service

### Step 3: Configure Site URL and Redirect URLs

Navigate to **Authentication** → **URL Configuration**:

1. Set **Site URL** to: `http://localhost:5173`
2. Add **Redirect URLs**:
   - `http://localhost:5173/**`
   - `http://localhost:5173`
   - Your production domain when deploying

### Step 4: Verify Auth Settings

Navigate to **Authentication** → **Settings**:

1. Check **"Enable sign-ups"** is turned ON
2. Verify **JWT expiry** is reasonable (default 3600 seconds is fine)
3. Make sure no IP restrictions are blocking localhost

### Step 5: Restart Your Development Server

After making changes in Supabase:

```powershell
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing the Fix

1. Clear your browser cache and cookies for `localhost:5173`
2. Open DevTools → Application → Clear storage
3. Try signing up again with a new email
4. Check the Network tab for the actual error message from Supabase

## Alternative: Use Service Role for Testing

If you need to bypass email confirmation for testing, you can create a test signup function that uses the service role key. **WARNING: Only use this in development!**

## Common Mistakes to Avoid

1. ❌ Don't add `http://localhost:5173` to CORS settings in Supabase - it's not needed
2. ❌ Don't use service role key in frontend code
3. ❌ Don't forget to enable email confirmation before going to production
4. ✅ Do test with a real email address (not fake ones)
5. ✅ Do check your Supabase project's email quota

## Still Having Issues?

Check the Supabase logs:

1. Go to **Logs** → **Auth** in your Supabase dashboard
2. Look for failed signup attempts
3. The error message will tell you exactly what's wrong

## Quick Fix for Development

If you just want to get unblocked for development:

1. Go to Supabase Dashboard → Authentication → Providers → Email
2. **Disable "Confirm email"**
3. Save the changes
4. Wait 30 seconds for changes to propagate
5. Try signing up again

This will let you develop without email confirmation. **Remember to re-enable it before production!**
