/*
  # Fix Properties RLS Policies for Anonymous Access

  1. Problem
    - Current properties policy only works for authenticated users
    - Landing page needs to show properties to anonymous visitors

  2. Solution
    - Add policy to allow anonymous users to view properties
    - Keep existing authenticated user policies
*/

-- Drop the existing policy that's too restrictive
DROP POLICY IF EXISTS "Anyone can view non-deleted properties" ON properties;

-- Create new policy that explicitly allows anonymous access
CREATE POLICY "Public can view non-deleted properties"
  ON properties FOR SELECT
  TO anon, authenticated
  USING (deleted_at IS NULL);

-- Ensure the policy works for both anonymous and authenticated users
CREATE POLICY "Anyone can view non-deleted properties"
  ON properties FOR SELECT
  USING (deleted_at IS NULL);