
import React, { useState } from 'react';

const TerminalPanel = ({ logs = [], onClose, onMaximize }: { logs?: string[]; onClose?: () => void; onMaximize?: () => void }) => {
    const [activeTab, setActiveTab] = useState('terminal');

    const tabs = [
        { id: 'problems', label: 'PROBLEMS' },
        { id: 'output', label: 'OUTPUT' },
        { id: 'debug', label: 'DEBUG CONSOLE' },
        { id: 'terminal', label: 'TERMINAL' },
        { id: 'ports', label: 'PORTS' },
    ];

    // Auto-scroll logic could be added here

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e] border-t border-[#30363d] font-mono text-sm group">
            <div className="flex items-center justify-between px-4 border-b border-[#30363d] h-[30px] shrink-0 bg-[#1e1e1e]">
                <div className="flex items-center h-full">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`mr-4 h-full text-[11px] font-bold transition-colors border-b-[1px] ${activeTab === tab.id ? 'text-white border-[#e7e7e7]' : 'text-[#969696] border-transparent hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onMaximize} className="text-[#cccccc] hover:text-white p-0.5 rounded hover:bg-[#333333]" title="Toggle Maximize">
                        <span className="material-symbols-outlined !text-[16px]">keyboard_arrow_up</span>
                    </button>
                    <button onClick={onClose} className="text-[#cccccc] hover:text-white p-0.5 rounded hover:bg-[#333333]" title="Close Panel">
                        <span className="material-symbols-outlined !text-[16px]">close</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar bg-[#1e1e1e] text-white font-mono text-[13px]">
                {activeTab === 'terminal' && (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[#87d7b0] font-bold">user@trackcodex</span>
                            <span className="text-[#d787d7]">MINGW64</span>
                            <span className="text-[#d7d787]">~/projects/track-api-prod</span>
                            <span className="text-[#569cd6]">(main)</span>
                        </div>

                        {/* Dynamic Logs */}
                        {logs.length > 0 ? (
                            logs.map((log, index) => (
                                <div key={index} className="whitespace-pre-wrap mb-2 text-[#cccccc]">
                                    {log}
                                </div>
                            ))
                        ) : (
                            <div className="text-[#6a9955] opacity-50">Ready.</div>
                        )}

                        <div className="flex items-center gap-1 mt-2">
                            <span className="text-[#87d7b0]">$</span>
                            <div className="w-2.5 h-4 bg-[#cccccc] animate-pulse"></div>
                        </div>
                    </div>
                )}
                {activeTab === 'problems' && (
                    <div className="text-[#cccccc] text-xs">No problems have been detected in the workspace.</div>
                )}
                {activeTab === 'output' && (
                    <div className="text-[#cccccc] text-xs">
                        [Info] - Extension 'Python' activated.<br />
                        [Info] - Extension 'ESLint' activated.<br />
                        [Info] - Language server ready.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TerminalPanel;
