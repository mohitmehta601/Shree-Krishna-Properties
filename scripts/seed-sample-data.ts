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

async function seedSampleData() {
  console.log('Starting sample data seeding...');

  const adminEmail = 'g.mehta1971@gmail.com';

  const { data: adminProfile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', adminEmail)
    .maybeSingle();

  if (!adminProfile) {
    console.error('Admin user not found. Please run seed-admin.ts first.');
    process.exit(1);
  }

  console.log('Admin found, creating sample properties...');

  const sampleProperties = [
    {
      unique_code: 'SKP-20251014-0001',
      name: 'Luxury Villa in Prime Location',
      full_location: 'Sector 5, Aerodrome Circle, Kota, Rajasthan 324005',
      lat: 25.2138,
      lng: 75.8648,
      description: 'Beautiful 3BHK villa with modern amenities, spacious rooms, and excellent ventilation. Perfect for families looking for comfort and style.',
      price: 8500000,
      area_sqft: 2500,
      property_type: 'Villa',
      ad_type: 'Sale',
      direction_facing: 'North',
      length: 50,
      breadth: 50,
      thumbnail_url: 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    },
    {
      unique_code: 'SKP-20251014-0002',
      name: 'Spacious 2BHK Apartment',
      full_location: 'Vigyan Nagar, Near Kota University, Kota, Rajasthan 324009',
      lat: 25.1820,
      lng: 75.8342,
      description: 'Well-maintained 2BHK apartment in a gated community. Close to schools, hospitals, and shopping centers. Ready to move in.',
      price: 3500000,
      area_sqft: 1200,
      property_type: '2BHK',
      ad_type: 'Sale',
      direction_facing: 'East',
      length: 40,
      breadth: 30,
      thumbnail_url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    },
    {
      unique_code: 'SKP-20251014-0003',
      name: 'Commercial Shop in Main Market',
      full_location: 'Nayapura Market, Near Talwandi, Kota, Rajasthan 324005',
      lat: 25.1956,
      lng: 75.8606,
      description: 'Prime location commercial shop perfect for retail business. High footfall area with excellent connectivity. Ground floor with parking space.',
      price: 25000,
      area_sqft: 800,
      property_type: 'Shop',
      ad_type: 'Rent',
      direction_facing: 'South',
      length: 40,
      breadth: 20,
      thumbnail_url: 'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    },
    {
      unique_code: 'SKP-20251014-0004',
      name: 'Premium Plot for Construction',
      full_location: 'Dadabari Extension, Behind RPS School, Kota, Rajasthan 324009',
      lat: 25.1621,
      lng: 75.8294,
      description: 'Residential plot in developing area with all modern facilities. Clear title, ready for construction. Peaceful neighborhood with good connectivity.',
      price: 4500000,
      area_sqft: 3000,
      property_type: 'Plot',
      ad_type: 'Sale',
      direction_facing: 'West',
      length: 60,
      breadth: 50,
      thumbnail_url: 'https://images.pexels.com/photos/2251247/pexels-photo-2251247.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/2404949/pexels-photo-2404949.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    },
    {
      unique_code: 'SKP-20251014-0005',
      name: 'Modern Studio Apartment',
      full_location: 'Industrial Area, Near Coaching Institutes, Kota, Rajasthan 324001',
      lat: 25.1804,
      lng: 75.8370,
      description: 'Fully furnished studio apartment perfect for students or working professionals. All amenities included with 24/7 security.',
      price: 12000,
      area_sqft: 450,
      property_type: 'Studio apartment',
      ad_type: 'Rent',
      direction_facing: 'North',
      length: 25,
      breadth: 18,
      thumbnail_url: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    },
    {
      unique_code: 'SKP-20251014-0006',
      name: 'Elegant Duplex House',
      full_location: 'Kunhari, Kota-Bundi Road, Kota, Rajasthan 324010',
      lat: 25.2456,
      lng: 75.8156,
      description: 'Spacious duplex with 4 bedrooms, modular kitchen, and terrace garden. Premium construction with marble flooring throughout.',
      price: 12500000,
      area_sqft: 3500,
      property_type: 'Duplex',
      ad_type: 'Sale',
      direction_facing: 'East',
      length: 70,
      breadth: 50,
      thumbnail_url: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800',
      images: [
        'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=800'
      ],
      created_by: adminProfile.user_id
    }
  ];

  for (const property of sampleProperties) {
    try {
      const { error } = await supabase
        .from('properties')
        .insert(property);

      if (error) {
        console.error(`Error inserting ${property.name}:`, error.message);
      } else {
        console.log(`✓ Created: ${property.name}`);
      }
    } catch (error) {
      console.error(`Failed to insert ${property.name}:`, error);
    }
  }

  console.log('\nSample data seeding completed!');
  console.log(`\nTotal properties created: ${sampleProperties.length}`);
  console.log('\nYou can now view these properties in the application.');
}

seedSampleData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding data:', error);
    process.exit(1);
  });
