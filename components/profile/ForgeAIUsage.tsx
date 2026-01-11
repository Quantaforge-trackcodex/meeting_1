
import React from 'react';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

const DATA = [
  { value: 20 }, { value: 45 }, { value: 65 }, { value: 35 }, { value: 85 }
];

const ForgeAIUsage = () => {
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] font-display flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-cyan-400 filled !text-xl">auto_awesome</span>
          <h3 className="text-[14px] font-black text-[#f0f6fc] tracking-tight uppercase">ForgeAI Usage</h3>
        </div>
        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[9px] font-black rounded uppercase border border-cyan-400/20 tracking-widest">Pro</span>
      </div>

      <div className="h-20 w-full mb-6 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA}>
            <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">856 Sessions</span>
        <span className="text-[12px] text-cyan-400 font-black">32% Code AI-Assisted</span>
      </div>
    </div>
  );
};

export default ForgeAIUsage;
