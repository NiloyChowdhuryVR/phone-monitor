import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper functions for JSON file storage
function readJSON(filename: string): any[] {
  const filepath = path.join(dataDir, filename);
  if (fs.existsSync(filepath)) {
    try {
      return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function writeJSON(filename: string, data: any[]) {
  const filepath = path.join(dataDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// Simple file-based storage for Vercel compatibility
const db = {
  prepare: (query: string) => {
    return {
      run: (...params: any[]) => {
        if (query.includes('INSERT INTO sms') || query.includes('INSERT OR REPLACE INTO sms')) {
          const data = readJSON('sms.json');
          const [id, address, body, date, type] = params;
          // Remove existing entry with same ID
          const filtered = data.filter((item: any) => item.id !== id);
          filtered.push({ id, address, body, date, type, created_at: new Date().toISOString() });
          writeJSON('sms.json', filtered);
        } else if (query.includes('INSERT INTO call_logs') || query.includes('INSERT OR REPLACE INTO call_logs')) {
          const data = readJSON('calls.json');
          const [id, number, type, date, duration] = params;
          const filtered = data.filter((item: any) => item.id !== id);
          filtered.push({ id, number, type, date, duration, created_at: new Date().toISOString() });
          writeJSON('calls.json', filtered);
        } else if (query.includes('INSERT INTO media')) {
          const data = readJSON('media.json');
          const [filename, type, filePath] = params;
          data.push({
            id: data.length + 1,
            filename,
            type,
            path: filePath,
            uploaded_at: new Date().toISOString()
          });
          writeJSON('media.json', data);
        }
      },
      all: (...params: any[]) => {
        if (query.includes('FROM sms')) {
          const data = readJSON('sms.json');
          return data.sort((a: any, b: any) => b.date - a.date).slice(0, 500);
        } else if (query.includes('FROM call_logs')) {
          const data = readJSON('calls.json');
          return data.sort((a: any, b: any) => b.date - a.date).slice(0, 500);
        } else if (query.includes('FROM media')) {
          const data = readJSON('media.json');
          const typeParam = params[0];
          if (typeParam) {
            return data.filter((item: any) => item.type === typeParam)
              .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
          }
          return data.sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());
        }
        return [];
      }
    };
  },
  exec: (sql: string) => {
    // No-op for schema creation (we use JSON files)
  }
};

export default db;
