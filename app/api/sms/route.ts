import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
    const username = request.headers.get('x-username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        // Register user if not exists
        await sql`
            INSERT INTO users (username, last_active)
            VALUES (${username}, CURRENT_TIMESTAMP)
            ON CONFLICT (username) 
            DO UPDATE SET last_active = CURRENT_TIMESTAMP
        `;

        const { messages } = await request.json();

        for (const msg of messages) {
            await sql`
                INSERT INTO sms (id, username, address, body, date, type)
                VALUES (${msg.id}, ${username}, ${msg.address}, ${msg.body}, ${msg.date}, ${msg.type})
                ON CONFLICT (id) DO UPDATE 
                SET address = ${msg.address}, body = ${msg.body}, date = ${msg.date}, type = ${msg.type}
            `;
        }

        return NextResponse.json({ success: true, count: messages.length });
    } catch (error) {
        console.error('SMS upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get('username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        // Check if user exists
        const userCheck = await sql`SELECT username FROM users WHERE username = ${username}`;
        if (userCheck.length === 0) {
            return NextResponse.json([]); // Return empty array for non-existent users
        }

        const messages = await sql`
            SELECT * FROM sms 
            WHERE username = ${username} 
            ORDER BY date DESC 
            LIMIT 500
        `;
        return NextResponse.json(messages);
    } catch (error) {
        console.error('SMS fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
