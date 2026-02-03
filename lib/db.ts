import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Initialize database tables
export async function initDB() {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
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
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
      )
    `;

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_media_username ON media(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_sms_username ON sms(username)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_call_logs_username ON call_logs(username)`;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

export default sql;
