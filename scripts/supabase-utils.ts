/**
 * Supabase Management Utilities
 * 
 * This file contains helper functions for managing your Supabase project
 * from VS Code and command line.
 */

import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/lib/database.types.js'

// Load environment variables from .env file
config()

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!')
  console.error('Please check your .env file for VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create admin client with service role key
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  console.log('📊 Database Statistics:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    // Count profiles
    const { count: profilesCount } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
    
    // Count properties
    const { count: propertiesCount } = await supabaseAdmin
      .from('properties')
      .select('*', { count: 'exact', head: true })
    
    // Count inquiries
    const { count: inquiriesCount } = await supabaseAdmin
      .from('inquiries')
      .select('*', { count: 'exact', head: true })
    
    // Count admin users
    const { count: adminCount } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_admin', true)
    
    console.log(`👥 Profiles: ${profilesCount}`)
    console.log(`🏠 Properties: ${propertiesCount}`)
    console.log(`📝 Inquiries: ${inquiriesCount}`)
    console.log(`👑 Admin Users: ${adminCount}`)
    
  } catch (error) {
    console.error('❌ Error fetching database stats:', error)
  }
}

/**
 * List recent activities
 */
export async function getRecentActivities() {
  console.log('\n📅 Recent Activities:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  
  try {
    // Recent profiles
    const { data: recentProfiles } = await supabaseAdmin
      .from('profiles')
      .select('name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Recent properties
    const { data: recentProperties } = await supabaseAdmin
      .from('properties')
      .select('name, unique_code, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    // Recent inquiries
    const { data: recentInquiries } = await supabaseAdmin
      .from('inquiries')
      .select('id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)
    
    console.log('\n👥 Recent Profiles:')
    recentProfiles?.forEach(profile => {
      console.log(`  • ${profile.name} (${profile.email}) - ${new Date(profile.created_at!).toLocaleDateString()}`)
    })
    
    console.log('\n🏠 Recent Properties:')
    recentProperties?.forEach(property => {
      console.log(`  • ${property.name} (${property.unique_code}) - ${new Date(property.created_at!).toLocaleDateString()}`)
    })
    
    console.log('\n📝 Recent Inquiries:')
    recentInquiries?.forEach(inquiry => {
      console.log(`  • Inquiry ${inquiry.id.slice(0, 8)}... (${inquiry.status}) - ${new Date(inquiry.created_at!).toLocaleDateString()}`)
    })
    
  } catch (error) {
    console.error('❌ Error fetching recent activities:', error)
  }
}

/**
 * Main function to run dashboard
 */
export async function runDashboard() {
  console.log('🚀 Supabase Project Dashboard')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🔗 Project URL: ${supabaseUrl}`)
  console.log(`🏷️  Project ID: ldhvlkdpclebeorxfmqp`)
  console.log('')
  
  await getDatabaseStats()
  await getRecentActivities()
  
  console.log('\n✨ Dashboard complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

// Run dashboard if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDashboard().catch(console.error)
}