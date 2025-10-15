// Temporary script to fix RLS policies for properties table
// Run this in your browser console on the app page to fix the 401 error

async function fixPropertiesRLS() {
  console.log('🔧 Attempting to fix Properties RLS policies...');
  
  // Since we can't run migrations directly, let's test what's happening
  const supabaseUrl = 'https://wqdrmjrxncpszekxhrhc.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZHJtanJ4bmNwc3pla3hocmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDM5NjUsImV4cCI6MjA3NTkxOTk2NX0.fSRpemNa-dQT0ZJijp6yoKuMZnaMRIeeILghe0HpcAg';
  
  // Test properties access directly
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/properties?select=*&deleted_at=is.null&limit=3`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Properties fetch status:', response.status);
    
    if (response.status === 401) {
      console.log('❌ 401 Unauthorized - RLS is blocking anonymous access');
      console.log('📋 Required fixes in Supabase Dashboard:');
      console.log('1. Go to Table Editor → properties');
      console.log('2. Go to RLS policies');
      console.log('3. Disable RLS temporarily OR');
      console.log('4. Add policy: "Enable read access for anonymous users"');
      console.log('   - Policy name: Allow anonymous read');
      console.log('   - Policy for: SELECT');
      console.log('   - Target roles: anon, authenticated');
      console.log('   - Using expression: deleted_at IS NULL');
    } else if (response.ok) {
      const data = await response.json();
      console.log('✅ Properties access working!', data);
    } else {
      console.log('❌ Unexpected status:', response.status, await response.text());
    }
  } catch (error) {
    console.log('❌ Error testing properties:', error);
  }
  
  // Test with your Supabase client
  if (window.supabase) {
    try {
      const { data, error } = await window.supabase
        .from('properties')
        .select('*')
        .is('deleted_at', null)
        .limit(1);
      
      if (error) {
        console.log('❌ Supabase client error:', error.message);
      } else {
        console.log('✅ Supabase client working:', data);
      }
    } catch (err) {
      console.log('❌ Supabase client test failed:', err);
    }
  }
}

// Run the test
fixPropertiesRLS();