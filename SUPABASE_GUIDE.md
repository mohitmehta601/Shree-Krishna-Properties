# Supabase Development Guide

## 🚀 Your Supabase Project Setup

**Project Details:**

- Project Name: Shree Krishna Properties
- Project ID: `ldhvlkdpclebeorxfmqp`
- Project URL: `https://ldhvlkdpclebeorxfmqp.supabase.co`
- Dashboard: `https://supabase.com/dashboard/project/ldhvlkdpclebeorxfmqp`

## 📋 Available Commands

Run these commands in the VS Code terminal:

### Database Management

```bash
# Generate TypeScript types from your database
npm run supabase:types

# Check migration status
npm run supabase:migrate

# View project status (requires Docker)
npm run supabase:status

# Start local development (requires Docker)
npm run supabase:start

# Stop local development
npm run supabase:stop
```

### Data Seeding

```bash
# Seed admin user
npm run seed:admin

# Seed sample data
npm run seed:sample

# View database statistics
npm run supabase:dashboard
```

### Direct Supabase CLI Commands

```bash
# Login to Supabase
npx supabase@latest login

# List all projects
npx supabase@latest projects list

# Generate types
npx supabase@latest gen types typescript --project-id ldhvlkdpclebeorxfmqp

# View API keys
npx supabase@latest projects api-keys --project-ref ldhvlkdpclebeorxfmqp

# Pull database schema
npx supabase@latest db pull

# Push local migrations to remote
npx supabase@latest db push
```

## 🗄️ Database Schema

Your current database has these tables:

### `profiles`

- User profile information
- Links to auth.users via user_id
- Contains admin flag

### `properties`

- Property listings
- Images stored as JSON
- Soft deletion with deleted_at

### `inquiries`

- Property visit requests
- Links properties and users
- Admin assignment tracking

## 🔑 Environment Variables

Your `.env` file contains:

- `VITE_SUPABASE_URL` - Your project URL
- `VITE_SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Admin service role key

## 🛠️ Using the Supabase Extension

The Supabase extension is already installed. Here's how to use it:

### 1. Access the Extension

- Open Command Palette (`Ctrl+Shift+P`)
- Type "Supabase" to see available commands

### 2. Key Features

- **SQL Editor**: Write and execute SQL queries
- **Database Explorer**: Browse tables and data
- **Schema Visualization**: View table relationships
- **Edge Functions**: Manage serverless functions

### 3. Extension Commands

- `Supabase: Open Dashboard` - Opens project dashboard
- `Supabase: Generate Types` - Generate TypeScript types
- `Supabase: Run SQL Query` - Execute SQL in editor

## 📊 Monitoring and Analytics

### Database Statistics

Run `npm run supabase:dashboard` to see:

- User count
- Property count
- Inquiry statistics
- Recent activities

### Real-time Monitoring

- Monitor in Supabase Dashboard
- Check logs and metrics
- Set up alerts for errors

## 🔒 Security Best Practices

### Row Level Security (RLS)

Your database has RLS policies set up for:

- Users can only see their own data
- Admins have elevated permissions
- Public access to properties (read-only)

### API Keys

- **Anon Key**: Safe for client-side use
- **Service Role Key**: Server-side only, never expose

## 🚀 Development Workflow

### 1. Local Development

```bash
# Start your React app
npm run dev

# In another terminal, start Supabase (if Docker available)
npm run supabase:start
```

### 2. Schema Changes

```bash
# Create a new migration
npx supabase@latest migration new your_migration_name

# Apply migrations to remote
npx supabase@latest db push

# Update TypeScript types
npm run supabase:types
```

### 3. Testing

```bash
# Run tests
npm test

# Seed test data
npm run seed:sample
```

## 📱 Extension Integration

### VS Code Supabase Extension Features:

1. **Database Explorer** - Browse your tables
2. **SQL Editor** - Write and run queries
3. **Schema Inspector** - View table structure
4. **Real-time Logs** - Monitor database activity
5. **Function Editor** - Create Edge Functions

### Quick Access:

- Press `Ctrl+Shift+P` and type "Supabase"
- Use the Supabase sidebar panel
- Right-click on files for context actions

## 🆘 Troubleshooting

### Common Issues:

1. **Docker not running**: Some commands require Docker Desktop
2. **Migration conflicts**: Use `npx supabase@latest migration repair`
3. **Type generation fails**: Check network and credentials
4. **Permission denied**: Verify your service role key

### Getting Help:

- Check VS Code Problems panel
- View Supabase logs in dashboard
- Run commands with `--debug` flag

## 🔗 Quick Links

- [Project Dashboard](https://supabase.com/dashboard/project/ldhvlkdpclebeorxfmqp)
- [Supabase Documentation](https://supabase.com/docs)
- [VS Code Extension Docs](https://marketplace.visualstudio.com/items?itemName=supabase.vscode-supabase-extension)
- [SQL Reference](https://supabase.com/docs/guides/database/overview)

---

**Happy coding! 🎉**
