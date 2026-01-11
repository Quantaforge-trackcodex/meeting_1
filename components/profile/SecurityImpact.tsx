
import React from 'react';

const SecurityImpact = () => {
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] font-display relative overflow-hidden group">
      <div className="absolute -top-10 -right-10 size-32 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
      
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-emerald-500 !text-xl">verified_user</span>
        <h3 className="text-[14px] font-black text-[#f0f6fc] tracking-tight uppercase">Security Impact</h3>
        <div className="ml-auto size-6 bg-[#0d1117] border border-[#30363d] rounded flex items-center justify-center">
            <span className="material-symbols-outlined !text-[14px] text-slate-600">shield</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-center">
          <p className="text-[32px] font-black text-emerald-500 leading-none mb-1">142</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vulns Fixed</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-center">
          <p className="text-[32px] font-black text-rose-500 leading-none mb-1">2</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Intro'd (90d)</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[12px] text-slate-400">
        <span className="material-symbols-outlined text-emerald-500 filled !text-[18px]">check_circle</span>
        <span className="font-medium text-[#c9d1d9]">340 Reviews Completed</span>
      </div>
    </div>
  );
};

export default SecurityImpact;
