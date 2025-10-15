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

async function updateAdminCredentials() {
  try {
    console.log('Finding existing admin user...')
    
    // Find the existing admin profile by email
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('email', 'g.mehta1971@gmail.com')
      .single()

    if (profileError || !adminProfile) {
      console.error('No admin profile found:', profileError)
      return
    }

    console.log('Found admin profile:', adminProfile.email)

    // Update the user's email in auth.users
    const { error: updateUserError } = await supabase.auth.admin.updateUserById(
      adminProfile.user_id,
      {
        email: 'admin@gmail.com',
        password: 'Admin@123'
      }
    )

    if (updateUserError) {
      console.error('Error updating user credentials:', updateUserError)
      return
    }

    // Update the profile table
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        email: 'admin@gmail.com',
        phone: '9999999999'
      })
      .eq('user_id', adminProfile.user_id)

    if (updateProfileError) {
      console.error('Error updating profile:', updateProfileError)
      return
    }

    console.log('✅ Admin credentials updated successfully!')
    console.log('📧 Email: admin@gmail.com')
    console.log('🔑 Password: Admin@123')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

updateAdminCredentials()