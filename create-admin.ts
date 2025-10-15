import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔐 Environment check:');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.log('Expected:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedAdmin() {
  const adminEmail = 'g.mehta1971@gmail.com';
  const adminMobile = '7877059117';
  const adminPassword = 'Kota2020';

  console.log('🔍 Checking if admin user already exists...');

  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .maybeSingle();

    if (existingProfile) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email:', adminEmail);
      console.log('📱 Mobile:', adminMobile);
      console.log('🔑 Password:', adminPassword);
      console.log('\n🚀 You can now login to access the admin panel!');
      return;
    }

    console.log('👤 Creating admin user...');

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
      console.error('❌ Error creating admin user:', authError);
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!');

    // Now create the profile
    if (authData.user) {
      console.log('👤 Creating admin profile...');
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
        console.error('⚠️ Error creating profile:', profileError);
      } else {
        console.log('✅ Admin profile created successfully!');
      }
    }

    console.log('\n🎉 Admin Setup Complete!');
    console.log('📧 Email:', adminEmail);
    console.log('📱 Mobile:', adminMobile);
    console.log('🔑 Password:', adminPassword);
    console.log('\n🚀 You can now login using either:');
    console.log('- Email:', adminEmail);
    console.log('- Mobile:', adminMobile);

  } catch (error) {
    console.error('❌ Error during admin creation:', error);
    process.exit(1);
  }
}

seedAdmin()
  .then(() => {
    console.log('\n✨ Admin seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error seeding admin:', error);
    process.exit(1);
  });