
import React from 'react';
import { MOCK_TRIAL_REPOS } from '../../constants';
import { TrialRepo } from '../../types';

const TrialCard: React.FC<{ trial: TrialRepo }> = ({ trial }) => {
    return (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 flex flex-col relative group hover:border-[#58a6ff] transition-all duration-300">
            {/* Header: Logo & Salary */}
            <div className="flex justify-between items-start mb-5">
                <div className="size-12 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm overflow-hidden">
                    <img
                        src={trial.logo}
                        className="w-full h-full object-contain"
                        alt={trial.company}
                    />
                </div>
                <div className="px-3 py-1.5 bg-[#1f6feb]/15 text-[#58a6ff] text-[11px] font-bold rounded-full border border-[#1f6feb]/20 tracking-wide">
                    {trial.salaryRange}
                </div>
            </div>

            {/* Title & Location */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight group-hover:text-[#58a6ff] transition-colors">{trial.title}</h3>
                <div className="text-[13px] text-[#8b949e] font-medium flex items-center gap-1.5">
                    <span className="text-[#c9d1d9]">{trial.company}</span>
                    <span className="text-[#30363d]">•</span>
                    <span>{trial.location}</span>
                </div>
            </div>

            {/* Repo & Mission */}
            <div className="mb-6 flex-1">
                <div className="flex items-center gap-2 text-[#58a6ff] text-[13px] font-mono mb-3 opacity-90 hover:underline cursor-pointer">
                    <span className="material-symbols-outlined !text-[16px] -mt-0.5">code</span>
                    {trial.repoName || 'repo/unknown'}
                </div>
                <div className="p-4 bg-[#0d1117] border border-[#30363d] rounded-lg relative">
                    <p className="text-[13px] text-[#c9d1d9] leading-relaxed italic font-medium">
                        "{trial.description}"
                    </p>
                </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {trial.tech.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-[#21262d] border border-[#30363d] text-[#8b949e] text-[11px] font-semibold rounded-md">
                        {t}
                    </span>
                ))}
            </div>

            {/* Action */}
            <button className="w-full py-2.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[13px] font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_1px_0_rgba(27,31,36,0.1)] hover:shadow-[0_1px_0_rgba(27,31,36,0.1),_inset_0_1px_0_rgba(255,255,255,0.03)] active:bg-[#238636]">
                <span className="material-symbols-outlined !text-[18px] filled">play_arrow</span>
                Start Trial
            </button>
        </div>
    );
};

const TrialRepositoriesView = () => {
    return (
        <div className="p-8 max-w-[1400px] mx-auto">
            <div className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">Repo-Based Job Feed</h2>
                <p className="text-[#8b949e] text-[15px]"> Prove your skills by solving real issues on enterprise repositories. Start a trial and get hired.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_TRIAL_REPOS.map(trial => <TrialCard key={trial.id} trial={trial} />)}
            </div>
        </div>
    );
};

export default TrialRepositoriesView;
