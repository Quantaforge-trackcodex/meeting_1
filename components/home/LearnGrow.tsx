
import React from 'react';

const LearnGrow = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-teal-500 transition-all">
          <div className="size-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
             <span className="material-symbols-outlined !text-[20px] filled">forum</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community</span>
             <span className="text-sm font-bold text-slate-900">Latest from the Forum</span>
          </div>
       </div>

       <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-teal-500 transition-all">
          <div className="size-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600">
             <span className="material-symbols-outlined !text-[20px] filled">library_books</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Library Pack</span>
             <span className="text-sm font-bold text-slate-900">Essential Security Modules</span>
          </div>
       </div>

       <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center gap-4 cursor-pointer hover:border-teal-500 transition-all">
          <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
             <span className="material-symbols-outlined !text-[20px] filled">lightbulb</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ForgeAI Tip</span>
             <span className="text-sm font-bold text-slate-900">Optimizing Prompt Chains</span>
          </div>
       </div>
    </div>
  );
};

export default LearnGrow;
