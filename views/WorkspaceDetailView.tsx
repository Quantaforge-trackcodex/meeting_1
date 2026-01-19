import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKSPACES } from '../constants';
import { Workspace } from '../types';
import Spinner from '../components/ui/Spinner';
import { Editor } from '@monaco-editor/react';

const WorkspaceTab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={`h-full flex items-center px-4 text-sm font-medium cursor-pointer transition-colors ${active ? 'bg-[#161b22] text-white' : 'text-slate-500 hover:text-slate-300'}`}
    >
        {label}
    </div>
);

const WorkspaceDetailView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('TrackCodex');

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetching data
        setTimeout(() => {
            const found = MOCK_WORKSPACES.find(ws => ws.id === id);
            setWorkspace(found || MOCK_WORKSPACES[0]);
            setIsLoading(false);
        }, 500);
    }, [id]);

    if (isLoading || !workspace) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-[#1e1e1e] font-display">
            {/* Top Bar matching screenshot */}
            <header className="h-10 flex-shrink-0 flex items-center justify-between px-2 bg-[#0d1117] border-b border-[#30363d]">
                <div className="flex items-center h-full">
                    {/* Mock tabs */}
                    <WorkspaceTab label="README.md" active={activeTab === 'README.md'} onClick={() => setActiveTab('README.md')} />
                    <WorkspaceTab label="TrackCodex" active={activeTab === 'TrackCodex'} onClick={() => setActiveTab('TrackCodex')} />
                </div>

                <div className="flex items-center gap-4 pr-2">
                    <span className="text-xs text-slate-500">2d ago</span>
                    <button className="text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined !text-xl">sync</span></button>
                    <button className="text-slate-400 hover:text-white transition-colors"><span className="material-symbols-outlined !text-xl">more_horiz</span></button>
                </div>
            </header>

            {/* Main Content Area (The "Black Screen") */}
            <main className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    theme="vs-dark"
                    options={{ 
                      minimap: { enabled: false }, 
                      fontSize: 14, 
                      fontFamily: 'JetBrains Mono, monospace', 
                      scrollBeyondLastLine: false,
                      overviewRulerLanes: 0,
                      scrollbar: {
                        vertical: 'hidden',
                      }
                    }}
                />
            </main>
        </div>
    );
};

export default WorkspaceDetailView;
