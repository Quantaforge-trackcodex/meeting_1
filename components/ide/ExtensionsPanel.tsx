
import React, { useState, useEffect } from 'react';

interface Extension {
    namespace: string;
    name: string;
    version: string;
    displayName?: string;
    description: string;
    downloadCount: number;
    files: {
        icon: string;
    };
}

const ExtensionsPanel = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [loading, setLoading] = useState(false);
    const [installed, setInstalled] = useState<Record<string, boolean>>({});
    const [installing, setInstalling] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchExtensions(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchExtensions = async (query: string) => {
        setLoading(true);
        try {
            // Default query if empty to show popular items
            const q = query.trim() === '' ? 'python' : query;
            const response = await fetch(`https://open-vsx.org/api/-/search?query=${q}&limit=20`);
            const data = await response.json();
            setExtensions(data.extensions || []);
        } catch (error) {
            console.error('Failed to fetch extensions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInstall = (id: string) => {
        setInstalling(id);
        setTimeout(() => {
            setInstalled(prev => ({ ...prev, [id]: true }));
            setInstalling(null);
        }, 1500);
    };

    const formatDownloads = (count: number) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <div className="w-full h-full flex flex-col bg-[#252526] text-[#cccccc] font-sans">
            <div className="px-5 py-2 text-[11px] text-[#bbbbbb] flex items-center justify-between font-bold">
                <span className="tracking-wide uppercase">EXTENSIONS</span>
                <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white">filter_list</span>
            </div>

            <div className="px-3 pb-2 border-b border-[#30363d]">
                <div className="relative">
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Extensions in OpenVSX"
                        className="w-full bg-[#3c3c3c] border border-[#3c3c3c] focus:border-[#007fd4] text-white text-[13px] px-2 py-1 outline-none placeholder-[#969696]"
                    />
                    {loading && (
                        <div className="absolute right-2 top-1.5 w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {extensions.map((ext, index) => {
                    const id = `${ext.namespace}.${ext.name}`;
                    const displayName = ext.displayName || ext.name;
                    return (
                        <div key={index} className="flex gap-3 p-3 hover:bg-[#2a2d2e] cursor-pointer group border-b border-[#30363d]/30">
                            <img
                                src={ext.files.icon || 'https://open-vsx.org/favicon.ico'}
                                className="size-10 object-contain shrink-0 bg-[#333] rounded-sm"
                                alt={displayName}
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://open-vsx.org/favicon.ico'; }}
                            />
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-[13px] font-bold text-[#e8e8e8] truncate pr-1">
                                        <span dangerouslySetInnerHTML={{
                                            __html: displayName.replace(new RegExp(searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), (match) => `<span class="bg-[#5f4b0e] text-orange-200">${match}</span>`)
                                        }} />
                                    </h4>
                                </div>
                                <p className="text-[12px] text-[#cccccc] line-clamp-2 my-0.5 leading-snug">{ext.description || 'No description provided.'}</p>
                                <div className="flex items-center gap-3 text-[11px] text-[#969696] mt-1">
                                    <span>{ext.namespace}</span>
                                    <span className="flex items-center gap-0.5"><span className="material-symbols-outlined !text-[12px]">download</span> {formatDownloads(ext.downloadCount)}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {installed[id] ? (
                                        <button className="px-2 py-1 bg-[#3c3c3c] text-white text-[11px] opacity-70 cursor-default rounded-sm w-[70px]">Installed</button>
                                    ) : (
                                        <button
                                            onClick={() => handleInstall(id)}
                                            className="px-2 py-1 bg-[#007fd4] hover:bg-[#006ab1] text-white text-[11px] transition-colors rounded-sm w-[70px]"
                                        >
                                            {installing === id ? 'Installing...' : 'Install'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {!loading && extensions.length === 0 && (
                    <div className="p-4 text-center text-xs text-[#969696]">No extensions found.</div>
                )}
            </div>
        </div>
    );
};

export default ExtensionsPanel;
