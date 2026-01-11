
import React, { useState } from 'react';

const EditorView = () => {
  const [activeFile, setActiveFile] = useState('Button.tsx');
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set(['src', 'components']));

  const toggleFolder = (folderName: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderName)) {
        next.delete(folderName);
      } else {
        next.add(folderName);
      }
      return next;
    });
  };

  const isFolderOpen = (folderName: string) => openFolders.has(folderName);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117] font-display">
      {/* Tab bar / Breadcrumbs */}
      <div className="h-10 border-b border-[#1e293b] flex items-center px-4 bg-[#0d1117] gap-3 shrink-0">
         <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span>track-codex</span>
            <span className="text-[10px]">/</span>
            <span>frontend</span>
            <span className="text-[10px]">/</span>
            <span>src</span>
            <span className="text-[10px]">/</span>
            <span>components</span>
            <span className="text-[10px]">/</span>
            <div className="flex items-center gap-1.5 text-white bg-white/5 px-2 py-0.5 rounded">
               <span className="material-symbols-outlined !text-[14px] text-blue-400">javascript</span>
               <span className="font-bold">Button.tsx</span>
               <span className="text-[9px] font-black uppercase text-slate-500">TSX</span>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Explorer Sidebar */}
        <aside className="w-[240px] border-r border-[#1e293b] flex flex-col bg-[#0d1117] shrink-0">
           <div className="p-4 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">Explorer</span>
              <span className="material-symbols-outlined !text-[18px] text-slate-500 cursor-pointer">more_horiz</span>
           </div>
           
           <div className="flex-1 overflow-y-auto no-scrollbar py-2">
              {/* Root Folder: src */}
              <div 
                className="flex items-center gap-2 px-4 py-1.5 text-slate-400 cursor-pointer group hover:bg-white/5 transition-colors"
                onClick={() => toggleFolder('src')}
              >
                 <span className={`material-symbols-outlined !text-[18px] transition-transform duration-200 group-hover:text-white ${isFolderOpen('src') ? '' : 'rotate-[-90deg]'}`}>expand_more</span>
                 <span className="text-[13px] font-medium group-hover:text-white transition-colors">src</span>
              </div>

              {isFolderOpen('src') && (
                <div className="ml-4">
                  {/* Nested Folder: components */}
                  <div 
                    className="flex items-center gap-2 px-4 py-1.5 text-slate-400 cursor-pointer group hover:bg-white/5 transition-colors"
                    onClick={() => toggleFolder('components')}
                  >
                    <span className={`material-symbols-outlined !text-[18px] transition-transform duration-200 group-hover:text-white ${isFolderOpen('components') ? '' : 'rotate-[-90deg]'}`}>expand_more</span>
                    <span className="text-[13px] font-medium group-hover:text-white">components</span>
                  </div>

                  {isFolderOpen('components') && (
                    <div className="ml-4">
                      <div 
                        onClick={() => setActiveFile('Button.tsx')}
                        className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer group border-l-2 transition-all ${activeFile === 'Button.tsx' ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-slate-400 hover:bg-white/5'}`}
                      >
                         <span className="material-symbols-outlined !text-[16px] text-blue-400">javascript</span>
                         <span className="text-[13px] font-medium">Button.tsx</span>
                      </div>
                      <div 
                        onClick={() => setActiveFile('Card.tsx')}
                        className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer group border-l-2 transition-all ${activeFile === 'Card.tsx' ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-slate-400 hover:bg-white/5'}`}
                      >
                         <span className="material-symbols-outlined !text-[16px] text-blue-400">javascript</span>
                         <span className="text-[13px] font-medium">Card.tsx</span>
                      </div>
                      <div 
                        onClick={() => setActiveFile('Input.tsx')}
                        className={`flex items-center gap-2 px-4 py-1.5 cursor-pointer group border-l-2 transition-all ${activeFile === 'Input.tsx' ? 'bg-primary/10 border-primary text-white' : 'border-transparent text-slate-400 hover:bg-white/5'}`}
                      >
                         <span className="material-symbols-outlined !text-[16px] text-blue-400">javascript</span>
                         <span className="text-[13px] font-medium">Input.tsx</span>
                      </div>
                    </div>
                  )}

                  {/* Nested Folder: utils */}
                  <div 
                    className="flex items-center gap-2 px-4 py-1.5 text-slate-400 cursor-pointer group hover:bg-white/5 transition-colors"
                    onClick={() => toggleFolder('utils')}
                  >
                    <span className={`material-symbols-outlined !text-[18px] transition-transform duration-200 group-hover:text-white ${isFolderOpen('utils') ? '' : 'rotate-[-90deg]'}`}>expand_more</span>
                    <span className="text-[13px] font-medium group-hover:text-white">utils</span>
                  </div>
                  {isFolderOpen('utils') && (
                    <div className="ml-8 py-1 text-slate-500 text-[12px] italic">No files in folder</div>
                  )}
                </div>
              )}

              <div className="px-4 py-1.5 mt-4 text-slate-500 flex items-center gap-2 hover:text-white cursor-pointer hover:bg-white/5">
                 <span className="material-symbols-outlined !text-[18px]">description</span>
                 <span className="text-[13px]">package.json</span>
              </div>
              <div className="px-4 py-1.5 text-slate-500 flex items-center gap-2 hover:text-white cursor-pointer hover:bg-white/5">
                 <span className="material-symbols-outlined !text-[18px]">info</span>
                 <span className="text-[13px]">README.md</span>
              </div>
           </div>
        </aside>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0b0e14] relative">
           {/* Code Toolbar */}
           <div className="h-14 border-b border-[#1e293b] flex items-center justify-between px-6 bg-[#0d1117] shrink-0">
              <div className="flex items-center gap-3">
                 <img src="https://picsum.photos/seed/u1/64" className="size-6 rounded-full" alt="User" />
                 <p className="text-[13px] text-slate-400"><span className="font-bold text-white">jdoe</span> updated styling for primary variant • 2 hours ago</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex items-center bg-[#161b22] border border-[#30363d] p-0.5 rounded-lg mr-2">
                    <button className="px-3 py-1 bg-[#2d333b] text-white text-[11px] font-bold rounded shadow-sm">Code</button>
                    <button className="px-3 py-1 text-slate-500 text-[11px] font-bold">Blame</button>
                    <button className="px-3 py-1 text-slate-500 text-[11px] font-bold">History</button>
                 </div>
                 <button className="size-8 flex items-center justify-center bg-[#161b22] border border-[#30363d] rounded-lg text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined !text-[18px]">content_copy</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-white text-[12px] font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all">
                    <span className="material-symbols-outlined !text-[18px]">open_in_new</span>
                    Open in Workspace
                 </button>
              </div>
           </div>

           {/* Editor Content */}
           <div className="flex-1 flex font-mono text-[14px] leading-relaxed relative overflow-hidden">
              <div className="absolute top-6 right-8 z-10">
                 <button className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20">
                    <span className="material-symbols-outlined !text-[16px] filled animate-pulse">auto_awesome</span>
                    Ask AI to Explain
                 </button>
              </div>

              {/* Line Numbers */}
              <div className="w-12 pt-6 flex flex-col items-center text-slate-700 bg-[#0d1117] select-none border-r border-[#1e293b]">
                 {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(n => (
                   <span key={n} className={`h-6 ${n === 6 ? 'text-amber-500 font-black' : ''}`}>{n}</span>
                 ))}
              </div>

              {/* Code */}
              <div className="flex-1 pt-6 px-8 overflow-y-auto no-scrollbar text-slate-300">
{`import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
`}
<div className="bg-amber-500/10 -mx-8 px-8 py-0.5 border-l-4 border-amber-500">
{`  isLoading?: boolean; // TODO: Refactor prop drilling`}
</div>
{`}

export const Button = ({
  className,
  variant = 'primary',
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
`}
              </div>
           </div>

           {/* AI Insight Overlay */}
           <div className="absolute bottom-6 left-6 right-6 bg-[#0d1117]/90 backdrop-blur-md border border-primary/30 rounded-xl p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-500 flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                 <span className="material-symbols-outlined !text-[24px] filled">psychology</span>
              </div>
              <div className="flex-1">
                 <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">TrackCodex AI Insight</h4>
                 <p className="text-[13px] text-slate-200">
                    This <code className="bg-white/5 px-1 rounded text-primary">Button</code> component uses a variant-based styling approach. It handles an <code className="bg-white/5 px-1 rounded text-primary">isLoading</code> state but lacks proper ARIA labels for accessibility when disabled. <a href="#" className="text-primary hover:underline font-bold">Generate fix?</a>
                 </p>
              </div>
              <button className="text-slate-500 hover:text-white">
                 <span className="material-symbols-outlined !text-[20px]">close</span>
              </button>
           </div>
        </div>
      </div>

      {/* Footer / Status bar */}
      <footer className="h-8 border-t border-[#1e293b] bg-[#0d1117] flex items-center justify-between px-4 text-[11px] text-slate-500 shrink-0">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined !text-[14px] text-emerald-500">check_circle</span>
               <span>Build Passing</span>
            </div>
            <div className="flex items-center gap-1.5">
               <span className="material-symbols-outlined !text-[14px]">account_tree</span>
               <span>main</span>
            </div>
         </div>
         <div>
            v2.4.0
         </div>
      </footer>
    </div>
  );
};

export default EditorView;
