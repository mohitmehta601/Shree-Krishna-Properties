// Quick Supabase connection test
// Run this in browser console to test Supabase directly

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...');
  
  const supabaseUrl = 'https://wqdrmjrxncpszekxhrhc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZHJtanJ4bmNwc3pla3hocmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDM5NjUsImV4cCI6MjA3NTkxOTk2NX0.fSRpemNa-dQT0ZJijp6yoKuMZnaMRIeeILghe0HpcAg';
  
  // Test basic connection
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Basic REST API:', response.status === 200 ? 'SUCCESS' : 'FAILED');
  } catch (error) {
    console.log('❌ Basic REST API: FAILED', error);
  }
  
  // Test auth endpoint directly
  try {
    const testSignup = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    const result = await testSignup.text();
    console.log('🔐 Auth Signup Test:', testSignup.status, result);
    
    if (testSignup.status === 403) {
      console.log('❌ 403 Error: This confirms the issue is with Supabase auth settings');
    }
  } catch (error) {
    console.log('❌ Auth Test Failed:', error);
  }
}

// Run the test
testSupabaseConnection();