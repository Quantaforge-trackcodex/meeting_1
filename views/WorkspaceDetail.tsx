
import React from 'react';
import { useNavigate } from 'react-router-dom';

const WorkspaceDetailView = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#0d1117] font-display">
      {/* Workspace Header Bar */}
      <header className="h-14 border-b border-[#1e293b] bg-[#0d1117] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold group cursor-pointer hover:bg-white/10">
            <span className="text-slate-500 font-normal">Workspace:</span>
            <span className="text-white">Core Services</span>
            <span className="material-symbols-outlined !text-[16px] text-slate-500 group-hover:text-white transition-colors">expand_more</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold group cursor-pointer hover:bg-white/10">
            <span className="text-slate-500 font-normal">Project:</span>
            <span className="text-white">Phoenix Core</span>
            <span className="material-symbols-outlined !text-[16px] text-slate-500 group-hover:text-white transition-colors">expand_more</span>
          </div>
          <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] px-3 py-1.5 rounded-lg text-xs font-mono">
            <span className="material-symbols-outlined !text-[16px] text-slate-500">account_tree</span>
            <span className="text-white">main</span>
            <span className="text-slate-500">(4 commits ahead)</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment:</span>
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md">Dev</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase">
             <span className="material-symbols-outlined !text-[16px] filled">check_circle</span>
             Synced
          </div>
          <div className="w-px h-6 bg-border-dark mx-1"></div>
          <button className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-bold">
             <span className="material-symbols-outlined !text-[16px]">shield</span>
             CSS
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Pull Requests */}
        <aside className="w-[320px] border-r border-[#1e293b] bg-[#0d1117] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#1e293b] flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Pull Requests</span>
            <span className="material-symbols-outlined !text-[18px] text-slate-500 cursor-pointer">filter_list</span>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
             {[
               { id: '#452', title: 'Fix API endpoint bug', status: 'Open, Failing CI', color: 'border-emerald-500 bg-emerald-500/10' },
               { id: '#453', title: 'Database schema update', status: 'Open, Passing CI', color: 'border-amber-500 bg-amber-500/10' },
               { id: '#454', title: 'UI enhancements', status: 'Merged', color: 'border-purple-500 bg-purple-500/10' }
             ].map(pr => (
               <div key={pr.id} className={`p-4 border-l-4 mb-2 cursor-pointer transition-all hover:brightness-125 ${pr.color}`}>
                  <h4 className="text-[13px] font-bold text-white mb-1">{pr.id}: {pr.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium italic">{pr.status}</p>
               </div>
             ))}
          </div>
        </aside>

        {/* Main Split Editor */}
        <main className="flex-1 flex flex-col bg-[#0b0e14] overflow-hidden">
          <div className="h-10 border-b border-[#1e293b] bg-[#0d1117] flex items-center px-4 justify-between">
             <div className="flex items-center gap-2 text-[12px] text-white">
                <span className="material-symbols-outlined !text-[14px] text-blue-400">javascript</span>
                <span className="font-bold">database.config.ts</span>
             </div>
             <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px] font-bold">
                   Comment <span className="material-symbols-outlined !text-[14px]">expand_more</span>
                </button>
                <div className="flex items-center bg-[#161b22] border border-[#30363d] p-0.5 rounded-lg">
                   <button className="size-7 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined !text-[16px]">view_sidebar</span></button>
                   <button className="size-7 flex items-center justify-center text-white bg-[#2d333b] rounded"><span className="material-symbols-outlined !text-[16px]">view_column</span></button>
                </div>
             </div>
          </div>

          <div className="flex-1 grid grid-cols-2 font-mono text-[13px] overflow-hidden divide-x divide-[#1e293b]">
             <div className="overflow-y-auto no-scrollbar pt-4 relative bg-[#0d1117]">
                <div className="absolute left-0 top-0 w-10 h-full bg-[#0d1117] border-r border-[#1e293b] flex flex-col items-center pt-4 text-slate-700 select-none">
                   {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <span key={n} className="h-6">{n}</span>)}
                </div>
                <div className="pl-14 pr-4 space-y-0.5 text-slate-400">
                   <div className="h-6">import &#123; Sareost &#125; from 'testLocal';</div>
                   <div className="h-6">import &#123; C1aimDat &#125; from 'api.cotentafivomemardate';</div>
                   <div className="h-6 text-purple-400">import ForgeA from 'origess';</div>
                   <div className="h-6"></div>
                   <div className="h-6">export debw = &#123;</div>
                   <div className="h-6">  connection: &#123;</div>
                   <div className="h-6">    methods: 'connection pool',</div>
                   <div className="h-6">    pav: 'sistemwt.passiowen.connection.pool',</div>
                   <div className="h-6">    paq: 'slnarmut.asseimtensepteas'</div>
                   <div className="h-6">  &#125;,</div>
                   <div className="h-6">  metacoement: &#123;</div>
                   <div className="h-6 bg-red-950/40 text-red-300 -mx-4 px-4 border-l-2 border-red-500">    writIid: 'applicationL',</div>
                   <div className="h-6 bg-red-950/40 text-red-300 -mx-4 px-4 border-l-2 border-red-500">    rename: 'string-contaimed',</div>
                   <div className="h-6">    lintename: 'Scereipt',</div>
                   <div className="h-6">    username: 'string'</div>
                </div>
                {/* Inline Comment */}
                <div className="ml-14 mt-4 mr-4 p-4 bg-[#161b22] border border-[#30363d] rounded-xl relative shadow-2xl">
                   <div className="flex gap-3 mb-3">
                      <img src="https://picsum.photos/seed/sarah/32" className="size-6 rounded-full" />
                      <div>
                         <p className="text-[11px] font-bold text-white">Sarah K. <span className="text-slate-500 font-normal">This looks good, but consider line 14 with nnajor connection...</span></p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <img src="https://picsum.photos/seed/alex/32" className="size-6 rounded-full" />
                      <div>
                         <p className="text-[11px] font-bold text-white">David L. <span className="text-slate-500 font-normal">Added a fix.</span></p>
                      </div>
                   </div>
                   <input className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg mt-3 p-2 text-[10px] text-slate-500" placeholder="Reply..." />
                </div>
             </div>

             <div className="overflow-y-auto no-scrollbar pt-4 relative bg-[#0d1117]">
                <div className="absolute left-0 top-0 w-10 h-full bg-[#0d1117] border-r border-[#1e293b] flex flex-col items-center pt-4 text-slate-700 select-none">
                   {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(n => <span key={n} className="h-6">{n}</span>)}
                </div>
                <div className="pl-14 pr-4 space-y-0.5 text-slate-400">
                   <div className="h-6">import &#123; Evert &#125; from 'testLocal';</div>
                   <div className="h-6">import &#123; ClaimAs &#125; from 'api.contoi@emenardate';</div>
                   <div className="h-6 text-purple-400">import Forget from 'origess';</div>
                   <div className="h-6"></div>
                   <div className="h-6">export debw = &#123;</div>
                   <div className="h-6">  connection: &#123;</div>
                   <div className="h-6">    methods: 'connection pool',</div>
                   <div className="h-6">    pav: 'sistemwt.passiowen.connection.pool',</div>
                   <div className="h-6">    paq: 'slnarmut.pass%asseptman'</div>
                   <div className="h-6">  &#125;,</div>
                   <div className="h-6">  metacoement: &#123;</div>
                   <div className="h-6 bg-emerald-950/40 text-emerald-300 -mx-4 px-4 border-l-2 border-emerald-500">    writIid: 'applicationL',</div>
                   <div className="h-6 bg-emerald-950/40 text-emerald-300 -mx-4 px-4 border-l-2 border-emerald-500">    rename: 'string-contaimed',</div>
                   <div className="h-6">    lintename: 'Scereipt',</div>
                   <div className="h-6">    username: 'string'</div>
                   <div className="h-6 bg-emerald-950/40 text-emerald-300 -mx-4 px-4 border-l-2 border-emerald-500">    consicolorContnent: &#123;</div>
                   <div className="h-6 bg-emerald-950/40 text-emerald-300 -mx-4 px-4 border-l-2 border-emerald-500">      enableId: "config.tsas",</div>
                   <div className="h-6 bg-emerald-950/40 text-emerald-300 -mx-4 px-4 border-l-2 border-emerald-500">      addressubtsd: 'amdroverest.pool',</div>
                </div>
             </div>
          </div>
          
          <div className="p-4 border-t border-[#1e293b] flex items-center justify-end gap-3 bg-[#0d1117]">
             <button className="bg-primary hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-black uppercase tracking-widest text-[11px] transition-all">Merge Pull Request</button>
             <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold text-[11px] transition-all">Request Changes</button>
          </div>
        </main>

        {/* Right Sidebar: AI Review */}
        <aside className="w-[340px] border-l border-[#1e293b] bg-[#0d1117] flex flex-col shrink-0">
           <div className="p-6 space-y-8">
              <section className="p-5 bg-white/[0.02] border border-[#30363d] rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-3 opacity-10">
                    <span className="material-symbols-outlined text-4xl text-primary filled">auto_awesome</span>
                 </div>
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">AI Review Summary & CI/CD</h3>
                 
                 <div className="space-y-6">
                    <div>
                       <h4 className="text-[12px] font-black text-white mb-2">AI Summary:</h4>
                       <p className="text-[12px] text-slate-400 leading-relaxed">
                          The changes introduce a new connection pool. No major issues found. 92% test coverage.
                       </p>
                    </div>

                    <div>
                       <h4 className="text-[12px] font-black text-white mb-2">CI/CD Status:</h4>
                       <ul className="space-y-2 text-[12px]">
                          <li className="flex items-center justify-between">
                             <span className="text-slate-500">- Build:</span>
                             <span className="text-emerald-500 font-bold">Passing</span>
                          </li>
                          <li className="flex items-center justify-between">
                             <span className="text-slate-500">- Tests:</span>
                             <span className="text-red-500 font-bold">Failing (2/234)</span>
                          </li>
                          <li className="flex items-center justify-between">
                             <span className="text-slate-500">- Linting:</span>
                             <span className="text-emerald-500 font-bold">Passing</span>
                          </li>
                       </ul>
                    </div>
                 </div>
              </section>

              <section className="p-5 bg-white/[0.02] border border-[#30363d] rounded-2xl">
                 <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Merge Approval</h3>
                 <div className="space-y-4">
                    {[
                      { name: 'Sarah K.', status: 'Approved', color: 'text-emerald-500', avatar: 'https://picsum.photos/seed/sarah/32' },
                      { name: 'David L.', status: 'Approved', color: 'text-emerald-500', avatar: 'https://picsum.photos/seed/alex/32' },
                      { name: 'Michael R.', status: 'Pending', color: 'text-amber-500', avatar: 'https://picsum.photos/seed/marcus/32' }
                    ].map(u => (
                       <div key={u.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <img src={u.avatar} className="size-8 rounded-full border border-border-dark" />
                             <span className="text-[12px] font-bold text-white">{u.name}</span>
                          </div>
                          <span className={`text-[11px] font-bold ${u.color}`}>({u.status})</span>
                       </div>
                    ))}
                 </div>
              </section>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default WorkspaceDetailView;
