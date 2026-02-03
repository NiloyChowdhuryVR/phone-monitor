import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
    try {
        // Create users table
        await sql`
      CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Create media table
        await sql`
      CREATE TABLE IF NOT EXISTS media (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        filename VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        path TEXT NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Create sms table
        await sql`
      CREATE TABLE IF NOT EXISTS sms (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        body TEXT,
        date BIGINT,
        type INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Create call_logs table
        await sql`
      CREATE TABLE IF NOT EXISTS call_logs (
        id VARCHAR(255) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        number VARCHAR(255),
        type INTEGER,
        date BIGINT,
        duration INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

        // Create indexes
        await sql`CREATE INDEX IF NOT EXISTS idx_media_username ON media(username)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_media_type ON media(type)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_sms_username ON sms(username)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_call_logs_username ON call_logs(username)`;

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully',
            tables: ['users', 'media', 'sms', 'call_logs']
        });
    } catch (error: any) {
        console.error('Database initialization error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
