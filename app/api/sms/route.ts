import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
    const username = request.headers.get('x-username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        const messages = await request.json();
        const stmt = db.prepare('INSERT OR REPLACE INTO sms (id, address, body, date, type, username) VALUES (?, ?, ?, ?, ?, ?)');

        for (const msg of messages) {
            stmt.run(msg.id, msg.address, msg.body, msg.date, msg.type, username);
        }

        return NextResponse.json({ success: true, count: messages.length });
    } catch (error) {
        console.error('SMS upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const username = request.headers.get('x-username') || request.nextUrl.searchParams.get('username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        const messages = db.prepare('SELECT * FROM sms WHERE username = ? ORDER BY date DESC LIMIT 500').all(username);
        return NextResponse.json(messages);
    } catch (error) {
        console.error('SMS fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
