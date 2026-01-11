
import React from 'react';
import { MOCK_WORKSPACES, MOCK_AI_TASKS, MOCK_SESSIONS } from '../constants';

const StatCard = ({ title, value, change, progress, color = 'primary' }: any) => (
  <div className="p-5 rounded-xl bg-surface-dark border border-border-dark">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{title}</span>
      <span className={`${change.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'} text-[10px] font-bold bg-slate-900/50 px-1.5 py-0.5 rounded`}>
        {change}
      </span>
    </div>
    <div className="text-2xl font-bold font-display">{value}</div>
    <div className="mt-4 h-1 w-full bg-border-dark rounded-full overflow-hidden">
      <div className={`bg-${color} h-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const Overview = () => {
  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Workspaces" value="12" change="+20%" progress={60} />
        <StatCard title="Active Repos" value="45" change="+5%" progress={45} />
        <StatCard title="Live Sessions" value="3" change="-2%" progress={15} />
        <StatCard title="AI Tokens Used" value="12.4k" change="+15%" progress={85} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold">Active Workspaces</h2>
            <button className="text-xs text-slate-500 hover:text-slate-100 flex items-center gap-1 transition-colors">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="rounded-xl border border-border-dark overflow-hidden bg-surface-dark">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1c1c20] text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Workspace Name</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Runtime</th>
                  <th className="px-6 py-4">Last Modified</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark">
                {MOCK_WORKSPACES.map(ws => (
                  <tr key={ws.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">{ws.name}</span>
                        <span className="text-[11px] font-mono text-slate-500 mt-0.5">{ws.branch} • {ws.commit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`flex h-2 w-2 rounded-full ${ws.status === 'Running' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`}></span>
                        <span className={`text-xs font-medium ${ws.status === 'Running' ? 'text-emerald-500' : 'text-slate-500'}`}>{ws.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-xs text-slate-500 font-mono">{ws.runtime}</td>
                    <td className="px-6 py-5 text-xs text-slate-500">{ws.lastModified}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-xs font-bold text-primary hover:underline">Open IDE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">bolt</span>
              <h3 className="text-sm font-bold uppercase tracking-wider">ForgeAI Activity</h3>
            </div>
            <div className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col gap-6">
              {MOCK_AI_TASKS.map((task, idx) => (
                <div key={task.id} className="flex gap-3 relative">
                  {idx !== MOCK_AI_TASKS.length - 1 && <div className="absolute left-2.5 top-6 bottom-[-1.5rem] w-px bg-border-dark"></div>}
                  <div className={`size-5 rounded-full ${task.result === 'Success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-primary/20 text-primary'} flex items-center justify-center z-10`}>
                    <span className="material-symbols-outlined text-[12px]">{task.result === 'Success' ? 'security' : 'auto_fix_high'}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium leading-relaxed">
                      {task.taskName} in <code className="font-mono text-primary bg-primary/5 px-1 rounded">{task.fileName}</code>
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block">{task.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-xl">sensors</span>
                <h3 className="text-sm font-bold uppercase tracking-wider">Live Sessions</h3>
              </div>
              <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold">{MOCK_SESSIONS.length} Active</span>
            </div>
            <div className="bg-surface-dark border border-border-dark rounded-xl p-4">
              <div className="flex flex-col gap-4">
                {MOCK_SESSIONS.slice(0, 3).map(session => (
                  <div key={session.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full border-2 border-primary/30 p-0.5">
                        <img className="size-full rounded-full bg-cover bg-center" src={session.hostAvatar} alt={session.host} />
                      </div>
                      <div>
                        <p className="text-xs font-bold">{session.host}</p>
                        <p className="text-[10px] text-slate-500">Working on <span className="font-mono">{session.project}</span></p>
                      </div>
                    </div>
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 border border-border-dark rounded-lg text-[11px] font-bold hover:bg-white/5 transition-colors uppercase tracking-widest">
                View All Presence
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Overview;
