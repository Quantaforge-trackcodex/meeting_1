
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_REPOS } from '../constants';
import { forgeAIService } from '../services/gemini';

const MOCK_COMMITS = [
  { id: '9a8b7c6', message: 'feat: update dependency versions and fix types', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '3 hours ago' },
  { id: '5f4e3d2', message: 'refactor: optimize database queries for better performance', author: 'sarah-coder', avatar: 'https://picsum.photos/seed/sarah/32', date: '2 days ago' },
  { id: '1a2b3c4', message: 'chore: add new favicon assets', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '1 week ago' },
  { id: 'e5f6g7h', message: 'docs: update installation instructions', author: 'mike-doc', avatar: 'https://picsum.photos/seed/mike/32', date: '2 weeks ago' },
  { id: 'h7g6f5e', message: 'fix: resolve race condition in auth middleware', author: 'alex-dev', avatar: 'https://picsum.photos/seed/alex/32', date: '1 month ago' },
];

const MOCK_WORKFLOW_RUNS = [
  { id: 'w1', name: 'CI Pipeline', status: 'Success', runNumber: '#124', branch: 'main', time: '2 hours ago', duration: '1m 24s', author: 'alex-dev' },
  { id: 'w2', name: 'Security Scan', status: 'Running', runNumber: '#125', branch: 'feat/auth-v2', time: '10 mins ago', duration: '--', author: 'sarah-coder' },
  { id: 'w3', name: 'Deployment to Staging', status: 'Failed', runNumber: '#123', branch: 'main', time: '5 hours ago', duration: '45s', author: 'alex-dev' },
  { id: 'w4', name: 'Lint & Test', status: 'Success', runNumber: '#122', branch: 'main', time: 'Yesterday', duration: '2m 10s', author: 'mike-doc' },
  { id: 'w5', name: 'CI Pipeline', status: 'Success', runNumber: '#121', branch: 'main', time: '2 days ago', duration: '1m 18s', author: 'alex-dev' },
];

const QuickEditor = ({ fileName, content, onSave, onCancel, onFullEditor }: { 
  fileName: string; 
  content: string; 
  onSave: (newContent: string) => void; 
  onCancel: () => void;
  onFullEditor: () => void;
}) => {
  const [editedContent, setEditedContent] = useState(content);
  const [isRefactoring, setIsRefactoring] = useState(false);

  const handleAISuggestion = async () => {
    setIsRefactoring(true);
    try {
      const suggestion = await forgeAIService.getCodeRefactorSuggestion(editedContent, fileName);
      if (suggestion && confirm("ForgeAI has found an optimization. Would you like to view the suggestion and apply it?")) {
        setEditedContent(editedContent + "\n\n// ForgeAI: Optimized memory allocation for buffer stream\n");
      }
    } finally {
      setIsRefactoring(false);
    }
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden flex flex-col h-[600px] animate-in fade-in zoom-in-95 duration-300 shadow-2xl">
      <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined !text-[18px] text-blue-400">description</span>
            <span className="text-[12px] font-bold text-slate-300">Editing: <span className="text-white">{fileName}</span></span>
          </div>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/20">Unsaved</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleAISuggestion}
            disabled={isRefactoring}
            className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-[11px] font-bold text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
          >
            <span className={`material-symbols-outlined !text-[14px] ${isRefactoring ? 'animate-spin' : 'filled'}`}>
              {isRefactoring ? 'progress_activity' : 'auto_awesome'}
            </span>
            {isRefactoring ? 'Analyzing...' : 'ForgeAI Assist'}
          </button>
          <button 
            onClick={onFullEditor}
            className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-[#30363d] rounded-md text-[11px] font-bold text-slate-300 hover:text-white transition-all"
          >
            <span className="material-symbols-outlined !text-[14px]">open_in_new</span>
            Full Editor
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex font-mono text-[13px] bg-[#0d1117] overflow-hidden">
        <div className="w-12 bg-[#090d13] border-r border-[#30363d] flex flex-col items-center pt-4 text-slate-700 select-none">
          {Array.from({ length: 30 }).map((_, i) => <span key={i} className="h-6 leading-6">{i + 1}</span>)}
        </div>
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="flex-1 bg-transparent border-none focus:ring-0 p-4 text-slate-300 resize-none custom-scrollbar outline-none font-mono leading-6"
          spellCheck={false}
          autoFocus
        />
      </div>

      <div className="p-4 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between">
        <p className="text-[10px] text-slate-500 italic flex items-center gap-2">
          <span className="material-symbols-outlined !text-[14px] text-primary">security</span>
          ForgeAI is monitoring for security vulnerabilities in real-time...
        </p>
        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 text-[11px] font-bold text-slate-400 hover:text-white transition-all"
          >
            Discard
          </button>
          <button 
            onClick={() => onSave(editedContent)}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-emerald-500/20"
          >
            Commit Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const RepoDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const repo = MOCK_REPOS.find(r => r.id === id) || MOCK_REPOS[0];

  const [activeTab, setActiveTab] = useState('Code');
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [isCommitting, setIsCommitting] = useState(false);

  const startQuickEdit = (fileName: string) => {
    const mockContent = fileName === 'package.json' 
      ? `{\n  "name": "trackcodex-api",\n  "version": "2.4.0",\n  "main": "index.js",\n  "dependencies": {\n    "express": "^4.18.2",\n    "google-cloud": "^1.0.0"\n  }\n}`
      : `import { auth } from './middleware';\n\nexport const handler = async (req, res) => {\n  const user = await auth.validate(req);\n  return res.json({\n    success: true,\n    user: user,\n    timestamp: new Date().toISOString()\n  });\n};`;
    
    setFileContent(mockContent);
    setEditingFile(fileName);
    setActiveTab('Code');
  };

  const handleCommit = (newContent: string) => {
    setIsCommitting(true);
    setTimeout(() => {
      setEditingFile(null);
      setIsCommitting(false);
      alert(`Changes to ${editingFile} committed successfully!`);
    }, 1200);
  };

  const tabs = ['Code', 'Commits', 'Issues', 'Pull Requests', 'Actions', 'Insights', 'Settings'];

  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <span className="material-symbols-outlined text-emerald-500 !text-xl filled">check_circle</span>;
      case 'Failed': return <span className="material-symbols-outlined text-rose-500 !text-xl filled">cancel</span>;
      case 'Running': return <span className="material-symbols-outlined text-blue-500 !text-xl animate-spin">progress_activity</span>;
      default: return <span className="material-symbols-outlined text-slate-500 !text-xl">circle</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500 !text-2xl">book</span>
            <div className="flex items-center gap-2">
              <span className="text-xl text-[#58a6ff] hover:underline cursor-pointer font-medium" onClick={() => navigate('/repositories')}>track-codex</span>
              <span className="text-xl text-slate-400">/</span>
              <span className="text-xl text-white font-bold">{repo.name}</span>
              <span className="px-2 py-0.5 rounded-full border border-[#30363d] text-[10px] text-slate-500 font-bold uppercase tracking-wider">{repo.visibility}</span>
              
              <button 
                onClick={() => setActiveTab('Pull Requests')}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-white/5 text-[11px] font-bold text-slate-400 hover:text-[#58a6ff] transition-all ml-2 group"
              >
                <span className="material-symbols-outlined !text-[16px] group-hover:scale-110 transition-transform">fork_right</span>
                <span>8 Pull Requests</span>
              </button>

              <button 
                onClick={() => navigate('/workspace/new')}
                className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 border border-primary/20"
              >
                <span className="material-symbols-outlined !text-[16px]">terminal</span>
                Open in Workspace
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">visibility</span>
               Watch <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">12</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">star</span>
               Star <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">{repo.stars}</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold hover:bg-[#21262d] transition-colors">
               <span className="material-symbols-outlined !text-[18px]">fork_right</span>
               Fork <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-slate-400">{repo.forks}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
           {tabs.map((tab) => (
             <div 
               key={tab} 
               onClick={() => { setActiveTab(tab); setEditingFile(null); }}
               className={`flex items-center gap-2 px-3 py-3 text-[13px] border-b-2 transition-colors cursor-pointer shrink-0 ${activeTab === tab ? 'text-white border-[#f78166] font-bold' : 'text-slate-400 border-transparent hover:text-white'}`}
             >
                <span className="material-symbols-outlined !text-[18px]">{
                  tab === 'Code' ? 'code' : 
                  tab === 'Commits' ? 'history' :
                  tab === 'Issues' ? 'error' : 
                  tab === 'Pull Requests' ? 'fork_right' : 
                  tab === 'Actions' ? 'play_circle' : 
                  tab === 'Insights' ? 'insights' : 'settings'
                }</span>
                {tab}
                {(tab === 'Issues' || tab === 'Pull Requests') && <span className="bg-[#2d333b] px-1.5 rounded-full ml-1 text-[11px] font-bold">{tab === 'Issues' ? '24' : '8'}</span>}
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
           <div className="space-y-6 min-w-0">
              {activeTab === 'Code' && (
                <>
                  {/* File Explorer Table */}
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                    <div className="p-4 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src="https://picsum.photos/seed/alex/32" className="size-6 rounded-full border border-[#30363d]" alt="Alex" />
                          <p className="text-[13px] text-slate-300"><span className="font-bold text-white hover:underline cursor-pointer">alex-dev</span> feat: update dependency versions and fix t...</p>
                        </div>
                        <div className="flex items-center gap-4 text-[12px] text-slate-500">
                          <span className="font-mono text-[10px] bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">9a8b7c6</span>
                          <span>3 hours ago</span>
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-[#30363d]">
                          {[
                            { name: 'src', commit: 'refactor: optimize database queries', time: '2 days ago', type: 'folder' },
                            { name: 'public', commit: 'chore: add new favicon assets', time: '1 week ago', type: 'folder' },
                            { name: 'tests', commit: 'test: add integration tests for login', time: '3 hours ago', type: 'folder' },
                            { name: '.gitignore', commit: 'chore: ignore dist folder', time: '2 months ago', type: 'file' },
                            { name: 'package.json', commit: 'feat: update dependency versions', time: '3 hours ago', type: 'file' },
                            { name: 'README.md', commit: 'docs: update installation instructions', time: '5 days ago', type: 'file' }
                          ].map(file => (
                            <tr key={file.name} className={`hover:bg-white/[0.02] cursor-pointer group transition-colors ${editingFile === file.name ? 'bg-primary/5' : ''}`}>
                                <td className="px-4 py-3 flex items-center justify-between" onClick={() => file.type === 'file' ? startQuickEdit(file.name) : null}>
                                  <div className="flex items-center gap-3">
                                      <span className={`material-symbols-outlined !text-[20px] ${file.type === 'folder' ? 'text-blue-400' : 'text-slate-500'}`}>
                                        {file.type === 'folder' ? 'folder' : 'description'}
                                      </span>
                                      <span className="text-[13px] text-slate-200 group-hover:text-primary transition-colors">{file.name}</span>
                                  </div>
                                  {file.type === 'file' && (
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); startQuickEdit(file.name); }}
                                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-md transition-all text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white"
                                    >
                                        <span className="material-symbols-outlined !text-[14px]">edit</span>
                                        Edit
                                    </button>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-[13px] text-slate-500 truncate max-w-[240px] font-medium">{file.commit}</td>
                                <td className="px-4 py-3 text-[13px] text-slate-500 text-right">{file.time}</td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>

                  {editingFile ? (
                    <QuickEditor 
                      fileName={editingFile}
                      content={fileContent}
                      onSave={handleCommit}
                      onCancel={() => setEditingFile(null)}
                      onFullEditor={() => navigate('/editor')}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="bg-[#161b22] border border-primary/30 rounded-xl p-5 flex gap-5 relative overflow-hidden group shadow-lg">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-inner">
                            <span className="material-symbols-outlined !text-[24px] filled">auto_awesome</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                                  ForgeAI Repo Insights
                                  <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[9px] font-black tracking-widest uppercase border border-primary/30">Intelligence</span>
                              </h3>
                              <div className="flex items-center gap-4 text-[11px] font-bold">
                                  <div className="flex items-center gap-2 text-slate-400">
                                    Health: <span className="text-emerald-400 font-black">92/100</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-slate-400">
                                    Grade: <span className="text-primary font-black">A+</span>
                                  </div>
                              </div>
                            </div>
                            <p className="text-[13px] text-slate-300 leading-relaxed">
                              Recent activity focused on refactoring the <code className="bg-white/5 px-1 rounded text-primary">auth-middleware</code> and patching a potential SQL injection in the user service. Test coverage increased by <span className="text-emerald-400 font-bold">2.4%</span>.
                            </p>
                        </div>
                      </div>

                      <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-lg">
                        <div className="p-3 bg-[#0d1117] border-b border-[#30363d] flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined !text-[18px] text-slate-500">menu_book</span>
                              <span className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">README.md</span>
                            </div>
                            <button 
                              onClick={() => startQuickEdit('README.md')}
                              className="px-3 py-1 bg-slate-800 border border-[#30363d] rounded-md text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined !text-[14px]">edit_note</span>
                              Edit README
                            </button>
                        </div>
                        <div className="p-10 prose prose-invert max-w-none">
                            <h1 className="text-4xl font-black mb-6 border-b border-[#30363d] pb-4">TrackCodex Core API</h1>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                              The central backend service for the TrackCodex dashboard. Handles user authentication, repository indexing, and AI analysis queuing. Built with performance and security at its core.
                            </p>
                            <h2 className="text-xl font-bold mb-4 text-white">Getting Started</h2>
                            <pre className="bg-[#090d13] p-5 rounded-xl border border-[#30363d] text-[13px] text-slate-300 overflow-x-auto mb-8 shadow-inner">
{`# Clone the repository
git clone https://github.com/track-codex/core-api.git

# Install dependencies
npm install

# Run the development server
npm run dev`}
                            </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'Commits' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-[16px] font-bold text-white">Commit History</h3>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 bg-[#161b22] border border-[#30363d] rounded-md text-[12px] font-bold text-slate-300 hover:text-white transition-colors">
                        Branch: main
                      </button>
                    </div>
                  </div>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                    <div className="divide-y divide-[#30363d]">
                      {MOCK_COMMITS.map((commit) => (
                        <div key={commit.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                          <div className="flex items-center gap-4">
                            <img src={commit.avatar} alt={commit.author} className="size-9 rounded-full border border-[#30363d]" />
                            <div>
                              <p className="text-[14px] font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] cursor-pointer transition-colors leading-tight">
                                {commit.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 text-[12px] text-slate-500">
                                <span className="font-bold text-slate-300 hover:underline cursor-pointer">{commit.author}</span>
                                <span>committed {commit.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[11px] bg-[#21262d] px-2 py-1 rounded border border-[#30363d] text-slate-400 group-hover:text-primary transition-colors">
                              {commit.id}
                            </span>
                            <button className="size-8 flex items-center justify-center bg-[#21262d] border border-[#30363d] rounded hover:border-slate-500 transition-colors">
                              <span className="material-symbols-outlined !text-[18px] text-slate-500">code</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-2 bg-[#161b22] border border-[#30363d] rounded-xl text-xs font-bold text-slate-500 hover:text-white transition-colors">
                    Load older commits
                  </button>
                </div>
              )}

              {activeTab === 'Actions' && (
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
                  {/* Actions Sidebar */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-[12px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Workflows</h3>
                      <div className="space-y-1">
                        {['All workflows', 'CI Pipeline', 'Security Scan', 'Deployment to Staging', 'Lint & Test'].map((wf, idx) => (
                          <div 
                            key={wf} 
                            className={`px-3 py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${idx === 0 ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                          >
                            {wf}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Run History List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-[16px] font-bold text-white">All workflow runs</h3>
                      <button className="px-3 py-1 bg-[#21262d] border border-[#30363d] rounded text-[11px] font-bold text-slate-300 hover:text-white">
                        Filter runs
                      </button>
                    </div>
                    
                    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl">
                      <div className="divide-y divide-[#30363d]">
                        {MOCK_WORKFLOW_RUNS.map((run) => (
                          <div key={run.id} className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors group cursor-pointer">
                            <div className="shrink-0">
                              {getWorkflowStatusIcon(run.status)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-bold text-[#58a6ff] hover:underline truncate">
                                  {run.name} <span className="text-slate-500 font-normal">{run.runNumber}</span>
                                </span>
                                {run.status === 'Running' && (
                                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-widest border border-blue-500/20">Active</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <span className="material-symbols-outlined !text-[14px]">account_tree</span>
                                  {run.branch}
                                </span>
                                <span>•</span>
                                <span>triggered by <span className="text-slate-300 font-bold">{run.author}</span></span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[11px] text-slate-300 font-bold">{run.time}</p>
                              <p className="text-[10px] text-slate-500 mt-0.5">{run.duration}</p>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 size-8 flex items-center justify-center bg-[#21262d] border border-[#30363d] rounded text-slate-400 hover:text-white transition-all ml-2">
                              <span className="material-symbols-outlined !text-[18px]">more_horiz</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {['Issues', 'Pull Requests', 'Insights', 'Settings'].includes(activeTab) && (
                <div className="p-20 text-center bg-[#161b22] border border-dashed border-[#30363d] rounded-xl">
                  <span className="material-symbols-outlined text-4xl text-slate-600 mb-4">construction</span>
                  <h3 className="text-lg font-bold text-slate-400">{activeTab} section coming soon</h3>
                  <p className="text-sm text-slate-500 mt-2">We're hard at work building the next-generation developer experience.</p>
                </div>
              )}
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8 min-w-0">
              <div className="p-1">
                 <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-4">About</h3>
                 <p className="text-[13px] text-slate-400 leading-relaxed mb-4">
                    Core API service for the TrackCodex platform, integrating with Gitea for repository management and development workflows.
                 </p>
                 <div className="flex items-center gap-2 text-[#58a6ff] hover:underline cursor-pointer text-[13px] mb-4 group">
                    <span className="material-symbols-outlined !text-[16px] group-hover:scale-110 transition-transform">link</span>
                    <span>trackcodex.com/docs/api</span>
                 </div>
                 <div className="flex flex-wrap gap-1.5">
                    {['typescript', 'ai-analytics', 'go-backend', 'security'].map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] text-primary font-bold hover:bg-primary/20 cursor-pointer transition-all">
                        {tag}
                      </span>
                    ))}
                 </div>
              </div>

              <div className="pt-6 border-t border-[#30363d]">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest">ForgeAI Refactors</h3>
                    <span className="bg-[#2d333b] px-2 py-0.5 rounded-full text-[10px] text-slate-400 font-black">3</span>
                 </div>
                 <div className="space-y-3">
                    <div className="p-3 rounded-xl border border-orange-500/20 bg-orange-500/5 group cursor-pointer hover:bg-orange-500/10 transition-all">
                       <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase mb-1.5">
                          <span className="material-symbols-outlined !text-[16px]">warning</span>
                          Complexity Alert
                       </div>
                       <p className="text-[12px] text-slate-300 leading-snug">The `processData` function in `utils.ts` has a cyclomatic complexity of 24.</p>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-[#30363d]">
                 <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-4">Languages</h3>
                 <div className="w-full h-2.5 rounded-full overflow-hidden flex mb-4 bg-[#2d333b]">
                    <div className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '85%' }}></div>
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '15%' }}></div>
                 </div>
                 <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                       <div className="flex items-center gap-2.5">
                          <div className="size-2.5 rounded-full bg-blue-500"></div>
                          <span className="text-white font-bold">TypeScript</span>
                          <span className="text-slate-500">85.0%</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-6 border-t border-[#30363d]">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[12px] font-black text-white uppercase tracking-widest">Latest Release</h3>
                 </div>
                 <div className="flex items-start gap-3 bg-[#161b22] p-4 rounded-xl border border-[#30363d] shadow-sm">
                    <span className="material-symbols-outlined !text-[20px] text-emerald-500 filled">verified</span>
                    <div>
                       <p className="text-[13px] text-white font-black uppercase tracking-widest">v2.4.0</p>
                       <p className="text-[11px] text-slate-500 mt-1 font-medium">Latest Release • 2 days ago</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      {isCommitting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center animate-in fade-in duration-300">
          <div className="bg-[#161b22] border border-[#30363d] p-10 rounded-3xl flex flex-col items-center gap-6 shadow-2xl max-w-sm text-center">
            <div className="relative">
              <span className="material-symbols-outlined animate-spin text-primary text-5xl">progress_activity</span>
              <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-white text-xl">hub</span>
            </div>
            <div>
              <p className="text-white text-lg font-black uppercase tracking-widest mb-1">Pushing Changes</p>
              <p className="text-slate-500 text-sm font-medium">Securing commit and syncing with remote origin...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepoDetailView;
