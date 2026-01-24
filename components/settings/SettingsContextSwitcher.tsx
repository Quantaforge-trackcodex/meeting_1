
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profile';

interface SettingsContextSwitcherProps {
    currentContext: 'personal' | 'organization';
    orgName?: string;
    orgAvatar?: string;
    orgId?: string;
}

const SettingsContextSwitcher: React.FC<SettingsContextSwitcherProps> = ({
    currentContext,
    orgName,
    orgAvatar,
    orgId
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const profile = profileService.getProfile();

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePersonalClick = () => {
        navigate('/settings/profile');
        setIsOpen(false);
    };

    const handleOrgClick = (id: string) => {
        navigate(`/org/${id}/settings/general`);
        setIsOpen(false);
    };

    return (
        <div className="relative mb-6" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group text-left"
            >
                <div className="flex items-center gap-3">
                    {currentContext === 'personal' ? (
                        <img src={profile.avatar} className="size-8 rounded-full border border-gh-border" alt="Profile" />
                    ) : (
                        <img src={orgAvatar} className="size-8 rounded-md border border-gh-border p-0.5" alt="Org" />
                    )}
                    <div>
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {currentContext === 'personal' ? profile.username : orgName}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                            <span>{currentContext === 'personal' ? 'Personal' : 'Organization'}</span>
                            <span className="material-symbols-outlined !text-[12px]">sync_alt</span>
                            <span>Switch context</span>
                        </div>
                    </div>
                </div>
                <span className="material-symbols-outlined text-slate-500">arrow_drop_down</span>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 w-[300px] bg-[#161b22] border border-gh-border rounded-xl shadow-2xl z-50 overflow-hidden mt-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#0d1117] px-4 py-2 border-b border-gh-border">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Switch Settings Context</span>
                    </div>

                    <div className="p-2 space-y-1">
                        {/* Personal Option */}
                        <button
                            onClick={handlePersonalClick}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentContext === 'personal' ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                        >
                            <img src={profile.avatar} className="size-8 rounded-full border border-gh-border" />
                            <div className="text-left">
                                <div className={`text-sm font-bold ${currentContext === 'personal' ? 'text-primary' : 'text-white'}`}>{profile.username}</div>
                                <div className="text-xs text-slate-500">Personal account</div>
                            </div>
                            {currentContext === 'personal' && <span className="material-symbols-outlined text-primary ml-auto">check</span>}
                        </button>

                        <div className="h-px bg-gh-border my-1 mx-2"></div>

                        {/* Mock Organization Option (Assuming 'quantaforge' is the main one for this demo) */}
                        <button
                            onClick={() => handleOrgClick('quantaforge')}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${currentContext === 'organization' && orgId === 'quantaforge' ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                        >
                            <div className="size-8 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                                <span className="material-symbols-outlined !text-lg">hub</span>
                            </div>
                            <div className="text-left">
                                <div className={`text-sm font-bold ${currentContext === 'organization' && orgId === 'quantaforge' ? 'text-primary' : 'text-white'}`}>quantaforge</div>
                                <div className="text-xs text-slate-500">Organization</div>
                            </div>
                            {currentContext === 'organization' && orgId === 'quantaforge' && <span className="material-symbols-outlined text-primary ml-auto">check</span>}
                        </button>

                        <button
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors opacity-50 cursor-not-allowed"
                        >
                            <div className="size-8 rounded-md bg-white/5 flex items-center justify-center text-slate-500 border border-white/10">
                                <span className="material-symbols-outlined !text-lg">add</span>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-slate-400">Create Organization</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsContextSwitcher;
