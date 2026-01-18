import React from 'react';
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import MissionsView from './MissionsView';
import MissionDetailView from './MissionDetailView';
import TrialRepositoriesView from './TrialRepositoriesView';

const MarketplaceTab = ({ to, label, icon }: { to: string, label: string, icon: string }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                isActive ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <span className="material-symbols-outlined !text-base">{icon}</span>
        {label}
    </NavLink>
);

const MarketplaceLayout = () => {
    return (
        <div className="flex-1 flex flex-col bg-[#0d1117] font-display">
            <header className="p-8 border-b border-gh-border">
                <div className="max-w-[1400px] mx-auto">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight mb-2">Marketplace</h1>
                            <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                                Discover high-value missions, prove your skills in real-world trials, and collaborate with top engineering teams.
                            </p>
                        </div>
                    </div>
                    <nav className="mt-8 flex items-center gap-2 p-2 bg-gh-bg-secondary border border-gh-border rounded-xl w-fit">
                        <MarketplaceTab to="/marketplace/missions" label="Missions" icon="work" />
                        <MarketplaceTab to="/marketplace/trials" label="Trial Repositories" icon="rule" />
                    </nav>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto custom-scrollbar">
                 <Routes>
                    <Route index element={<Navigate to="missions" replace />} />
                    <Route path="missions" element={<MissionsView />} />
                    <Route path="missions/:id" element={<MissionDetailView />} />
                    <Route path="trials" element={<TrialRepositoriesView />} />
                    <Route path="*" element={<Navigate to="missions" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default MarketplaceLayout;