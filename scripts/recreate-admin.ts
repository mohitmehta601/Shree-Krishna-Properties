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

async function recreateAdmin() {
  try {
    console.log('Finding existing admin user...')
    
    // Find the existing admin profile
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('email', 'g.mehta1971@gmail.com')
      .single()

    if (adminProfile) {
      console.log('Deleting existing admin user...')
      
      // Delete from profiles first
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', adminProfile.user_id)

      // Delete the auth user
      await supabase.auth.admin.deleteUser(adminProfile.user_id)
      
      console.log('Existing admin user deleted')
    }

    console.log('Creating new admin user...')
    
    // Create the new admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'admin@gmail.com',
      password: 'Admin@123',
      email_confirm: true
    })

    if (createError || !newUser.user) {
      console.error('Error creating admin user:', createError)
      return
    }

    console.log('Admin user created successfully!')

    // Create the admin profile
    const { error: profileInsertError } = await supabase
      .from('profiles')
      .insert({
        user_id: newUser.user.id,
        email: 'admin@gmail.com',
        phone: '9999999999',
        full_name: 'Administrator'
      })

    if (profileInsertError) {
      console.error('Error creating admin profile:', profileInsertError)
      return
    }

    console.log('✅ New admin account created successfully!')
    console.log('📧 Email: admin@gmail.com')
    console.log('🔑 Password: Admin@123')
    console.log('📱 Phone: 9999999999')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

recreateAdmin()