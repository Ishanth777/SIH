/**
 * Offline SQLite Cache Service per Rule A7 and Rule M1.
 * Caches last-fetched job offers, active jobs, and worker profile in local SQLite database.
 * Falls back transparently to local SQLite when network connectivity is lost.
 */
import * as SQLite from 'expo-sqlite';

export interface CachedJob {
  id: string;
  category: string;
  customerName: string;
  customerAddress: string;
  latitude: number;
  longitude: number;
  estimatedRate: number;
  status: string;
  createdAt: string;
}

export interface CachedWorkerProfile {
  id: string;
  name: string;
  phone: string;
  cooperativeName: string;
  isAvailable: boolean;
  verificationStatus: string;
  ratingAverage: number;
}

class OfflineCacheService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    this.db = await SQLite.openDatabaseAsync('coop_worker_offline.db');

    // Create tables for jobs and worker profile
    await this.db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cached_jobs (
        id TEXT PRIMARY KEY NOT NULL,
        category TEXT NOT NULL,
        customerName TEXT,
        customerAddress TEXT,
        latitude REAL,
        longitude REAL,
        estimatedRate REAL,
        status TEXT NOT NULL,
        createdAt TEXT,
        cachedAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS worker_profile (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `);
  }

  async cacheJobs(jobs: CachedJob[]): Promise<void> {
    await this.init();
    if (!this.db) return;

    const now = Date.now();
    for (const job of jobs) {
      await this.db.runAsync(
        `INSERT OR REPLACE INTO cached_jobs 
        (id, category, customerName, customerAddress, latitude, longitude, estimatedRate, status, createdAt, cachedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        job.id,
        job.category,
        job.customerName,
        job.customerAddress,
        job.latitude,
        job.longitude,
        job.estimatedRate,
        job.status,
        job.createdAt,
        now,
      );
    }
  }

  async getCachedJobs(): Promise<CachedJob[]> {
    await this.init();
    if (!this.db) return [];

    const rows = await this.db.getAllAsync<CachedJob>(
      'SELECT id, category, customerName, customerAddress, latitude, longitude, estimatedRate, status, createdAt FROM cached_jobs ORDER BY cachedAt DESC',
    );
    return rows;
  }

  async cacheWorkerProfile(profile: CachedWorkerProfile): Promise<void> {
    await this.init();
    if (!this.db) return;

    await this.db.runAsync(
      'INSERT OR REPLACE INTO worker_profile (id, data, updatedAt) VALUES (?, ?, ?)',
      profile.id,
      JSON.stringify(profile),
      Date.now(),
    );
  }

  async getCachedWorkerProfile(id: string): Promise<CachedWorkerProfile | null> {
    await this.init();
    if (!this.db) return null;

    const row = await this.db.getFirstAsync<{ data: string }>(
      'SELECT data FROM worker_profile WHERE id = ?',
      id,
    );

    if (row && row.data) {
      try {
        return JSON.parse(row.data) as CachedWorkerProfile;
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const offlineCacheService = new OfflineCacheService();
