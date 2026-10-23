import React from 'react';
import { Pin, Edit3, Trash2, Calendar, Tag } from 'lucide-react';

export default function NoteCard({
  note,
  viewMode,
  onEdit,
  onDelete,
  onTogglePin
}) {
  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  // Pastel card styling mapping
  const cardColor = note.color || '#ffffff';

  if (viewMode === 'list') {
    return (
      <div
        style={{ backgroundColor: cardColor }}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 gap-3"
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            {note.is_pinned === 1 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-200">
                <Pin className="w-3 h-3 fill-amber-600 rotate-45" /> Pinned
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200">
              <Tag className="w-3 h-3 text-slate-400" />
              {note.category || 'General'}
            </span>
            <h3 className="font-semibold text-slate-900 truncate text-base">
              {note.title}
            </h3>
          </div>
          <p className="text-sm text-slate-600 line-clamp-1 break-words">
            {note.content}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(note.updated_at || note.created_at)}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                note.is_pinned === 1
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
              }`}
              title={note.is_pinned === 1 ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin className={`w-4 h-4 ${note.is_pinned === 1 ? 'fill-current rotate-45' : ''}`} />
            </button>
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
              title="Edit note"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(note)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid / Card Mode
  return (
    <div
      style={{ backgroundColor: cardColor }}
      className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 min-h-[220px]"
    >
      <div>
        {/* Top meta bar */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white/70 px-2 py-0.5 rounded-md border border-slate-200/80">
            <Tag className="w-3 h-3 text-slate-400" />
            {note.category || 'General'}
          </span>

          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              note.is_pinned === 1
                ? 'text-amber-600 bg-amber-50/80 hover:bg-amber-100'
                : 'text-slate-400 hover:text-amber-600 hover:bg-white/80'
            }`}
            title={note.is_pinned === 1 ? 'Unpin note' : 'Pin note to top'}
          >
            <Pin className={`w-4 h-4 ${note.is_pinned === 1 ? 'fill-current rotate-45' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-lg mb-2 leading-snug break-words">
          {note.title}
        </h3>

        {/* Content */}
        <p className="text-sm text-slate-600 whitespace-pre-line line-clamp-6 break-words leading-relaxed">
          {note.content}
        </p>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium text-[11px]">
          <Calendar className="w-3 h-3 text-slate-400" />
          {formatDate(note.updated_at || note.created_at)}
        </span>

        <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white/90 transition cursor-pointer"
            title="Edit note"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(note)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-white/90 transition cursor-pointer"
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
