# 🗄️ NeonDB Setup Guide

## Step 1: Create NeonDB Account

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project

## Step 2: Get Database URL

1. In your Neon dashboard, click **"Connection Details"**
2. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 3: Add to Vercel

### Option A: Vercel Dashboard
1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
4. Click **Save**
5. Redeploy your app

### Option B: Vercel CLI
```bash
cd phone-monitor-dashboard
vercel env add DATABASE_URL
# Paste your Neon connection string when prompted
vercel --prod
```

## Step 4: Database Auto-Initialization

The database tables will be created automatically on first API call:
- `users` - Stores registered usernames
- `media` - Photos and videos
- `sms` - SMS messages  
- `call_logs` - Call history

## Step 5: Test

1. Build APK and install on phone
2. Enter Vercel URL + username
3. Start monitoring
4. Data will be saved to NeonDB!

---

## Features

✅ **Auto-registration** - Users created when app first uploads data
✅ **User filtering** - Dashboard only shows data for registered users
✅ **Empty for new users** - Shows 0 photos/videos until app uploads
✅ **Multi-user support** - Multiple phones can use same dashboard
✅ **PostgreSQL** - Reliable, scalable database

---

## Local Development

Create `.env.local`:
```
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
```

Then run:
```bash
npm run dev
```

---

**That's it! NeonDB is ready!** 🚀
