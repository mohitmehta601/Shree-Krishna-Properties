# Troubleshooting Guide - Signup Issues

## Issue: "Failed to fetch" Error During Signup

### Symptom
When trying to create a new account, you see an error message "Failed to fetch" and the account is not created.

### Common Causes & Solutions

#### 1. Email Confirmation Required (Most Common)

**Cause:** Supabase has email confirmation enabled by default, which prevents immediate signups without email verification.

**Solution:**

1. Go to your Supabase Dashboard
2. Navigate to: **Authentication** > **Providers** > **Email**
3. Scroll down to **"Confirm email"**
4. **Disable** the "Confirm email" toggle
5. Click **Save**

This allows users to sign up and login immediately without email confirmation.

#### 2. CORS Issues

**Cause:** Your local development server might not be whitelisted in Supabase.

**Solution:**

1. Go to Supabase Dashboard > **Authentication** > **URL Configuration**
2. Add `http://localhost:5173` to **Site URL**
3. Add `http://localhost:5173/**` to **Redirect URLs**
4. Click **Save**

#### 3. Network Connectivity

**Cause:** Firewall or network blocking Supabase API calls.

**Solution:**

1. Check browser console for detailed error messages
2. Verify you can access: `https://xpxqqlvrmbavondphekq.supabase.co`
3. Disable VPN or firewall temporarily to test
4. Check if your ISP is blocking Supabase domains

#### 4. Invalid Environment Variables

**Cause:** Missing or incorrect Supabase credentials in `.env` file.

**Solution:**

1. Verify `.env` file exists in project root
2. Check variables are correct:
   ```env
   VITE_SUPABASE_URL=https://xpxqqlvrmbavondphekq.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. Restart dev server after changing `.env`:
   ```bash
   npm run dev
   ```

#### 5. Rate Limiting

**Cause:** Too many signup attempts in a short time.

**Solution:**

1. Wait 5-10 minutes before trying again
2. Check Supabase Dashboard > **Authentication** > **Rate Limits**
3. Increase rate limits if needed (in production)

### Debugging Steps

#### Step 1: Check Browser Console

Open browser DevTools (F12) > Console tab:
- Look for red error messages
- Note the exact error text
- Check Network tab for failed requests

#### Step 2: Test API Connection

Open browser console and run:
```javascript
fetch('https://xpxqqlvrmbavondphekq.supabase.co/auth/v1/health')
  .then(r => console.log('Connection OK'))
  .catch(e => console.error('Connection failed:', e))
```

#### Step 3: Check Supabase Auth Settings

1. Go to Supabase Dashboard
2. **Authentication** > **Settings**
3. Verify:
   - ✅ Email provider is enabled
   - ✅ "Confirm email" is **disabled**
   - ✅ "Enable email signups" is **enabled**

#### Step 4: Test with Admin Account

Try logging in with admin credentials to verify basic connectivity:
```
Email: g.mehta1971@gmail.com
Password: Kota2020
```

If admin login works but signup doesn't, it's likely an auth configuration issue.

### Manual Account Creation (Workaround)

If signup still fails, create account via Supabase Dashboard:

1. Go to **Authentication** > **Users**
2. Click **Add User**
3. Enter:
   - Email
   - Password
   - User Metadata (JSON):
     ```json
     {
       "name": "Test User",
       "mobile": "9876543210",
       "address": "Test Address",
       "is_admin": false
     }
     ```
4. Click **Create User**
5. The trigger will automatically create the profile

### Still Having Issues?

1. **Check Supabase Status**: https://status.supabase.com
2. **Review Logs**: Supabase Dashboard > **Logs** > **Auth Logs**
3. **Enable Debug Mode**:
   ```javascript
   // In src/lib/supabase.ts, add:
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(url, key, {
     auth: {
       debug: true  // Add this line
     }
   })
   ```
4. **Contact Support**: Check the application logs and provide error details

### Prevention

For production deployment:

1. **Disable email confirmation** initially for smooth user experience
2. Add proper error messages in the UI
3. Implement retry logic for failed requests
4. Set up monitoring for failed signups
5. Consider adding social auth (Google, GitHub) as alternatives

---

**Quick Fix Checklist:**
- [ ] Email confirmation disabled in Supabase
- [ ] CORS URLs configured (localhost:5173)
- [ ] Environment variables correct
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Try in incognito mode
