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

        const { calls } = await request.json();

        for (const call of calls) {
            await sql`
                INSERT INTO call_logs (id, username, number, type, date, duration)
                VALUES (${call.id}, ${username}, ${call.number}, ${call.type}, ${call.date}, ${call.duration})
                ON CONFLICT (id) DO UPDATE 
                SET number = ${call.number}, type = ${call.type}, date = ${call.date}, duration = ${call.duration}
            `;
        }

        return NextResponse.json({ success: true, count: calls.length });
    } catch (error) {
        console.error('Calls upload error:', error);
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

        const calls = await sql`
            SELECT * FROM call_logs 
            WHERE username = ${username} 
            ORDER BY date DESC 
            LIMIT 500
        `;
        return NextResponse.json(calls);
    } catch (error) {
        console.error('Calls fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
