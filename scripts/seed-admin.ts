import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  // Updated admin credentials as requested:
  // Email: admin@gmail.com, Password: Admin@123
  const adminEmail = 'admin@gmail.com';
  const adminMobile = '9999999999';
  const adminPassword = 'Admin@123';

  console.log('Checking if admin user already exists...');

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', adminEmail)
    .maybeSingle();

  if (existingProfile) {
    console.log('Admin user already exists!');
    console.log('Email:', adminEmail);
    console.log('Mobile:', adminMobile);
    return;
  }

  console.log('Creating admin user...');

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: {
      name: 'Admin User',
      mobile: adminMobile,
      address: 'Admin Address',
      is_admin: true
    }
  });

  if (authError) {
    console.error('Error creating admin user:', authError);
    process.exit(1);
  }

  // Create profile for the admin user
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      user_id: authData.user.id,
      name: 'Admin User',
      mobile: adminMobile,
      email: adminEmail,
      address: 'Admin Address',
      is_admin: true
    });

  if (profileError) {
    console.error('Error creating admin profile:', profileError);
    process.exit(1);
  }

  console.log('Admin user created successfully!');
  console.log('Email:', adminEmail);
  console.log('Mobile:', adminMobile);
  console.log('Password:', adminPassword);
  console.log('\nYou can now login using either:');
  console.log('- Email:', adminEmail);
  console.log('- Mobile:', adminMobile);
}

seedAdmin()
  .then(() => {
    console.log('\nAdmin seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding admin:', error);
    process.exit(1);
  });
