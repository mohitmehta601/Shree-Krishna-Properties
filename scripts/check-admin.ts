import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing environment variables: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkAdminProfile() {
  try {
    console.log('Checking admin profile...')
    
    // Find the admin profile by email
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@gmail.com')
      .single()

    if (profileError || !adminProfile) {
      console.error('Admin profile not found:', profileError)
      return
    }

    console.log('Admin profile found:')
    console.log('📧 Email:', adminProfile.email)
    console.log('📱 Phone:', adminProfile.mobile)
    console.log('👤 Name:', adminProfile.name)
    console.log('🔑 Is Admin:', adminProfile.is_admin)
    console.log('🆔 User ID:', adminProfile.user_id)
    console.log('📅 Created:', adminProfile.created_at)

    if (!adminProfile.is_admin) {
      console.log('\n❌ The admin profile has is_admin set to false!')
      console.log('🔧 Fixing admin status...')

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ is_admin: true })
        .eq('user_id', adminProfile.user_id)

      if (updateError) {
        console.error('Error updating admin status:', updateError)
      } else {
        console.log('✅ Admin status updated successfully!')
      }
    } else {
      console.log('✅ Admin status is correct!')
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

checkAdminProfile()