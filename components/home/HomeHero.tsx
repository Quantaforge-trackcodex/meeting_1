
import React, { useState } from 'react';

const HomeHero = () => {
  const [prompt, setPrompt] = useState('');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-teal-600">
           <span className="material-symbols-outlined !text-[18px] filled">auto_awesome</span>
           <span className="text-sm font-bold">Ask TrackCodex or start a task...</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all">
              <span className="text-[11px] font-bold text-slate-600">GPT-5 mini</span>
              <span className="material-symbols-outlined !text-[16px] text-slate-400">expand_more</span>
           </div>
           <button className="text-teal-600 text-xs font-bold hover:underline">Advanced</button>
        </div>
      </div>

      <div className="relative mb-6">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the app you want to build or the bug you need to fix..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-5 text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-teal-500 outline-none min-h-[120px] resize-none text-[15px] font-medium"
        />
        <div className="absolute right-4 bottom-4">
           <button className="size-10 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/20 transition-all active:scale-95">
              <span className="material-symbols-outlined">send</span>
           </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
         {[
           { label: 'Fix security issues', icon: 'shield' },
           { label: 'Start new project', icon: 'rocket_launch' },
           { label: 'Continue last workspace', icon: 'history' },
           { label: 'Raise job', icon: 'work' }
         ].map((chip) => (
           <button 
             key={chip.label}
             className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
           >
              <span className="material-symbols-outlined !text-[16px]">{chip.icon}</span>
              {chip.label}
           </button>
         ))}
      </div>
    </div>
  );
};

export default HomeHero;
