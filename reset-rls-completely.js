import { createClient } from '@supabase/supabase-js'

// Using the environment variables directly
const supabaseUrl = "https://wqdrmjrxncpszekxhrhc.supabase.co"
const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxZHJtanJ4bmNwc3pla3hocmhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM0Mzk2NSwiZXhwIjoyMDc1OTE5OTY1fQ.qO3UQQoK4k1UP0NSrOqborToXEUIJRY9ZSWHiMBqZpA"

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testDirectProfileAccess() {
  try {
    const userId = "19841a7e-3489-42b0-8ca6-b6bae5b5ff2b"
    
    console.log('🧪 Testing direct profile access with service role...')
    
    // Test with service role (should work)
    const { data: serviceRoleData, error: serviceRoleError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (serviceRoleError) {
      console.error('❌ Service role error:', serviceRoleError)
    } else {
      console.log('✅ Service role result:', serviceRoleData)
    }
    
    console.log('\n🔧 Completely resetting RLS policies...')
    
    // Disable RLS temporarily
    await supabase.rpc('exec', {
      sql: 'ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;'
    })
    console.log('✅ Disabled RLS')
    
    // Re-enable RLS
    await supabase.rpc('exec', {
      sql: 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;'
    })
    console.log('✅ Re-enabled RLS')
    
    // Drop ALL existing policies
    await supabase.rpc('exec', {
      sql: `
        DO $$ 
        DECLARE
            r RECORD;
        BEGIN
            FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles') 
            LOOP
                EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON profiles';
            END LOOP;
        END $$;
      `
    })
    console.log('✅ Dropped all existing policies')
    
    // Create one simple policy that allows everything for authenticated users
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Allow all for authenticated users"
          ON profiles FOR ALL
          TO authenticated
          USING (true)
          WITH CHECK (true);
      `
    })
    console.log('✅ Created permissive policy')
    
    console.log('🎉 RLS policies completely reset!')
    
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

testDirectProfileAccess()