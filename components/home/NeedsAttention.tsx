
import React from 'react';

const NeedsAttention = () => {
  return (
    <div className="space-y-4">
       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 flex items-center justify-between border-b border-slate-50">
             <div className="flex items-center gap-4">
                <div className="size-2 rounded-full bg-rose-500"></div>
                <div>
                   <h4 className="text-sm font-bold text-slate-900">legacy-auth-service</h4>
                   <p className="text-xs text-slate-500">Critical vulnerability in dependencies</p>
                </div>
             </div>
             <button className="px-4 py-1.5 bg-rose-500/10 text-rose-600 text-[11px] font-black uppercase rounded-lg hover:bg-rose-500/20 transition-all">Fix Now</button>
          </div>
          <div className="p-5 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="size-2 rounded-full bg-amber-500"></div>
                <div>
                   <h4 className="text-sm font-bold text-slate-900">frontend-dashboard</h4>
                   <p className="text-xs text-slate-500">CSS Score dropped to C (74)</p>
                </div>
             </div>
             <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-black uppercase rounded-lg hover:bg-slate-200 transition-all">Review</button>
          </div>
       </div>
    </div>
  );
};

export default NeedsAttention;
