const express = require('express');
const router = express.Router();
const { dbQuery } = require('../database');

// GET /api/notes - Retrieve notes with search and category filtering
router.get('/', async (req, res, next) => {
  try {
    const { search, category, sort } = req.query;
    let query = 'SELECT * FROM notes WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      const term = `%${search.trim()}%`;
      query += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(term, term);
    }

    // Default sorting: pinned notes first, then latest updated first
    query += ' ORDER BY is_pinned DESC, updated_at DESC';

    const notes = await dbQuery.all(query, params);
    res.json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/notes/categories - Retrieve list of unique categories
router.get('/categories/list', async (req, res, next) => {
  try {
    const rows = await dbQuery.all('SELECT DISTINCT category FROM notes WHERE category IS NOT NULL');
    const categories = ['All', ...new Set(rows.map(r => r.category).filter(Boolean))];
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/notes/:id - Get a single note
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const note = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note with id ${id} not found.`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res, next) => {
  try {
    const { title, content, category = 'General', color = '#ffffff', is_pinned = 0 } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note title is required.'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required.'
      });
    }

    const now = new Date().toISOString();
    const result = await dbQuery.run(
      `INSERT INTO notes (title, content, category, color, is_pinned, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), content.trim(), category.trim() || 'General', color, is_pinned ? 1 : 0, now, now]
    );

    const newNote = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Note created successfully.',
      data: newNote
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, color, is_pinned } = req.body;

    const existing = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Note with id ${id} not found.`
      });
    }

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note title cannot be empty.'
      });
    }

    if (content !== undefined && !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty.'
      });
    }

    const updatedTitle = title !== undefined ? title.trim() : existing.title;
    const updatedContent = content !== undefined ? content.trim() : existing.content;
    const updatedCategory = category !== undefined ? category.trim() : existing.category;
    const updatedColor = color !== undefined ? color : existing.color;
    const updatedPinned = is_pinned !== undefined ? (is_pinned ? 1 : 0) : existing.is_pinned;
    const now = new Date().toISOString();

    await dbQuery.run(
      `UPDATE notes
       SET title = ?, content = ?, category = ?, color = ?, is_pinned = ?, updated_at = ?
       WHERE id = ?`,
      [updatedTitle, updatedContent, updatedCategory, updatedColor, updatedPinned, now, id]
    );

    const updatedNote = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Note updated successfully.',
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/notes/:id/pin - Toggle pin status
router.patch('/:id/pin', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Note with id ${id} not found.`
      });
    }

    const newPinned = existing.is_pinned ? 0 : 1;
    const now = new Date().toISOString();

    await dbQuery.run(
      'UPDATE notes SET is_pinned = ?, updated_at = ? WHERE id = ?',
      [newPinned, now, id]
    );

    const updatedNote = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: newPinned ? 'Note pinned.' : 'Note unpinned.',
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await dbQuery.get('SELECT * FROM notes WHERE id = ?', [id]);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Note with id ${id} not found.`
      });
    }

    await dbQuery.run('DELETE FROM notes WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Note deleted successfully.',
      data: existing
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
