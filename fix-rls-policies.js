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

async function fixProfilesRLS() {
  try {
    console.log('🔧 Fixing profiles RLS policies...')
    
    // Drop all existing problematic policies
    const policiesToDrop = [
      "Users can insert own profile on signup",
      "Users can view own profile", 
      "Users can update own profile",
      "Authenticated users can view all profiles"
    ]
    
    for (const policyName of policiesToDrop) {
      console.log(`🗑️ Dropping policy: ${policyName}`)
      try {
        await supabase.rpc('exec', {
          sql: `DROP POLICY IF EXISTS "${policyName}" ON profiles;`
        })
      } catch (error) {
        console.log(`⚠️ Could not drop policy ${policyName}:`, error)
      }
    }
    
    console.log('✅ Dropped existing policies')
    
    // Create new simplified policies
    console.log('🆕 Creating new RLS policies...')
    
    // Allow users to insert their own profile
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can insert own profile"
          ON profiles FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = user_id);
      `
    })
    console.log('✅ Created insert policy')
    
    // Allow users to view their own profile
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can view own profile"
          ON profiles FOR SELECT
          TO authenticated
          USING (auth.uid() = user_id);
      `
    })
    console.log('✅ Created select own profile policy')
    
    // Allow users to update their own profile
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "Users can update own profile"
          ON profiles FOR UPDATE
          TO authenticated
          USING (auth.uid() = user_id);
      `
    })
    console.log('✅ Created update policy')
    
    // Allow all authenticated users to view all profiles (needed for admin functionality)
    await supabase.rpc('exec', {
      sql: `
        CREATE POLICY "All authenticated users can view profiles"
          ON profiles FOR SELECT
          TO authenticated
          USING (true);
      `
    })
    console.log('✅ Created global view policy')
    
    console.log('🎉 All RLS policies updated successfully!')
    
  } catch (error) {
    console.error('💥 Error fixing RLS policies:', error)
  }
}

fixProfilesRLS()