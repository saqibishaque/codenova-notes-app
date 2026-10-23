const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const dbPath = process.env.DB_FILE || path.join(__dirname, '../notes.db');

// Ensure database directory exists
const dbDir = path.dirname(path.resolve(dbPath));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err.message);
  } else {
    console.log(`✅ Connected to SQLite database at ${dbPath}`);
  }
});

// Initialize Schema
function initSchema() {
  return new Promise((resolve, reject) => {
    const sql = `
      CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT DEFAULT 'General',
        color TEXT DEFAULT '#ffffff',
        is_pinned INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
      CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
      CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
    `;

    db.exec(sql, (err) => {
      if (err) {
        console.error('❌ Error initializing database schema:', err.message);
        reject(err);
      } else {
        console.log('✅ Notes table and indexes verified.');
        resolve();
      }
    });
  });
}

// Helper methods for async/await queries
const dbQuery = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) reject(err);
        else resolve({ lastID: this.lastID, changes: this.changes });
      });
    });
  },
  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};

module.exports = {
  db,
  initSchema,
  dbQuery
};
