
import React from 'react';

const REPOS = [
  { 
    name: 'rust-crypto-guard', 
    desc: 'High-performance cryptographic primitives for secure communication channels in distributed systems.', 
    lang: 'Rust', 
    langColor: '#f97316', 
    stars: '1.2k', 
    forks: 142, 
    health: 'A+',
    assist: '45%'
  },
  { 
    name: 'forge-ai-security', 
    desc: 'Automated vulnerability scanning pipeline leveraging LLMs for code analysis.', 
    lang: 'Python', 
    langColor: '#135bec', 
    stars: 856, 
    forks: 89, 
    health: 'A',
    assist: '90%'
  }
];

const PinnedRepos = () => {
  return (
    <div className="font-display">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-[#f0f6fc]">Pinned Repositories</h3>
        <button className="text-[12px] text-[#58a6ff] hover:underline font-medium transition-all">Customize</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPOS.map(repo => (
          <div key={repo.name} className="p-5 bg-[#161b22] border border-[#30363d] rounded-xl group hover:border-[#8b949e] transition-all cursor-pointer flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="material-symbols-outlined text-slate-500 !text-xl shrink-0">book</span>
                <h4 className="text-[14px] font-bold text-[#58a6ff] group-hover:underline truncate">{repo.name}</h4>
                <span className="px-1.5 py-0.5 rounded-full border border-[#30363d] text-[9px] text-slate-500 font-black uppercase tracking-tight shrink-0">Public</span>
              </div>
              <div className="size-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 shrink-0">
                {repo.health}
              </div>
            </div>
            <p className="text-[13px] text-slate-400 leading-snug mb-6 h-10 line-clamp-2">{repo.desc}</p>
            <div className="flex items-center gap-5 text-[12px] text-slate-400 mt-auto">
              <div className="flex items-center gap-1.5">
                <div className="size-3 rounded-full" style={{ backgroundColor: repo.langColor }}></div>
                <span className="text-[#c9d1d9]">{repo.lang}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-[#58a6ff]">
                <span className="material-symbols-outlined !text-[16px]">star</span>
                <span>{repo.stars}</span>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 ml-auto font-black">
                <span className="material-symbols-outlined !text-[16px] filled">auto_fix_high</span>
                <span>{repo.assist}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PinnedRepos;
