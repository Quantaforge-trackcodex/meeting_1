
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWorkspaceView = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('team');

  // Updated steps to remove 'Collaboration'
  const steps = ['Type', 'Details', 'Setup', 'Defaults'];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-10 font-display">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-2">Create New Workspace</h1>
          <p className="text-slate-500">Set up your development command center.</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-16 relative px-20">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#30363d] -z-10"></div>
          {steps.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2 relative bg-[#0d1117] px-4">
              <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                i <= step ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(19,91,236,0.5)]' : 'border-[#30363d] text-slate-500'
              }`}>
                {i < step ? <span className="material-symbols-outlined !text-[14px]">check</span> : <span className="text-[10px] font-bold">{i + 1}</span>}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${i <= step ? 'text-white' : 'text-slate-600'}`}>{s} Selection</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-12">
            {/* Section 1 */}
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Section 1: Workspace Type Selection</h2>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'personal', label: 'Personal Workspace', icon: 'person', desc: 'For solo developers. Private by default.' },
                  { id: 'team', label: 'Team Workspace', icon: 'groups', desc: 'For teams and organizations. Role-based access.' },
                  { id: 'community', label: 'Community Workspace', icon: 'public', desc: 'Public or semi-public. Learning, open source, live sessions.' }
                ].map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center group ${
                      type === t.id ? 'border-primary bg-primary/5 shadow-[0_0_20px_rgba(19,91,236,0.1)]' : 'border-[#30363d] bg-white/[0.02] hover:border-slate-500'
                    }`}
                  >
                    <div className={`size-12 rounded-full flex items-center justify-center mb-4 transition-colors ${type === t.id ? 'bg-primary text-white' : 'bg-[#161b22] text-slate-500'}`}>
                      <span className="material-symbols-outlined !text-[24px]">{t.icon}</span>
                    </div>
                    <h3 className="text-xs font-bold text-white mb-2">{t.label}</h3>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{t.desc}</p>
                    {type === t.id && <div className="absolute top-3 right-3 size-4 bg-primary rounded-full flex items-center justify-center"><span className="material-symbols-outlined text-[10px] text-white">check</span></div>}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">2: Workspace Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Workspace Name</label>
                  <input className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white" placeholder='e.g., "Phoenix Core"' />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Workspace Visibility</label>
                  <select className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white">
                    <option>Private</option>
                    <option>Public</option>
                    <option>Restricted</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-2">Optional Description</label>
                  <textarea className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary text-white h-24" placeholder="Optional Description" />
                  <p className="text-[9px] text-slate-600 mt-2 italic">This workspace can host multiple projects and includes Editor, Team, Review, Live, and Security pages.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">3: Project & Repository Setup</h2>
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-6 rounded-xl border-2 border-[#30363d] bg-white/[0.02] hover:border-primary cursor-pointer flex flex-col items-center justify-center group transition-all">
                    <span className="material-symbols-outlined !text-[32px] text-slate-500 group-hover:text-primary mb-4">folder_open</span>
                    <span className="text-[11px] font-bold text-white">Create Empty Project</span>
                 </div>
                 <div className="p-6 rounded-xl border-2 border-primary bg-primary/5 flex flex-col relative">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-bold text-white">Import Existing Git Repository</span>
                       <span className="material-symbols-outlined !text-[14px] text-slate-500">expand_more</span>
                    </div>
                    <div className="flex gap-2 mb-4">
                       <div className="size-8 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="material-symbols-outlined text-green-500 text-sm">terminal</span></div>
                       <div className="size-8 rounded bg-white/20 border border-white/30 flex items-center justify-center"><span className="material-symbols-outlined text-white text-sm">hub</span></div>
                       <div className="size-8 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 cursor-pointer"><span className="material-symbols-outlined text-orange-500 text-sm">rocket</span></div>
                    </div>
                    <input className="w-full bg-black/40 border border-[#30363d] rounded p-2 text-[10px] text-white" placeholder="Repository URL" />
                 </div>
                 <div className="p-6 rounded-xl border-2 border-[#30363d] bg-white/[0.02] flex flex-col">
                    <span className="text-[10px] font-bold text-white mb-4">Use a Project Template</span>
                    <div className="grid grid-cols-2 gap-2">
                       <div className="p-2 border border-primary/40 bg-primary/10 rounded flex flex-col items-center gap-1 cursor-pointer">
                          <span className="material-symbols-outlined !text-[16px] text-primary">language</span>
                          <span className="text-[8px] font-bold uppercase text-white">Web App</span>
                       </div>
                       <div className="p-2 border border-[#30363d] bg-white/5 rounded flex flex-col items-center gap-1 hover:border-slate-500 cursor-pointer">
                          <span className="material-symbols-outlined !text-[16px] text-slate-500">api</span>
                          <span className="text-[8px] font-bold uppercase text-slate-400">API</span>
                       </div>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          <div className="space-y-12">
            {/* Removed Section 4: Collaboration & Permissions as requested */}

            {/* Section 5 (Now visually Section 4 in the layout) */}
            <section>
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">4: Environment & Security Defaults</h2>
              <div className="bg-white/[0.02] border border-[#30363d] rounded-xl p-6 space-y-4">
                 {[
                   'Default environments (Dev / Staging / Prod)',
                   'Enable ForgeAI assistance',
                   'Enable CSS (Code Security System)',
                   'Enable real-time collaboration'
                 ].map(opt => (
                    <div key={opt} className="flex items-center justify-between">
                       <span className="text-xs text-slate-300">{opt}</span>
                       <button className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 size-3 bg-white rounded-full"></div></button>
                    </div>
                 ))}
                 <p className="text-[9px] text-slate-500 pt-4 border-t border-[#30363d]">Encrypted at rest and in transit. Role-based access control.</p>
              </div>
            </section>

            {/* Final Action Area */}
            <div className="flex flex-col items-center gap-4 pt-12 border-t border-[#30363d]">
               <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                       setTimeout(() => navigate('/workspace/123'), 1500);
                    }}
                    className="bg-primary hover:bg-blue-600 text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-primary/30"
                  >
                    Create Workspace
                  </button>
                  <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all" onClick={() => navigate('/workspaces')}>Cancel</button>
               </div>
               <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                  Creating workspace...
               </div>
            </div>
          </div>
        </div>

        <footer className="mt-24 text-center text-[11px] text-slate-600">
           <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-slate-500 !text-sm">hub</span>
              <span className="font-bold">Quantaforge Corporation</span>
           </div>
           <p>Copyright © 2023 Quantaforge Corporation</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateWorkspaceView;
