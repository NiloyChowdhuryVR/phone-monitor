import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
    // Get username from header
    const username = request.headers.get('x-username');
    if (!username) {
        return NextResponse.json({ error: 'Username required' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine file type and directory
        const isVideo = file.type.startsWith('video/');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', isVideo ? 'videos' : 'photos');

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const filename = `${Date.now()}-${file.name}`;
        const filepath = path.join(uploadDir, filename);

        // Save file
        await writeFile(filepath, buffer);

        // Save to database with username
        const type = isVideo ? 'video' : 'photo';
        const stmt = db.prepare('INSERT INTO media (filename, type, path, username) VALUES (?, ?, ?, ?)');
        stmt.run(filename, type, `/uploads/${isVideo ? 'videos' : 'photos'}/${filename}`, username);

        return NextResponse.json({ success: true, filename });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};
