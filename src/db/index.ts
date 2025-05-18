import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as schema from './schema';

// 获取当前文件的目录
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// 确保 data 目录存在
const dataDir = resolve(__dirname, '../../data');

// 数据库路径
const dbPath = join(dataDir, 'segmentfault.db');

// 创建SQLite连接
const sqlite = new Database(dbPath);

// 创建Drizzle ORM实例
export const db = drizzle(sqlite, { schema });

// 导出类型
export type DB = typeof db;

// 导出schema以便在其他地方使用
export { schema };
