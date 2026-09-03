import * as SQLite from 'expo-sqlite';
import axios from 'axios';

// Initialize DB (sync open is deprecated in expo-sqlite recent versions, but openDatabaseSync works)
let db: SQLite.SQLiteDatabase | null = null;

export const initCacheDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('worker-profile.db');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS profile (
        id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        last_updated INTEGER
      );
    `);
  }
};

export const getCachedProfile = async (id: string) => {
  if (!db) await initCacheDb();
  
  const result = await db!.getFirstAsync<{ data: string }>('SELECT data FROM profile WHERE id = ?', [id]);
  if (result) {
    return JSON.parse(result.data);
  }
  return null;
};

export const saveProfileToCache = async (id: string, data: any) => {
  if (!db) await initCacheDb();
  
  const timestamp = Date.now();
  await db!.runAsync(
    'INSERT OR REPLACE INTO profile (id, data, last_updated) VALUES (?, ?, ?)',
    [id, JSON.stringify(data), timestamp]
  );
};

export const fetchAndCacheProfile = async (id: string, apiUrl: string) => {
  try {
    const response = await axios.get(`${apiUrl}/workers/${id}`);
    if (response.data) {
      await saveProfileToCache(id, response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Failed to fetch from API, falling back to cache:', error);
    return await getCachedProfile(id);
  }
};

