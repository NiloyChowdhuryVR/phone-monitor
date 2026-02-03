import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get('username');

    if (!username) {
        return NextResponse.json({ exists: false }, { status: 400 });
    }

    try {
        const result = await sql`
            SELECT username FROM users WHERE username = ${username}
        `;

        return NextResponse.json({ exists: result.length > 0 });
    } catch (error) {
        console.error('User check error:', error);
        return NextResponse.json({ exists: false }, { status: 500 });
    }
}
