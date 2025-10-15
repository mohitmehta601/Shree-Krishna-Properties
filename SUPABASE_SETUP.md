# Supabase Configuration Guide

## ⚠️ Fix CORS Error - Required Settings

### 1. Configure Authentication URLs

Go to: **Supabase Dashboard** → **Authentication** → **URL Configuration**

**Site URL:**

```
http://localhost:5173
```

**Redirect URLs (Add these):**

```
http://localhost:5173
http://localhost:5173/**
http://localhost:5173/auth/callback
```

For production, also add:

```
https://your-production-domain.com
https://your-production-domain.com/**
https://your-production-domain.com/auth/callback
```

### 2. Enable Email Provider & Disable Email Confirmation (Development)

Go to: **Supabase Dashboard** → **Authentication** → **Providers** → **Email**

**Settings:**

- ✅ **Enable email provider**: ON
- ✅ **Enable sign ups**: ON
- ❌ **Confirm email**: OFF (for development)
- ✅ **Secure email change**: ON
- ✅ **Secure password change**: ON

**Email Templates (optional):**

- You can customize the email templates later when you enable email confirmation

### 3. Security Settings

Go to: **Supabase Dashboard** → **Authentication** → **Policies**

**Rate Limiting:**

- Keep default settings for now
- Adjust if you get rate limit errors during testing

**Session Settings:**
Go to: **Authentication** → **Settings**

- **JWT expiry**: 3600 (1 hour) - default is fine
- **Refresh token rotation**: Enabled (recommended)

### 4. Email Rate Limits (if testing signups frequently)

Go to: **Project Settings** → **API**

Check your current plan's rate limits. Free tier has:

- 4 emails per hour for email confirmation
- If disabled confirmation, this won't affect you

## Testing After Configuration

1. **Restart your development server:**

   ```powershell
   # Stop current server (Ctrl+C) then:
   npm run dev
   ```

2. **Clear browser cache and cookies:**

   - Open DevTools (F12)
   - Right-click refresh button → "Empty Cache and Hard Reload"
   - Or use incognito mode

3. **Test signup:**

   - Go to http://localhost:5173
   - Click "Sign Up"
   - Fill in the form
   - Submit

4. **Check Supabase Auth Logs:**
   - Go to: **Authentication** → **Users** (to see if user was created)
   - Go to: **Logs** → **Auth** (to see detailed logs)

## Common Issues

### Issue: Still getting CORS error after configuration

**Solution:**

1. Make sure you clicked **Save** in Supabase dashboard
2. Wait 1-2 minutes for changes to propagate
3. Clear browser cache completely
4. Restart dev server
5. Try in incognito mode

### Issue: "Email address is invalid"

**Solution:**

1. Disable email confirmation (step 2 above)
2. Make sure "Enable sign ups" is ON
3. Check rate limits haven't been exceeded

### Issue: "User already registered"

**Solution:**

1. Go to **Authentication** → **Users**
2. Find and delete the test user
3. Try again

### Issue: 403 Forbidden

**Solution:**

1. Check if your IP is blocked
2. Verify VITE_SUPABASE_ANON_KEY is correct
3. Make sure RLS policies are correctly set up (already done via migrations)

## Production Checklist

When deploying to production:

- [ ] Add production URL to Site URL
- [ ] Add production URL to Redirect URLs
- [ ] Enable email confirmation
- [ ] Configure custom SMTP (optional, but recommended)
- [ ] Set up custom email templates
- [ ] Review and adjust rate limits
- [ ] Enable password strength requirements
- [ ] Set up password recovery flow
- [ ] Configure OAuth providers (Google, GitHub, etc.) if needed

## Current Configuration

**Project:** wqdrmjrxncpszekxhrhc
**URL:** https://wqdrmjrxncpszekxhrhc.supabase.co

**Admin Account:**

- Email: g.mehta1971@gmail.com
- Mobile: 7877059117
- Password: Kota2020

**Environment Variables (in .env):**

```env
VITE_SUPABASE_URL=https://wqdrmjrxncpszekxhrhc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZHJtanJ4bmNwc3pla3hocmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDM5NjUsImV4cCI6MjA3NTkxOTk2NX0.fSRpemNa-dQT0ZJijp6yoKuMZnaMRIeeILghe0HpcAg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZHJtanJ4bmNwc3pla3hocmhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM0Mzk2NSwiZXhwIjoyMDc1OTE5OTY1fQ.qO3UQQoK4k1UP0NSrOqborToXEUIJRY9ZSWHiMBqZpA
```
