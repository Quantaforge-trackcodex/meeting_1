import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPOS } from '../constants';
import PostJobModal from '../components/jobs/PostJobModal';

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const repo = MOCK_REPOS.find(r => r.id === id) || MOCK_REPOS[0];
  const [activeTab, setActiveTab] = useState('Code');

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);

  // Minimal safe version without complex charts
  return (
    <div className="font-display text-[#c9d1d9] h-full overflow-y-auto relative">
      <div className="bg-[#161b22] border-b border-[#30363d] pt-4">
        <div className="max-w-[1400px] mx-auto px-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#8b949e] !text-[20px]">book</span>
              <div className="flex items-center gap-2 text-xl">
                <span className="text-[#58a6ff] cursor-pointer" onClick={() => navigate('/repositories')}>track-codex</span>
                <span className="text-[#8b949e]">/</span>
                <span className="font-bold text-[#58a6ff]">{repo.name}</span>
                <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[11px] font-bold text-[#8b949e] uppercase bg-[#1c2128] ml-2">{repo.visibility}</span>
              </div>
            </div>

            <button
              onClick={() => setIsJobModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#1f6feb] hover:bg-[#388bfd] text-white rounded-md text-sm font-bold transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined !text-[18px]">person_add</span>
              Hire Expert
            </button>
          </div>

          <div className="flex gap-2 mt-4 text-sm font-medium text-[#8b949e]">
            {['Code', 'Issues', 'Pull Requests', 'Actions', 'Projects', 'Security', 'Insights'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 border-b-2 hover:border-[#8b949e] transition-colors ${activeTab === tab ? 'border-[#f78166] text-[#f0f6fc]' : 'border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg p-8 text-center text-slate-500">
          <span className="material-symbols-outlined !text-[48px] mb-4 opacity-50">code</span>
          <h3 className="text-xl font-bold text-white mb-2">Repository Content</h3>
          <p className="max-w-md mx-auto mb-6">This view has been simplified to ensure stability. The full code browser is being optimized.</p>
          <button
            onClick={() => navigate('/editor')}
            className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-md transition-colors"
          >
            Open in Editor
          </button>
        </div>
      </div>

      <PostJobModal
        isOpen={isJobModalOpen}
        onClose={() => setIsJobModalOpen(false)}
        onSubmit={(job) => console.log("Job Created", job)}
        initialData={{ repoId: repo.id, description: `Hiring an expert for ${repo.name} repository tasks.` }}
      />
    </div>
  );
};

export default RepoDetailView;
