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

async function debugUserProfile() {
  try {
    const userId = "19841a7e-3489-42b0-8ca6-b6bae5b5ff2b"
    
    console.log('🔍 Checking user in auth.users table...')
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId)
    
    if (authError) {
      console.error('❌ Error fetching auth user:', authError)
      return
    }
    
    console.log('✅ Auth user found:')
    console.log('📧 Email:', authUser.user?.email)
    console.log('🆔 User ID:', authUser.user?.id)
    console.log('📧 Confirmed:', authUser.user?.email_confirmed_at ? 'Yes' : 'No')
    
    console.log('\n🔍 Checking profile in profiles table...')
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
    
    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError)
      return
    }
    
    console.log('📊 Profiles found:', profiles?.length || 0)
    
    if (profiles && profiles.length > 0) {
      profiles.forEach((profile, index) => {
        console.log(`\n👤 Profile ${index + 1}:`)
        console.log('📧 Email:', profile.email)
        console.log('📱 Phone:', profile.mobile || profile.phone)
        console.log('👤 Name:', profile.name || profile.full_name)
        console.log('🔑 Is Admin:', profile.is_admin)
        console.log('🆔 User ID:', profile.user_id)
      })
    } else {
      console.log('❌ No profiles found for this user!')
      
      // Let's also check if there are any profiles with admin@gmail.com
      console.log('\n🔍 Checking for any admin@gmail.com profiles...')
      const { data: adminProfiles, error: adminError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'admin@gmail.com')
      
      if (adminError) {
        console.error('❌ Error fetching admin profiles:', adminError)
      } else {
        console.log('📊 Admin profiles found:', adminProfiles?.length || 0)
        if (adminProfiles && adminProfiles.length > 0) {
          adminProfiles.forEach((profile, index) => {
            console.log(`\n🎯 Admin Profile ${index + 1}:`)
            console.log('📧 Email:', profile.email)
            console.log('📱 Phone:', profile.mobile || profile.phone)
            console.log('👤 Name:', profile.name || profile.full_name)
            console.log('🔑 Is Admin:', profile.is_admin)
            console.log('🆔 User ID:', profile.user_id)
          })
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

debugUserProfile()