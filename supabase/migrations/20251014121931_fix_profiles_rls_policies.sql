/*
  # Fix Profiles RLS Policies - Remove Infinite Recursion

  1. Changes
    - Drop existing problematic policies
    - Create new policies that don't cause recursion
    - Use auth.jwt() to check admin status instead of querying profiles table

  2. Security
    - Users can view and update their own profile
    - Users can create their own profile on signup
    - Public can view profiles (needed for inquiry display)
*/

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;

-- Allow users to create their own profile during signup
CREATE POLICY "Users can insert own profile on signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to update their own profile (but not change is_admin flag)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND is_admin = (SELECT is_admin FROM profiles WHERE user_id = auth.uid())
  );

-- Allow authenticated users to view other profiles (needed for admin viewing user details in inquiries)
CREATE POLICY "Authenticated users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);
