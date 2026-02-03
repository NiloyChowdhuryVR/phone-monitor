# Phone Monitor - Unified Next.js App

**✨ Single application for both frontend and backend!**

## What's Different?

Instead of separate backend and frontend, this Next.js app handles everything:
- **Frontend**: React pages with premium dark theme UI
- **Backend**: Next.js API routes (`/api/*`)
- **Database**: SQLite for SMS and call logs
- **Storage**: Local file system for photos/videos

## Quick Deploy to Vercel

```bash
cd phone-monitor-dashboard
npm install
vercel
```

Set environment variable in Vercel:
- `API_KEY=your-secret-key-here`

## Local Development

```bash
npm install
npm run dev
```

Create `.env.local`:
```
API_KEY=your-secret-api-key
```

## Configuration

On first visit to the dashboard:
1. Enter your **API Key** (same as set in environment variables)
2. Click "Save Configuration"
3. Done! No server URL needed.

## Features

### Frontend Pages
- `/` - Main dashboard with stats
- `/photos` - Photo gallery with lightbox
- `/videos` - Video player
- `/messages` - SMS viewer with search
- `/calls` - Call logs table

### API Routes (for Android app)
- `POST /api/upload` - Upload photos/videos
- `POST /api/sms` - Upload SMS messages
- `POST /api/calls` - Upload call logs
- `GET /api/photos` - Get photos list
- `GET /api/videos` - Get videos list
- `GET /api/sms` - Get SMS messages
- `GET /api/calls` - Get call logs

All endpoints require `X-API-Key` header.

## Android App Configuration

In the Android app, set:
- **Server URL**: Your Vercel URL (e.g., `https://your-app.vercel.app`)
- **API Key**: Same key as in environment variables

## Benefits of This Approach

✅ **Simpler deployment** - Only one service to deploy
✅ **Lower cost** - Free Vercel tier is enough
✅ **Easier configuration** - Just one API key needed
✅ **Better performance** - No network latency between frontend/backend
✅ **Easier development** - Everything in one codebase

## Tech Stack

- **Next.js 15** - Full-stack React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **better-sqlite3** - Database
- **Vercel** - Hosting (free tier)
