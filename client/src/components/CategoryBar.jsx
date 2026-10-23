import React from 'react';
import { Tag, Sparkles } from 'lucide-react';

export default function CategoryBar({
  categories,
  selectedCategory,
  onSelectCategory,
  notesCountByCategory
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1 pr-2 shrink-0">
        <Tag className="w-3.5 h-3.5" />
        <span>Categories:</span>
      </div>

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        const count = notesCountByCategory[cat] || 0;

        return (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
              isSelected
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80'
            }`}
          >
            <span>{cat}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isSelected
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
