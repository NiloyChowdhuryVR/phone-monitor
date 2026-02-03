import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

const API_KEY = process.env.API_KEY || 'your-secret-api-key-change-this';

export async function GET(request: NextRequest) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== API_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const videos = db.prepare('SELECT * FROM media WHERE type = ? ORDER BY uploaded_at DESC').all('video');
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Videos fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
