import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET(request: NextRequest) {
    const username = request.nextUrl.searchParams.get('username') || 'sneha';

    try {
        // Check all tables
        const users = await sql`SELECT * FROM users`;
        const media = await sql`SELECT * FROM media`;
        const sms = await sql`SELECT * FROM sms`;
        const calls = await sql`SELECT * FROM call_logs`;

        // Check specific user
        const userMedia = await sql`SELECT * FROM media WHERE username = ${username}`;
        const userVideos = await sql`SELECT * FROM media WHERE username = ${username} AND type = 'video'`;
        const userPhotos = await sql`SELECT * FROM media WHERE username = ${username} AND type = 'photo'`;

        return NextResponse.json({
            username,
            totals: {
                users: users.length,
                media: media.length,
                sms: sms.length,
                calls: calls.length
            },
            userSpecific: {
                media: userMedia.length,
                videos: userVideos.length,
                photos: userPhotos.length
            },
            allUsers: users.map((u: any) => u.username),
            allMedia: media,
            userVideos,
            userPhotos
        });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
