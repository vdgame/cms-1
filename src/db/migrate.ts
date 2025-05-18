import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

// 确保 data 目录存在
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dataDir = join(dirname(dirname(__dirname)), 'data');

if (!existsSync(dataDir)) {
  console.log(`Creating data directory: ${dataDir}`);
  mkdirSync(dataDir, { recursive: true });
}

// 数据库路径
const dbPath = join(dataDir, 'segmentfault.db');

// 执行迁移
console.log('Running migrations...');

// 读取SQL迁移文件
const migrationFile = join(__dirname, 'migrations', '0000_initial_migration.sql');
const sql = readFileSync(migrationFile, 'utf8');

// 执行SQL语句
try {
  // 使用 better-sqlite3 直接执行 SQL
  const sqlite = new Database(dbPath);

  // 将SQL文件分割成单独的语句
  const statements = sql
    .split(';')
    .map(statement => statement.trim())
    .filter(statement => statement.length > 0);

  // 开始事务
  sqlite.exec('BEGIN TRANSACTION;');

  try {
    // 执行每个语句
    for (const statement of statements) {
      if (statement.length > 0) {
        sqlite.exec(statement + ';');
      }
    }

    // 提交事务
    sqlite.exec('COMMIT;');
    console.log('Migrations complete!');
  } catch (sqlError) {
    // 如果有错误，回滚事务
    sqlite.exec('ROLLBACK;');
    throw sqlError;
  } finally {
    // 关闭数据库连接
    sqlite.close();
  }
} catch (error) {
  console.error('Error running migrations:', error);
  process.exit(1);
}
