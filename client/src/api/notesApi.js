const API_BASE = '/api/notes';

/**
 * Handle API responses and throw structured errors
 */
async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`Server returned unexpected response (${res.status} ${res.statusText})`);
  }

  if (!res.ok) {
    const errorMsg = data && data.message ? data.message : `HTTP error ${res.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const notesApi = {
  // Fetch all notes with optional query parameters
  async getNotes(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);

    const url = `${API_BASE}${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    const result = await handleResponse(res);
    return result.data || [];
  },

  // Fetch unique categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories/list`);
    const result = await handleResponse(res);
    return result.data || ['All'];
  },

  // Fetch a single note by ID
  async getNoteById(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    const result = await handleResponse(res);
    return result.data;
  },

  // Create a new note
  async createNote(noteData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const result = await handleResponse(res);
    return result.data;
  },

  // Update an existing note
  async updateNote(id, noteData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteData)
    });
    const result = await handleResponse(res);
    return result.data;
  },

  // Toggle pin status
  async togglePin(id) {
    const res = await fetch(`${API_BASE}/${id}/pin`, {
      method: 'PATCH'
    });
    const result = await handleResponse(res);
    return result.data;
  },

  // Delete a note
  async deleteNote(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE'
    });
    const result = await handleResponse(res);
    return result.data;
  }
};
