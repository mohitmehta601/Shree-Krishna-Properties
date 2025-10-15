import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf-8');
    const env: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=:#]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    });
    
    return env;
  } catch (error) {
    console.error('❌ Failed to load .env file:', error);
    process.exit(1);
  }
}

async function testConnection() {
  console.log('Testing Supabase connection...\n');
  
  try {
    const env = loadEnv();
    
    const supabaseUrl = env.VITE_SUPABASE_URL;
    const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing environment variables!');
      console.log('Please make sure your .env file contains:');
      console.log('  - VITE_SUPABASE_URL');
      console.log('  - VITE_SUPABASE_ANON_KEY');
      process.exit(1);
    }
    
    console.log('📍 Supabase URL:', supabaseUrl);
    console.log('🔑 Anon Key:', supabaseAnonKey.substring(0, 20) + '...\n');
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test 1: Check if we can connect
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      console.log('\nPlease make sure:');
      console.log('1. Your .env file has the correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
      console.log('2. The migrations have been applied to your Supabase database');
      console.log('3. Row Level Security (RLS) policies are properly configured');
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log(`📊 Database is accessible`);
    
    // Test 2: Check tables exist
    const tables = ['profiles', 'properties', 'inquiries'];
    console.log('\nChecking tables:');
    
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (tableError) {
        console.log(`  ⚠️  ${table}: ${tableError.message}`);
      } else {
        console.log(`  ✅ ${table}: exists`);
      }
    }
    
    console.log('\n🎉 Supabase connection test completed!');
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

testConnection();
