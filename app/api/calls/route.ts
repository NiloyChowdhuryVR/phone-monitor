import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
    const username = request.headers.get('x-username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        const calls = await request.json();
        const stmt = db.prepare('INSERT OR REPLACE INTO call_logs (id, number, type, date, duration, username) VALUES (?, ?, ?, ?, ?, ?)');

        for (const call of calls) {
            stmt.run(call.id, call.number, call.type, call.date, call.duration, username);
        }

        return NextResponse.json({ success: true, count: calls.length });
    } catch (error) {
        console.error('Calls upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const username = request.headers.get('x-username') || request.nextUrl.searchParams.get('username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        const calls = db.prepare('SELECT * FROM call_logs WHERE username = ? ORDER BY date DESC LIMIT 500').all(username);
        return NextResponse.json(calls);
    } catch (error) {
        console.error('Calls fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
