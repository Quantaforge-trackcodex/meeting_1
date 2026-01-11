
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', requests: 120 },
  { name: '04:00', requests: 180 },
  { name: '08:00', requests: 450 },
  { name: '12:00', requests: 380 },
  { name: '16:00', requests: 540 },
  { name: '20:00', requests: 320 },
  { name: '23:59', requests: 280 },
];

const MetricCard = ({ title, value, change, description, trend }: any) => (
  <div className="p-5 rounded-xl bg-surface-dark border border-border-dark shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <span className={`${trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'} text-[10px] font-bold px-1.5 py-0.5 rounded`}>
        {change}
      </span>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <p className="text-slate-500 text-[10px] uppercase tracking-wider">{description}</p>
  </div>
);

const ForgeAIView = () => {
  return (
    <div className="p-10 flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">ForgeAI Dashboard</h1>
          <p className="text-slate-500">Monitor and manage your multi-tenant AI infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 grid grid-cols-1 gap-4">
            <MetricCard title="Tokens Used" value="1,248,390" change="+12%" description="Across all tenants" trend="up" />
            <MetricCard title="Daily Requests" value="4,502" change="-3%" description="Peak: 540 req/min" trend="down" />
            <MetricCard title="Estimated Cost" value="$142.00" change="+$12.40" description="Projected: $450/mo" trend="up" />
          </div>

          <div className="xl:col-span-2 p-6 rounded-xl bg-surface-dark border border-border-dark flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold">AI Activity Trend</h3>
                <p className="text-slate-500 text-xs">Request volume over the last 24 hours</p>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-[10px] uppercase font-bold text-primary bg-primary/10 rounded">Live</button>
                <button className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 hover:text-white">24h</button>
              </div>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#135bec', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="requests" stroke="#135bec" fillOpacity={1} fill="url(#colorRequests)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgeAIView;
