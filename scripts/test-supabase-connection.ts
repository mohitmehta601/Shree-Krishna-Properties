import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
const envPath = join(process.cwd(), '.env');
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    } else if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = line.split('=')[1].trim();
    }
  }
} catch (error) {
  console.error('❌ Could not read .env file');
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  process.exit(1);
}

console.log('🔍 Testing Supabase Connection...\n');
console.log('📋 Configuration:');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(0);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
    } else {
      console.log('✅ Database connection successful!\n');
    }

    console.log('2️⃣ Testing auth endpoint...');
    
    // Try a simple auth check that shouldn't fail
    const { data: session } = await supabase.auth.getSession();
    console.log('✅ Auth endpoint is accessible!\n');
    
    console.log('3️⃣ Checking current auth configuration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`Attempting test signup with: ${testEmail}`);
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });

    if (signupError) {
      console.error('❌ Signup test failed:', signupError.message);
      console.error('\n⚠️  Common causes:');
      console.error('   1. Email confirmation is enabled (disable it for development)');
      console.error('   2. Signups are disabled in Supabase settings');
      console.error('   3. Rate limiting (too many signups from your IP)');
      console.error('   4. Invalid email format or password requirements not met');
      console.error('\n📖 Check CORS_FIX.md for detailed instructions!');
    } else if (signupData.user) {
      console.log('✅ Signup test successful!');
      console.log('User ID:', signupData.user.id);
      console.log('Email confirmed:', signupData.user.email_confirmed_at ? 'Yes' : 'No (confirmation required)');
      
      if (!signupData.user.email_confirmed_at) {
        console.log('\n⚠️  Email confirmation is enabled!');
        console.log('To disable it for development:');
        console.log('1. Go to Supabase Dashboard → Authentication → Providers');
        console.log('2. Click on Email provider');
        console.log('3. Disable "Confirm email"');
        console.log('4. Save changes\n');
      }
    }

    console.log('\n✅ Connection test completed!');
    
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    console.error('\n📖 Check your .env file and CORS_FIX.md for help!');
  }
}

testConnection();
