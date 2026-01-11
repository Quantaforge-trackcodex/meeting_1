
import React, { useState } from 'react';
import { MOCK_REPOS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Repository } from '../types';

const AIHealthIndicator = ({ score, label }: { score: string; label: string }) => {
  const getColors = () => {
    if (score.startsWith('A')) return { text: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' };
    if (score.startsWith('B')) return { text: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' };
    return { text: 'text-rose-400', border: 'border-rose-500/30', bg: 'bg-rose-500/10' };
  };
  const colors = getColors();
  
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-full border-2 ${colors.border} flex items-center justify-center font-black text-xs ${colors.text} ${colors.bg}`}>
        {score}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Health</span>
        <span className={`text-[11px] font-bold ${colors.text}`}>{label}</span>
      </div>
    </div>
  );
};

const SecurityIndicator = ({ status }: { status: string }) => {
  const isPassing = status === 'Passing';
  return (
    <div className="flex items-center gap-3">
      <div className={`size-10 rounded-full border-2 ${isPassing ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-rose-500/30 text-rose-400 bg-rose-500/10'} flex items-center justify-center`}>
        <span className="material-symbols-outlined !text-[20px] filled">{isPassing ? 'verified' : 'error'}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security</span>
        <span className={`text-[11px] font-bold ${isPassing ? 'text-slate-300' : 'text-rose-400'}`}>{status}</span>
      </div>
    </div>
  );
};

const Repositories = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Repos');

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Repositories</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              Manage your codebases, track AI health scores, and monitor security vulnerabilities across all your Gitea projects.
            </p>
          </div>
          <button className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined !text-[20px]">add</span>
            New Repository
          </button>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] p-1 rounded-lg">
            {['All Repos', 'Public', 'Private', 'Sources', 'Forks'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  filter === f ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#161b22] border border-[#30363d] rounded-lg p-0.5">
               <button className="size-8 flex items-center justify-center bg-[#2d333b] text-white rounded-md">
                 <span className="material-symbols-outlined !text-[20px]">grid_view</span>
               </button>
               <button className="size-8 flex items-center justify-center text-slate-500 hover:text-white">
                 <span className="material-symbols-outlined !text-[20px]">list</span>
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_REPOS.map(repo => (
            <div 
              key={repo.id}
              className="group bg-[#161b22]/50 border border-[#30363d] rounded-2xl p-6 hover:border-[#8b949e] transition-all flex flex-col relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined !text-[24px]">source</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/repo/${repo.id}`)}>
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-primary transition-colors">{repo.name}</h3>
                      <span className="px-2 py-0.5 rounded border border-[#30363d] text-[10px] text-slate-500 font-bold uppercase tracking-wider">{repo.visibility}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium tracking-tight">Updated {repo.lastUpdated}</p>
                  </div>
                </div>
              </div>

              <p className="text-[12px] text-slate-400 leading-snug mb-8 h-10 line-clamp-2 overflow-hidden">
                {repo.description}
              </p>

              <div className="grid grid-cols-2 gap-4 bg-[#0d1117] border border-[#30363d] p-4 rounded-xl mb-6">
                <AIHealthIndicator score={repo.aiHealth} label={repo.aiHealthLabel} />
                <SecurityIndicator status={repo.securityStatus} />
              </div>

              <div className="mt-auto pt-4 border-t border-[#30363d]/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <div className="size-3 rounded-full" style={{ backgroundColor: repo.techColor }}></div>
                    <span>{repo.techStack}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/workspace/new');
                  }}
                  className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-primary/20"
                >
                  Open in Workspace
                </button>
              </div>
            </div>
          ))}

          {/* New Repository Placeholder Card */}
          <div 
            onClick={() => navigate('/repositories')}
            className="border-2 border-dashed border-[#30363d] rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all group cursor-pointer bg-white/[0.02]"
          >
            <div className="size-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors mb-4">
              <span className="material-symbols-outlined !text-[28px]">add</span>
            </div>
            <h3 className="font-bold text-slate-100 group-hover:text-primary mb-1">Create new repository</h3>
            <p className="text-center text-[11px] text-slate-500 max-w-[200px]">Start a new project or import an existing repository from another Git provider.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Repositories;
