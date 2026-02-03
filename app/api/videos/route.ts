import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

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

        const videos = await sql`
            SELECT * FROM media 
            WHERE username = ${username} AND type = 'video'
            ORDER BY uploaded_at DESC
        `;
        return NextResponse.json(videos);
    } catch (error) {
        console.error('Videos fetch error:', error);
        return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }
}
