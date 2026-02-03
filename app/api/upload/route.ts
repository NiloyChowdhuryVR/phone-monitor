import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
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

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine if video or photo
        const isVideo = file.type.startsWith('video/');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', isVideo ? 'videos' : 'photos');

        // Create directory if it doesn't exist
        await mkdir(uploadDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;
        const filepath = path.join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Save to database with username
        const type = isVideo ? 'video' : 'photo';
        await sql`
            INSERT INTO media (username, filename, type, path)
            VALUES (${username}, ${filename}, ${type}, ${`/uploads/${isVideo ? 'videos' : 'photos'}/${filename}`})
        `;

        return NextResponse.json({ success: true, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
