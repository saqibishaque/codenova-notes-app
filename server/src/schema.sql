-- =====================================================================
-- CodeNova Internship Program • Task 1: Notes Application
-- Database Schema Definition (SQLite)
-- =====================================================================

-- Table: notes
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(trim(title)) > 0),
    content TEXT NOT NULL CHECK(length(trim(content)) > 0),
    category TEXT DEFAULT 'General',
    color TEXT DEFAULT '#ffffff',
    is_pinned INTEGER DEFAULT 0 CHECK(is_pinned IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Indexes for optimized querying, filtering, and sorting
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_pinned ON notes(is_pinned);
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);
