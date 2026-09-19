import React, { useState } from 'react';
import { BookA, Search, Filter, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GlossaryView: React.FC = () => {
  const { glossary } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('সব');

  const categories = ['সব', 'বেসিক', 'অ্যানালাইসিস', 'অর্ডার টাইপ', 'মার্কেট', 'সাইকোলজি'];

  const filteredGlossary = glossary.filter(item => {
    const def = item.definitionBn || item.definition || '';
    const ex = item.exampleBn || item.example || '';
    const matchesSearch =
      item.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.termBn.includes(searchTerm) ||
      def.includes(searchTerm) ||
      ex.includes(searchTerm);

    const matchesCategory =
      selectedCategory === 'সব' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-semibold">
          <BookA className="w-3.5 h-3.5" />
          <span>ট্রেডিং পরিভাষা ও শব্দকোষ (Trading Glossary)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          বাংলা-ইংরেজি ট্রেডিং ডিকশনারি
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Bull Market, Bear Market, Stop Loss, Breakout ইত্যাদি শেয়ার বাজারের সব জটিল ইংরেজি শব্দের সহজ বাংলা অর্থ, সঠিক উচ্চারণ ও বাস্তবিক উদাহরণ।
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="ইংরেজি বা বাংলায় খুঁজুন (যেমন: Bullish, Stop Loss)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGlossary.length === 0 ? (
          <div className="col-span-full text-center py-12 space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              কোনো পরিভাষা খুঁজে পাওয়া যায়নি।
            </p>
            <p className="text-xs text-slate-400">অন্য কোনো শব্দ দিয়ে সার্চ করে দেখুন।</p>
          </div>
        ) : (
          filteredGlossary.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.category}
                  </span>
                  {item.pronunciation && (
                    <span className="text-[11px] text-slate-400 italic">
                      [{item.pronunciation}]
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {item.termEn}
                </h3>
                <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                  {item.termBn}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {item.definition}
                </p>
              </div>

              {item.example && (
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 italic">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 not-italic block mb-0.5">
                    উদাহরণ:
                  </span>
                  "{item.example}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
