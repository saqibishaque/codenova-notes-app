import React from 'react';
import { Search, Plus, LayoutGrid, List, Sparkles, X } from 'lucide-react';

export default function Header({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onOpenCreateModal,
  totalNotes
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900">CodeNova</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Notes
              </span>
            </div>
            <p className="text-xs text-slate-500">Task 1: Full-Stack CRUD Application</p>
          </div>
        </div>

        {/* Search Bar - Instant Search Filtering */}
        <div className="flex-1 max-w-xl mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or note content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* View Mode & New Note CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Card Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* New Note Button */}
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer hover:shadow-indigo-300"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden md:inline">New Note</span>
          </button>
        </div>
      </div>
    </header>
  );
}
