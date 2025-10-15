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

async function fixAdminStatus() {
  try {
    console.log('🔍 Searching for admin profile with email: admin@gmail.com')
    
    // Find the admin profile by email
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@gmail.com')
      .single()

    if (profileError) {
      console.error('❌ Error finding admin profile:', profileError)
      return
    }

    if (!adminProfile) {
      console.error('❌ No admin profile found with email: admin@gmail.com')
      return
    }

    console.log('✅ Admin profile found!')
    console.log('📧 Email:', adminProfile.email)
    console.log('📱 Phone:', adminProfile.mobile || adminProfile.phone)
    console.log('👤 Name:', adminProfile.name || adminProfile.full_name)
    console.log('🔑 Current is_admin status:', adminProfile.is_admin)

    if (!adminProfile.is_admin) {
      console.log('\n🔧 Setting is_admin to true...')
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('user_id', adminProfile.user_id)

      if (updateError) {
        console.error('❌ Error updating admin status:', updateError)
      } else {
        console.log('✅ Admin status updated successfully!')
        console.log('🎉 The user admin@gmail.com is now an admin!')
      }
    } else {
      console.log('✅ Admin status is already correct!')
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

fixAdminStatus()