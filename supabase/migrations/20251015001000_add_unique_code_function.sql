/*
  # Add unique code generation function and trigger
  
  Creates a function to generate unique property codes in format SKP-YYYYMMDD-XXXX
  and a trigger to automatically set the unique_code on property insertion.
*/

-- Function to generate unique property code
CREATE OR REPLACE FUNCTION generate_unique_property_code()
RETURNS TRIGGER AS $$
DECLARE
  date_part TEXT;
  counter INTEGER;
  new_code TEXT;
BEGIN
  -- Get current date in YYYYMMDD format
  date_part := to_char(NOW(), 'YYYYMMDD');
  
  -- Get the next counter for today
  SELECT COALESCE(
    MAX(
      CAST(
        SUBSTRING(unique_code FROM 'SKP-' || date_part || '-([0-9]+)') 
        AS INTEGER
      )
    ), 0
  ) + 1
  INTO counter
  FROM properties
  WHERE unique_code LIKE 'SKP-' || date_part || '-%';
  
  -- Generate the new code with zero-padded counter
  new_code := 'SKP-' || date_part || '-' || LPAD(counter::TEXT, 4, '0');
  
  -- Set the unique_code for the new property
  NEW.unique_code := new_code;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically generate unique_code before insert
DROP TRIGGER IF EXISTS trigger_generate_unique_property_code ON properties;
CREATE TRIGGER trigger_generate_unique_property_code
  BEFORE INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION generate_unique_property_code();