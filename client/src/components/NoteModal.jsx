import React, { useState, useEffect } from 'react';
import { X, Pin, Check, Palette, Tag } from 'lucide-react';

const COLOR_OPTIONS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Blue', value: '#eff6ff' },
  { name: 'Emerald', value: '#f0fdf4' },
  { name: 'Amber', value: '#fefce8' },
  { name: 'Rose', value: '#fdf2f8' },
  { name: 'Purple', value: '#f5f3ff' },
  { name: 'Teal', value: '#f0fdfa' },
];

const PRESET_CATEGORIES = ['General', 'Work', 'Personal', 'Ideas', 'Engineering', 'Study'];

export default function NoteModal({
  isOpen,
  onClose,
  onSave,
  initialNote = null,
  isSaving = false
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor] = useState('#ffffff');
  const [isPinned, setIsPinned] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCat, setIsCustomCat] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || '');
      setContent(initialNote.content || '');
      setColor(initialNote.color || '#ffffff');
      setIsPinned(initialNote.is_pinned === 1);

      if (PRESET_CATEGORIES.includes(initialNote.category)) {
        setCategory(initialNote.category);
        setIsCustomCat(false);
        setCustomCategory('');
      } else if (initialNote.category) {
        setIsCustomCat(true);
        setCustomCategory(initialNote.category);
        setCategory(initialNote.category);
      } else {
        setCategory('General');
        setIsCustomCat(false);
      }
    } else {
      // Default blank form
      setTitle('');
      setContent('');
      setCategory('General');
      setColor('#ffffff');
      setIsPinned(false);
      setIsCustomCat(false);
      setCustomCategory('');
    }
    setErrors({});
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalCategory = isCustomCat
      ? (customCategory.trim() || 'General')
      : category;

    onSave({
      title: title.trim(),
      content: content.trim(),
      category: finalCategory,
      color,
      is_pinned: isPinned ? 1 : 0
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        style={{ backgroundColor: color }}
        className="w-full max-w-2xl rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 bg-white/60 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-800">
              {initialNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer ${
                isPinned
                  ? 'bg-amber-100 text-amber-700 border border-amber-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title={isPinned ? 'Note is pinned' : 'Click to pin note'}
            >
              <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current rotate-45' : ''}`} />
              <span>{isPinned ? 'Pinned' : 'Pin to top'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 overflow-y-auto gap-4">
          {/* Note Title */}
          <div>
            <input
              type="text"
              placeholder="Note Title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
              }}
              autoFocus
              className={`w-full text-xl font-bold placeholder-slate-400 bg-transparent border-b pb-2 focus:outline-hidden transition-all ${
                errors.title
                  ? 'border-rose-400 text-rose-900 focus:border-rose-500'
                  : 'border-slate-200 focus:border-indigo-500 text-slate-900'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.title}</p>
            )}
          </div>

          {/* Note Content */}
          <div className="flex-1 flex flex-col">
            <textarea
              placeholder="Write your note content here..."
              rows={8}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) setErrors((prev) => ({ ...prev, content: null }));
              }}
              className={`w-full flex-1 resize-none bg-transparent placeholder-slate-400 text-slate-800 text-sm leading-relaxed focus:outline-hidden p-2 rounded-xl border transition-all ${
                errors.content
                  ? 'border-rose-300 focus:ring-2 focus:ring-rose-200'
                  : 'border-transparent focus:border-indigo-200 focus:bg-white/40'
              }`}
            />
            {errors.content && (
              <p className="text-xs text-rose-500 font-medium mt-1">{errors.content}</p>
            )}
            <div className="text-[11px] text-slate-400 text-right mt-1">
              {wordCount} words • {charCount} characters
            </div>
          </div>

          {/* Category Selector */}
          <div className="pt-2 border-t border-slate-200/60">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              Category
            </label>
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESET_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setIsCustomCat(false);
                    setCategory(cat);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                    !isCustomCat && category === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustomCat(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                  isCustomCat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                }`}
              >
                + Custom
              </button>
            </div>

            {isCustomCat && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Enter custom category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          {/* Card Color Palette */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <Palette className="w-3.5 h-3.5" />
              Note Color
            </label>
            <div className="flex items-center gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  style={{ backgroundColor: c.value }}
                  className={`w-7 h-7 rounded-full border border-slate-300 shadow-xs flex items-center justify-center transition hover:scale-110 cursor-pointer ${
                    color === c.value ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                  }`}
                  title={c.name}
                >
                  {color === c.value && (
                    <Check className="w-3.5 h-3.5 text-slate-700" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 transition cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : initialNote ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
