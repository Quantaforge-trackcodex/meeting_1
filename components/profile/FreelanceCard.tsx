
import React from 'react';

const FreelanceCard = () => {
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] font-display">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 filled !text-xl">work</span>
          <h3 className="text-[14px] font-black text-[#f0f6fc] tracking-tight uppercase">Freelance</h3>
        </div>
        <div className="flex items-center gap-1 text-amber-500 font-black">
          <span className="material-symbols-outlined !text-[16px]">star</span>
          <span className="text-[15px]">5.0</span>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-slate-500 font-medium">Jobs Completed</span>
          <span className="text-[14px] font-black text-[#f0f6fc]">24</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-slate-500 font-medium">Top Category</span>
          <span className="text-[14px] font-black text-[#f0f6fc]">Security Audits</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-[#0d1117] rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 w-[88%] shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">88% Repeat Hire Rate</span>
        </div>
      </div>
    </div>
  );
};

export default FreelanceCard;
