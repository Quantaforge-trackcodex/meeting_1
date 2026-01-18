import React, { useState } from 'react';
import { MOCK_TRIAL_REPOS } from '../../constants';
import { TrialRepo } from '../../types';

const TrialCard = ({ trial }: { trial: TrialRepo }) => (
    <div className="bg-gh-bg-secondary border border-gh-border rounded-2xl p-6 flex flex-col group hover:border-gh-text-secondary transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
                <img src={trial.logo} className="h-10 w-10 object-contain" alt={trial.company} />
                <div>
                    <h3 className="font-bold text-white group-hover:text-primary transition-colors">{trial.title}</h3>
                    <p className="text-xs text-slate-400">{trial.company} • {trial.location} • {trial.salaryRange}</p>
                </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${trial.status === 'Newly Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>{trial.status}</span>
        </div>

        <div className="my-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Codebase Challenge</h4>
            <p className="text-sm text-slate-300 font-medium">"{trial.description}"</p>
        </div>
        
        <div className="flex flex-wrap gap-2 my-4">
            {trial.tech.map(t => <span key={t} className="px-2 py-1 text-[10px] bg-gh-bg border border-gh-border rounded font-bold text-slate-400">{t}</span>)}
        </div>
        
        <div className="mt-auto pt-4 border-t border-gh-border flex items-center justify-between">
            <div className="flex gap-4">
                <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg">Fork & Start Trial</button>
                <button className="px-4 py-2 text-xs font-bold text-slate-300 border border-gh-border rounded-lg hover:border-slate-400">View Specs</button>
            </div>
        </div>
    </div>
);

const TrialRepositoriesView = () => {
    const [trials, setTrials] = useState<TrialRepo[]>(MOCK_TRIAL_REPOS);

    return (
        <div className="flex">
            <aside className="w-64 p-8 border-r border-gh-border">
                <h3 className="text-sm font-bold text-white mb-6">Filter Trials</h3>
                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-slate-400">Industry</label>
                        <div className="mt-2 space-y-2">
                           <button className="w-full flex justify-between items-center p-2 rounded bg-gh-bg-secondary border border-gh-border text-xs text-white">Fintech <span className="text-slate-500">8</span></button>
                           <button className="w-full flex justify-between items-center p-2 rounded text-xs text-slate-400">DevTools <span className="text-slate-500">12</span></button>
                        </div>
                    </div>
                     <div>
                        <label className="text-xs font-bold text-slate-400">Tech Stack</label>
                         <div className="mt-2 space-y-2">
                           <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" className="form-checkbox bg-gh-bg border-gh-border" defaultChecked /> Go</label>
                           <label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" className="form-checkbox bg-gh-bg border-gh-border" /> Rust</label>
                        </div>
                    </div>
                </div>
            </aside>
            <main className="flex-1 p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Trial Repositories</h2>
                            <p className="text-sm text-slate-400 mt-1">A real-world task to prove your skills. No algorithm puzzles allowed.</p>
                        </div>
                        <div className="flex items-center gap-2 p-1 rounded-lg bg-gh-bg-secondary border border-gh-border">
                             <button className="px-3 py-1 text-xs rounded-md bg-white/10 text-white">Sort: Newest</button>
                             <button className="px-3 py-1 text-xs rounded-md text-slate-400">Sort: Highest Pay</button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {trials.map(trial => <TrialCard key={trial.id} trial={trial} />)}
                    </div>
                    
                    <div className="text-center mt-8">
                        <button className="px-5 py-2 text-sm font-bold border border-gh-border rounded-lg bg-gh-bg-secondary text-white">Show More Trial Repositories</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TrialRepositoriesView;