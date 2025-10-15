# Shree Krishna Properties

A production-ready property listing platform with separate user and admin dashboards, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### User Features
- Single-field login (email or mobile number)
- Secure signup with validation
- Browse all properties with image slideshow
- Search properties by location
- View detailed property information
- Schedule property visits
- Track inquiry status

### Admin Features
- Admin login with predefined credentials
- Add/edit/delete properties
- Upload up to 4 images per property with thumbnail selection
- View and manage user inquiries
- Approve/deny visit requests with optional date/time assignment

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. The database migrations have already been applied to your Supabase project with:
   - `profiles` table for user information
   - `properties` table for property listings
   - `inquiries` table for visit requests
   - `property-images` storage bucket
   - Row Level Security (RLS) policies

3. Seed the admin account:
```bash
npx tsx scripts/seed-admin.ts
```

## Admin Credentials

**Default admin credentials:**
- Email: `g.mehta1971@gmail.com`
- Mobile: `7877059117`
- Password: `Kota2020`

You can login using either the email or mobile number in the same input field.

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Database Schema

### profiles
- Stores user information
- Links to Supabase Auth users
- Contains `is_admin` flag for role-based access

### properties
- Stores property listings
- Soft-delete support via `deleted_at`
- Unique code generation (SKP-YYYYMMDD-XXXX)
- JSONB field for multiple images
- Full-text search on location

### inquiries
- Stores visit requests
- Status tracking (pending/approved/denied)
- Links users to properties
- Admin notes and assigned datetime

## Security

- Row Level Security (RLS) enabled on all tables
- Only admins can create/update/delete properties
- Users can only view their own inquiries
- Admins can view all inquiries
- Image uploads restricted to admins
- File size limit: 5MB per image
- Max 4 images per property

## Usage Guide

### For Users

1. **Sign Up**: Create an account with name, mobile, email, and address
2. **Browse Properties**: View featured properties and complete listing
3. **Search**: Use the search bar to find properties by location
4. **View Details**: Click any property to see full details and image gallery
5. **Schedule Visit**: Select date/time to request a property visit
6. **Track Inquiries**: View status of your visit requests

### For Admins

1. **Login**: Use admin credentials (email or mobile)
2. **Add Property**: Fill form with all required details and upload images
3. **Select Thumbnail**: Choose which image appears as the property thumbnail
4. **Manage Properties**: Edit or delete existing listings
5. **Review Inquiries**: View all user visit requests
6. **Approve/Deny**: Take action on inquiries and optionally assign visit datetime

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with UI:
```bash
npm run test:ui
```

### Test Coverage

- ✅ Utility functions (validation, formatting)
- ✅ Authentication components (Login, Signup)
- ✅ Property components (PropertyCard)
- ✅ Core user flows

## Deployment

### Complete Deployment Guide

#### Step 1: Prepare Your Supabase Project

1. **Create a Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details and wait for setup to complete

2. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy `Project URL` (VITE_SUPABASE_URL)
   - Copy `anon public` key (VITE_SUPABASE_ANON_KEY)
   - Copy `service_role` key (SUPABASE_SERVICE_ROLE_KEY) - **Keep this secret!**

3. **Database is Already Set Up**
   - Tables (`profiles`, `properties`, `inquiries`) are created
   - RLS policies are in place
   - Storage bucket exists

4. **Seed Admin Account**
   ```bash
   # Set environment variables first
   export VITE_SUPABASE_URL="your_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_key"

   # Run admin seed
   npx tsx scripts/seed-admin.ts
   ```

5. **Optional: Add Sample Data**
   ```bash
   npx tsx scripts/seed-sample-data.ts
   ```

#### Step 2: Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/shree-krishna-properties.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Add Environment Variables in Vercel**
   - Go to Project Settings > Environment Variables
   - Add:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```
   - **Note:** Do NOT add SUPABASE_SERVICE_ROLE_KEY to Vercel (security risk)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app is live!

#### Alternative: Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [https://netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder to deploy
   - Or connect to GitHub for continuous deployment

3. **Configure Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add same variables as Vercel

#### Step 3: Post-Deployment

1. **Verify Admin Login**
   - Visit your deployed site
   - Click "Sign In"
   - Login with: `g.mehta1971@gmail.com` or `7877059117`
   - Password: `Kota2020`

2. **Add Your First Property**
   - Navigate to Admin Dashboard
   - Click "Add New Property"
   - Fill in details and upload images
   - Select thumbnail and submit

3. **Test User Flow**
   - Sign out
   - Create a new user account
   - Browse properties
   - Schedule a visit
   - View inquiry status

### Environment Variables Reference

```env
# Required for Frontend (Add to Vercel/Netlify)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...

# Required for Seeding Only (Local use only, DO NOT deploy)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/shree-krishna-properties&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)

### Troubleshooting

**Issue: "Missing Supabase environment variables"**
- Solution: Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment

**Issue: "Cannot login as admin"**
- Solution: Run the seed-admin.ts script to create the admin account

**Issue: "Properties not showing"**
- Solution: Check RLS policies are enabled and admin has created properties

**Issue: "Image upload fails"**
- Solution: Verify storage bucket 'property-images' exists and has correct policies

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── ImageViewer.tsx
│   └── PropertyCard.tsx
├── pages/             # Page components
│   ├── UserDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── PropertyDetail.tsx
│   ├── SearchResults.tsx
│   ├── UserInquiries.tsx
│   ├── AdminPropertyForm.tsx
│   └── AdminInquiries.tsx
├── contexts/          # React contexts
│   └── AuthContext.tsx
├── lib/              # Utilities and configuration
│   ├── supabase.ts
│   ├── database.types.ts
│   └── utils.ts
└── App.tsx           # Main application component
```

## License

MIT

## Support

For issues or questions, please contact the development team.
