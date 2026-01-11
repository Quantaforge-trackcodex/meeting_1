
import React from 'react';

const Highlights = () => {
  return (
    <div className="mb-8 font-display">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-amber-500 filled !text-xl">bolt</span>
        <h3 className="text-[16px] font-bold text-[#f0f6fc]">Highlights</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] group hover:border-[#8b949e] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">Top Community Post</span>
            <span className="text-amber-500 font-black flex items-center gap-1 text-[12px] bg-amber-500/10 px-1.5 py-0.5 rounded">
              <span className="material-symbols-outlined !text-[14px]">arrow_upward</span> 342
            </span>
          </div>
          <h4 className="text-[14px] font-bold text-[#f0f6fc] group-hover:text-primary transition-colors leading-tight">Guide: Implementing Zero-Trust with Rust in 2024</h4>
        </div>
        
        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] group hover:border-[#8b949e] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-black text-emerald-400 uppercase tracking-[0.1em]">Best Project</span>
            <span className="material-symbols-outlined text-emerald-500 filled !text-[18px]">check_circle</span>
          </div>
          <h4 className="text-[14px] font-bold text-[#f0f6fc] group-hover:text-emerald-400 transition-colors leading-tight">rust-crypto-guard</h4>
          <p className="text-[11px] text-slate-500 mt-1">Used by 1.2k developers</p>
        </div>

        <div className="p-5 rounded-xl bg-[#161b22] border border-[#30363d] group hover:border-[#8b949e] transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[11px] font-black text-amber-500 uppercase tracking-[0.1em]">Featured Gig</span>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black rounded uppercase tracking-widest border border-amber-500/20">Open</span>
          </div>
          <h4 className="text-[14px] font-bold text-[#f0f6fc] group-hover:text-amber-500 transition-colors leading-tight">Security Audit for Enterprise DeFi Protocol</h4>
        </div>
      </div>
    </div>
  );
};

export default Highlights;
