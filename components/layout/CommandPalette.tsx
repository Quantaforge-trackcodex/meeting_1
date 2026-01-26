import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../context/AuthContext'; // Use configured Axios instance

interface SearchResult {
  id: string;
  type: 'repo' | 'workspace' | 'job' | 'library' | 'nav' | 'org' | 'user';
  label: string;
  subLabel?: string;
  icon: string;
  action: () => void;
  group: string;
  url?: string;
}

const CommandPalette = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Navigation Commands (Static)
  const navCommands: SearchResult[] = [
    { id: 'nav-home', type: 'nav', label: 'Go to Home', icon: 'home', group: 'Navigation', action: () => navigate('/dashboard/home') },
    { id: 'nav-settings', type: 'nav', label: 'Settings', icon: 'settings', group: 'Navigation', action: () => navigate('/settings') },
  ];

  // Fetch Results
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults(navCommands);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(search)}`);

        // Map API results to UI format
        const apiResults: SearchResult[] = data.results.map((item: any) => ({
          id: item.id,
          type: item.type,
          label: item.label,
          subLabel: item.subLabel,
          icon: item.icon,
          group: item.group,
          action: () => navigate(item.url)
        }));

        setResults([...navCommands, ...apiResults]);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce 300ms

    return () => clearTimeout(timer);
  }, [search]);

  // Grouping for render
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearch('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      results[selectedIndex]?.action();
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-[#0d1117] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[600px] animate-in fade-in zoom-in-95 duration-150 ring-1 ring-white/10">

        {/* Search Header */}
        <div className="p-3 border-b border-[#30363d] flex items-center gap-3">
          <span className="material-symbols-outlined text-slate-400">search</span>
          <input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search files, teams, or commands..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 border-none focus:ring-0 outline-none h-6"
          />
          <span className="text-xs text-slate-500 border border-[#30363d] rounded px-1.5 py-0.5">Esc</span>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {loading && (
            <div className="p-4 flex justify-center text-slate-500">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            </div>
          )}
          {!loading && Object.entries(groupedResults).map(([group, items]) => (
            <div key={group} className="mb-2">
              <h3 className="px-3 py-1.5 text-xs font-bold text-slate-500">{group}</h3>
              {items.map((item) => {
                const isSelected = results.indexOf(item) === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => { item.action(); onClose(); }}
                    onMouseEnter={() => setSelectedIndex(results.indexOf(item))}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer group ${isSelected ? 'bg-[#1f6feb] text-white' : 'text-slate-300 hover:bg-[#161b22]'}`}
                  >
                    <span className={`material-symbols-outlined !text-[18px] ${isSelected ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[13px] font-medium truncate">{item.label}</span>
                        {item.subLabel && <span className={`text-xs truncate ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>{item.subLabel}</span>}
                      </div>
                      <span className={`text-[10px] opacity-0 group-hover:opacity-100 ${isSelected ? 'text-white' : 'text-slate-500'}`}>Jump to</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          {!loading && results.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">No results found for "{search}"</div>
          )}
        </div>

        <div className="p-2 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="bg-[#0d1117] border border-[#30363d] rounded px-1 min-w-[16px] text-center">↑</kbd> <kbd className="bg-[#0d1117] border border-[#30363d] rounded px-1 min-w-[16px] text-center">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-[#0d1117] border border-[#30363d] rounded px-1 min-w-[20px] text-center">↵</kbd> to select</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
