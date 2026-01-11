
import React from 'react';

const ContinueWorkspaces = () => {
  const workspaces = [
    { name: 'trackcodex-core', org: 'Quantaforge Organization', status: '98 A+', badgeColor: 'text-emerald-500 bg-emerald-50 border-emerald-100', aiText: 'ForgeAI fixed 3 issues' },
    { name: 'client-payment-gateway', org: 'Freelance Project', status: '85 B', badgeColor: 'text-amber-500 bg-amber-50 border-amber-100', aiText: 'Edited 2 hours ago', icon: 'edit' },
    { name: 'personal-blog-v3', org: 'Personal', status: '92 A', badgeColor: 'text-emerald-500 bg-emerald-50 border-emerald-100', aiText: 'CI Pipeline failing', icon: 'error', aiColor: 'text-rose-500' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workspaces.map((ws, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
             <div>
               <h3 className="text-lg font-bold text-slate-900">{ws.name}</h3>
               <p className="text-xs text-slate-500 mt-1">{ws.org}</p>
             </div>
             <div className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase flex items-center gap-1 ${ws.badgeColor}`}>
                <span className="material-symbols-outlined !text-[12px] filled">shield</span>
                {ws.status}
             </div>
          </div>
          <div className="flex items-center gap-2 mb-6">
             <span className={`material-symbols-outlined !text-[16px] ${ws.aiColor || 'text-teal-500'} ${ws.aiText.includes('ForgeAI') ? 'filled' : ''}`}>
                {ws.icon || 'auto_awesome'}
             </span>
             <span className={`text-[12px] font-bold ${ws.aiColor || 'text-slate-600'}`}>{ws.aiText}</span>
          </div>
          <button className="w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 transition-all">
            Open Workspace
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContinueWorkspaces;
