
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const DATA = [
  { name: 'Python', value: 45, color: '#135bec' },
  { name: 'Rust', value: 30, color: '#f97316' },
  { name: 'Go', value: 25, color: '#a855f7' },
];

const CodingSnapshot = () => {
  return (
    <div className="p-6 rounded-xl bg-[#161b22] border border-[#30363d] font-display flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary !text-xl">code</span>
          <h3 className="text-[14px] font-black text-[#f0f6fc] tracking-tight uppercase">Coding Snapshot</h3>
        </div>
        <button className="text-[11px] font-bold text-slate-500 hover:text-white transition-colors">View Details</button>
      </div>

      <div className="flex items-center gap-8 mb-6 flex-1">
        <div className="size-24 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={DATA} innerRadius={30} outerRadius={42} paddingAngle={5} dataKey="value">
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-slate-500 uppercase leading-none">Stats</span>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {DATA.map(lang => (
            <div key={lang.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: lang.color }}></div>
                <span className="text-[13px] font-bold text-slate-300">{lang.name}</span>
              </div>
              <span className="text-[13px] font-black text-[#f0f6fc]">{lang.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-[#30363d]">
        <p className="text-[11px] text-slate-500 font-medium">
          Recent Activity: <span className="text-[#c9d1d9]">Refactored auth module in core-lib</span>
        </p>
      </div>
    </div>
  );
};

export default CodingSnapshot;
