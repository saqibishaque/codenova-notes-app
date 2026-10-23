const { initSchema, dbQuery, db } = require('../database');

const sampleNotes = [
  {
    title: 'CodeNova Full Stack Internship - Milestone Roadmap',
    content: '1. Task 1: Notes Application (End-to-End Client & Server CRUD) - Complete!\n2. Task 2: Expense Tracker (Data Persistence & Summaries)\n3. Mandatory Requirement: At least 2 tasks completed before Nov 6, 2026.\n4. GitHub repo public with comprehensive documentation.',
    category: 'Work',
    color: '#eff6ff', // light blue
    is_pinned: 1
  },
  {
    title: 'System Architecture Design Principles',
    content: 'Client-Server Separation: Keep the REST API stateless and decoupled from the React client.\nDual-Layer Validation: Validate on both frontend inputs and backend API routes to prevent malformed records.\nGraceful Degradation: Surface network drops and error responses through non-blocking toast notifications.',
    category: 'Engineering',
    color: '#f0fdf4', // light emerald
    is_pinned: 1
  },
  {
    title: 'RESTful API Specification Checklist',
    content: '- GET /api/notes (Supports ?search= and ?category=)\n- GET /api/notes/:id\n- POST /api/notes (JSON payload with title & content)\n- PUT /api/notes/:id\n- PATCH /api/notes/:id/pin\n- DELETE /api/notes/:id',
    category: 'Engineering',
    color: '#fefce8', // light amber
    is_pinned: 0
  },
  {
    title: 'Grocery & Weekend Supplies',
    content: '- Cold brew coffee beans\n- Almond milk & Greek yogurt\n- Whole grain sourdough bread\n- Fresh blueberries & avocados\n- Dark chocolate (85%)',
    category: 'Personal',
    color: '#fdf2f8', // light pink
    is_pinned: 0
  },
  {
    title: 'Ideas for Web Application Performance',
    content: 'Debounce search queries by 300ms to reduce database query load.\nUse optimistic UI updates with rollback on network failure.\nEnsure responsive grid/list transitions with CSS animations.',
    category: 'Ideas',
    color: '#f5f3ff', // light purple
    is_pinned: 0
  }
];

async function seed() {
  console.log('🌱 Seeding database...');
  try {
    await initSchema();

    // Check existing count
    const existing = await dbQuery.get('SELECT COUNT(*) as count FROM notes');
    if (existing.count > 0) {
      console.log(`ℹ️ Database already contains ${existing.count} notes. Clearing before re-seeding...`);
      await dbQuery.run('DELETE FROM notes');
      await dbQuery.run("DELETE FROM sqlite_sequence WHERE name='notes'");
    }

    const now = new Date().toISOString();
    for (const note of sampleNotes) {
      await dbQuery.run(
        `INSERT INTO notes (title, content, category, color, is_pinned, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [note.title, note.content, note.category, note.color, note.is_pinned, now, now]
      );
    }

    console.log(`✅ Successfully seeded ${sampleNotes.length} sample notes!`);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    db.close();
  }
}

seed();
