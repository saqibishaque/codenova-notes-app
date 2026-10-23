import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { notesApi } from './api/notesApi';
import { useToast } from './context/ToastContext';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { FileText, Plus, Pin, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('codenova_view_mode') || 'grid';
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isServerOffline, setIsServerOffline] = useState(false);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);

  // Sync viewMode to localStorage
  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('codenova_view_mode', mode);
  };

  // Fetch all notes & categories from backend
  const loadData = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const [fetchedNotes, fetchedCategories] = await Promise.all([
        notesApi.getNotes(),
        notesApi.getCategories()
      ]);
      setNotes(fetchedNotes);
      setCategories(fetchedCategories);
      setIsServerOffline(false);
    } catch (err) {
      console.error('Failed to load notes:', err);
      setIsServerOffline(true);
      showToast(
        'Unable to connect to the backend server. Please verify the API is running.',
        'error',
        6000
      );
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Compute category counts
  const notesCountByCategory = useMemo(() => {
    const counts = { All: notes.length };
    notes.forEach((note) => {
      const cat = note.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [notes]);

  // Instant reactive client-side search and category filtering
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory =
        selectedCategory === 'All' || note.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const inTitle = note.title && note.title.toLowerCase().includes(q);
      const inContent = note.content && note.content.toLowerCase().includes(q);
      const inCategory = note.category && note.category.toLowerCase().includes(q);

      return inTitle || inContent || inCategory;
    });
  }, [notes, selectedCategory, searchQuery]);

  // Split into pinned and unpinned notes
  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter((n) => n.is_pinned === 1);
  }, [filteredNotes]);

  const regularNotes = useMemo(() => {
    return filteredNotes.filter((n) => n.is_pinned !== 1);
  }, [filteredNotes]);

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  // Create or Update Note Action
  const handleSaveNote = async (formData) => {
    setIsSaving(true);
    try {
      if (editingNote) {
        // Update existing note
        const updated = await notesApi.updateNote(editingNote.id, formData);
        setNotes((prev) =>
          prev.map((n) => (n.id === updated.id ? updated : n))
        );
        showToast('Note updated successfully!', 'success');
      } else {
        // Create new note
        const created = await notesApi.createNote(formData);
        setNotes((prev) => [created, ...prev]);
        showToast('Note created successfully!', 'success');
      }

      // Refresh categories list dynamically
      const updatedCats = await notesApi.getCategories();
      setCategories(updatedCats);

      handleCloseModal();
    } catch (err) {
      console.error('Error saving note:', err);
      showToast(err.message || 'Failed to save note. Please check inputs.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Pin Action
  const handleTogglePin = async (id) => {
    try {
      const updated = await notesApi.togglePin(id);
      setNotes((prev) =>
        prev.map((n) => (n.id === updated.id ? updated : n))
      );
      showToast(
        updated.is_pinned ? 'Note pinned to top.' : 'Note unpinned.',
        'info',
        2500
      );
    } catch (err) {
      console.error('Error toggling pin:', err);
      showToast('Could not update pin status: ' + err.message, 'error');
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);
    try {
      await notesApi.deleteNote(noteToDelete.id);
      setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
      showToast('Note deleted successfully.', 'success');
      setNoteToDelete(null);

      // Refresh categories if needed
      const updatedCats = await notesApi.getCategories();
      setCategories(updatedCats);
    } catch (err) {
      console.error('Error deleting note:', err);
      showToast('Failed to delete note: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={handleSetViewMode}
        onOpenCreateModal={handleOpenCreateModal}
        totalNotes={notes.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Offline Warning Banner if backend is not reachable */}
        {isServerOffline && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm font-medium">
                Unable to contact REST backend at <code className="bg-rose-100 px-1.5 py-0.5 rounded text-xs">/api/notes</code>.
                Make sure the backend server is running on port 5000.
              </p>
            </div>
            <button
              onClick={() => loadData(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Filter Bar & Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <CategoryBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            notesCountByCategory={notesCountByCategory}
          />

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
            <span>
              Showing {filteredNotes.length} of {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </span>
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold">
                matching "{searchQuery}"
              </span>
            )}
          </div>
        </div>

        {/* Notes Content State */}
        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          // Empty state
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 shadow-sm">
              <FileText className="w-8 h-8" />
            </div>
            {searchQuery || selectedCategory !== 'All' ? (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No notes match your filters
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  We couldn't find any note matching the query or category you selected.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  No notes yet
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Start capturing thoughts, project milestones, study points, and tasks.
                </p>
                <button
                  onClick={handleOpenCreateModal}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Your First Note
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="py-6 space-y-8">
            {/* Pinned Section (if any pinned notes exist) */}
            {pinnedNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-amber-700">
                  <Pin className="w-3.5 h-3.5 fill-current rotate-45" />
                  <span>Pinned ({pinnedNotes.length})</span>
                </div>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {pinnedNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={handleOpenEditModal}
                      onDelete={setNoteToDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Other Notes Section */}
            {regularNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Other Notes ({regularNotes.length})</span>
                  </div>
                )}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'flex flex-col gap-3'
                  }
                >
                  {regularNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      viewMode={viewMode}
                      onEdit={handleOpenEditModal}
                      onDelete={setNoteToDelete}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Note Create/Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        initialNote={editingNote}
        isSaving={isSaving}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        onConfirm={handleConfirmDelete}
        noteTitle={noteToDelete ? noteToDelete.title : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
