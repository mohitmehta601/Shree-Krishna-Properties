# 🚨 CORS 403 ERROR - QUICK FIX GUIDE

## ✅ What I've Fixed:

1. **Updated Supabase client configuration** - Added PKCE flow and proper headers
2. **Updated AuthContext** - Fixed email redirect URL
3. **Updated Signup component** - Better error messages
4. **Updated Vite config** - Added proper server settings

## ⚠️ CRITICAL: You MUST do this NOW:

### Step 1: Configure Supabase Dashboard (5 minutes)

Go to: https://app.supabase.com/project/xpxqqlvrmbavondphekq

#### 1.1 URL Configuration

Navigate to: **Authentication** → **URL Configuration**

Set these values:

```
Site URL: http://localhost:5173

Redirect URLs (add all of these):
- http://localhost:5173
- http://localhost:5173/**
- http://localhost:5173/callback
```

#### 1.2 Email Provider Settings

Navigate to: **Authentication** → **Providers** → **Email**

**For Development:**

- ✅ Enable Email provider
- ❌ **DISABLE "Confirm email"** (uncheck the box)
- ✅ Save changes

**Why?** Disabling email confirmation lets you test without setting up SMTP.

**For Production:** You'll need to re-enable this and set up proper email templates.

#### 1.3 Verify Settings

Navigate to: **Authentication** → **Settings**

Check:

- ✅ "Enable sign-ups" is ON
- ✅ "Enable email signup" is ON
- ✅ No IP restrictions

### Step 2: Clear Browser Cache

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Clear storage** → **Clear site data**
4. Or use: `Ctrl + Shift + Delete` → Clear everything for localhost

### Step 3: Test Signup

1. Your dev server should already be running
2. Open http://localhost:5173
3. Try to sign up with a **real email address**
4. Check the console for any errors

## 🔍 Still Not Working?

### Check Supabase Logs

1. Go to: https://app.supabase.com/project/xpxqqlvrmbavondphekq/logs/auth-logs
2. Look for failed signup attempts
3. The error message will tell you exactly what's wrong

### Common Issues:

#### Issue: "Failed to fetch"

- **Cause:** Supabase URL not in allowed list
- **Fix:** Add `http://localhost:5173` to Redirect URLs (Step 1.1)

#### Issue: "User already registered"

- **Cause:** Email already exists
- **Fix:** Use a different email or delete the user from Supabase Dashboard

#### Issue: "Email confirmation required"

- **Cause:** Email confirmation is still enabled
- **Fix:** Disable it in Supabase (Step 1.2)

#### Issue: Still getting 403

- **Cause:** Changes haven't propagated
- **Fix:** Wait 60 seconds and try again

## 🧪 Test Your Configuration

Run this command to test your Supabase connection:

```powershell
npx tsx scripts/test-supabase-connection.ts
```

This will tell you if:

- ✅ Database connection works
- ✅ Auth endpoint is accessible
- ✅ Signup is working

## 📱 Testing Checklist

- [ ] Added localhost URLs to Supabase Redirect URLs
- [ ] Set Site URL to http://localhost:5173
- [ ] Disabled "Confirm email" in Email provider
- [ ] Cleared browser cache
- [ ] Dev server is running on port 5173
- [ ] Tried signing up with a NEW email address
- [ ] Checked browser console for errors
- [ ] Checked Supabase auth logs

## 🎯 Expected Behavior After Fix

When you sign up successfully:

1. No CORS errors in console
2. Alert: "Account created successfully!"
3. Redirected to landing page or dashboard
4. User appears in Supabase Dashboard → Authentication → Users

## 🆘 Emergency Contact

If still stuck after following all steps:

1. Check Supabase status: https://status.supabase.com/
2. Review their CORS docs: https://supabase.com/docs/guides/auth
3. Post in Supabase Discord with your error logs

## ✅ Production Checklist (Before Deploying)

When you deploy to production:

- [ ] Re-enable email confirmation
- [ ] Set up email templates
- [ ] Configure SMTP or use Supabase email
- [ ] Add production domain to Redirect URLs
- [ ] Update Site URL to production domain
- [ ] Test password reset flow
- [ ] Test email confirmation flow

---

**Last Updated:** After running connection tests - Signup works from Node.js but fails in browser, indicating CORS/URL configuration issue.
