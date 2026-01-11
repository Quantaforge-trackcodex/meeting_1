
import React, { useState } from 'react';
import { MOCK_WORKSPACES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '../types';

const WorkspaceCard: React.FC<{ workspace: Workspace }> = ({ workspace }) => {
  const navigate = useNavigate();
  const isActive = workspace.status === 'Running';
  
  return (
    <div className={`group bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col ${!isActive ? 'opacity-75' : ''}`}>
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${isActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'} flex items-center justify-center`}>
              <span className="material-symbols-outlined text-2xl">terminal</span>
            </div>
            <div>
              <h3 className="font-bold text-white group-hover:text-primary transition-colors">{workspace.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-emerald-500' : 'text-slate-500'}`}>{workspace.status}</span>
              </div>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="material-symbols-outlined text-base">account_tree</span>
            <span className="truncate">{workspace.repo}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="material-symbols-outlined text-base">schedule</span>
            <span>Accessed {workspace.lastModified}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {workspace.collaborators.map((c: string, i: number) => (
              <img key={i} className="w-7 h-7 rounded-full border-2 border-[#161b22] bg-slate-800" src={c} alt="Avatar" />
            ))}
          </div>
          <span className="text-xs font-medium text-slate-500">{workspace.runtime}</span>
        </div>
      </div>
      <div className="p-3 bg-black/20 border-t border-[#30363d] grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-[#2d333b] border border-[#30363d] rounded-lg hover:bg-slate-700 transition-colors">
          <span className="material-symbols-outlined text-lg">{isActive ? 'stop_circle' : 'play_circle'}</span>
          {isActive ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={() => navigate(`/workspace/${workspace.id}`)}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          Open
        </button>
      </div>
    </div>
  );
};

const Workspaces = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  
  const filteredWorkspaces = MOCK_WORKSPACES.filter(ws => {
    if (filter === 'Active') return ws.status === 'Running';
    if (filter === 'Stopped') return ws.status === 'Stopped';
    return true;
  });

  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Workspaces</h1>
          <p className="text-slate-400 text-sm">Manage and launch your cloud development environments.</p>
        </div>
        <button 
          onClick={() => navigate('/workspace/new')}
          className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create New Workspace
        </button>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-2 mb-8 flex flex-col lg:flex-row items-center gap-4">
        <div className="flex items-center gap-1 p-1 bg-black/20 rounded-lg w-full lg:w-auto">
          {['All', 'Active', 'Stopped'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                filter === f ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'
              }`}
            >
              {f} Workspaces
            </button>
          ))}
        </div>
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input 
            className="w-full bg-transparent border-none focus:ring-0 pl-11 text-sm py-3 text-white" 
            placeholder="Search workspaces..." 
            type="text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkspaces.map(ws => (
          <WorkspaceCard key={ws.id} workspace={ws} />
        ))}
        
        <button 
          onClick={() => navigate('/workspace/new')}
          className="border-2 border-dashed border-[#30363d] rounded-xl p-5 flex flex-col items-center justify-center text-slate-500 hover:border-primary hover:text-primary transition-all gap-3 bg-white/[0.02] group min-h-[250px]"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </div>
          <div className="text-center">
            <p className="font-bold">Create New Workspace</p>
            <p className="text-xs">Setup a new environment</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Workspaces;
