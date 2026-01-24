
import React, { useState } from 'react';

interface FileNode {
    id: string;
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    language?: string;
    content?: string;
}

interface FileExplorerProps {
    fileSystem: FileNode[];
    onFileClick: (file: FileNode, isPreview?: boolean) => void;
    openFiles: any[];
    activeFileId: string;
    onCloseFile: (e: React.MouseEvent, id: string) => void;
    onAddFile?: (name: string, type: 'file' | 'folder') => void;
}

const getFileIcon = (name: string, type: 'file' | 'folder', isOpen: boolean) => {
    if (type === 'folder') return isOpen ? 'folder_open' : 'folder';
    if (name.endsWith('.tsx') || name.endsWith('.ts')) return 'typescript';
    if (name.endsWith('.css')) return 'css';
    if (name.endsWith('.html')) return 'html';
    if (name.endsWith('.json')) return 'data_object';
    if (name.endsWith('.md')) return 'info';
    if (name.endsWith('.cpp')) return 'code';
    if (name.endsWith('.go')) return 'terminal';
    return 'description';
};

const getFileIconColor = (name: string) => {
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'text-[#2b7489]'; // TypeScript Blue
    if (name.endsWith('.css')) return 'text-[#563d7c]';
    if (name.endsWith('.html')) return 'text-[#e34c26]';
    if (name.endsWith('.json')) return 'text-[#f1e05a]';
    if (name.endsWith('.md')) return 'text-[#519aba]';
    if (name.endsWith('.cpp')) return 'text-[#519aba]'; // C++ Blue
    if (name.endsWith('.go')) return 'text-[#00add8]';
    return 'text-[#969696]';
};

const TreeNode: React.FC<{ node: FileNode, level: number, onFileClick: (f: FileNode) => void }> = ({ node, level, onFileClick }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handleClick = () => {
        if (node.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onFileClick(node);
        }
    };

    const icon = getFileIcon(node.name, node.type, isOpen);
    const colorClass = node.type === 'folder' ? (isOpen ? 'text-[#cccccc]' : 'text-[#cccccc]') : getFileIconColor(node.name);

    return (
        <div>
            <div
                onClick={handleClick}
                className="flex items-center gap-1.5 py-[3px] hover:bg-[#2a2d2e] cursor-pointer text-[13px] select-none text-[#cccccc] transition-colors border-l border-transparent hover:border-[#30363d]"
                style={{ paddingLeft: `${level * 12 + 10}px` }}
            >
                <span className="w-[10px] inline-flex justify-center">
                    {node.type === 'folder' && (
                        <span className={`material-symbols-outlined !text-[16px] transition-transform duration-100 text-[#cccccc] ${isOpen ? 'rotate-90' : ''}`}>chevron_right</span>
                    )}
                </span>

                {/* File/Folder Icon */}
                {node.type === 'folder' ? (
                    // Using amber for folder just like reference image seems to suggest, albeit subtle
                    <span className="material-symbols-outlined !text-[18px] text-[#dcb67a] mr-1">folder</span>
                ) : (
                    <span className={`material-symbols-outlined !text-[16px] ${colorClass} mr-1`}>{icon === 'typescript' ? 'code' : icon}</span>
                )}

                <span className={`${node.type === 'folder' ? 'font-bold text-[#e8e8e8]' : 'text-[#cccccc]'}`}>{node.name}</span>
            </div>
            {node.type === 'folder' && isOpen && node.children?.map(child => (
                <TreeNode key={child.id} node={child} level={level + 1} onFileClick={onFileClick} />
            ))}
        </div>
    );
}

const ExplorerSection = ({ title, children, defaultOpen = false, actions }: { title: string, children: React.ReactNode, defaultOpen?: boolean, actions?: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="flex flex-col">
            <div
                className="flex items-center justify-between px-1 py-0.5 cursor-pointer hover:bg-[#2a2d2e] text-[#cccccc] font-bold text-[11px] uppercase tracking-wide select-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center">
                    <span className={`material-symbols-outlined !text-[16px] transition-transform duration-100 mr-0.5 ${isOpen ? 'rotate-90' : ''}`}>chevron_right</span>
                    {title}
                </div>
                {actions && <div className="invisible group-hover:visible flex items-center gap-1 pr-1" onClick={(e) => e.stopPropagation()}>{actions}</div>}
            </div>
            {isOpen && <div className="flex flex-col">{children}</div>}
        </div>
    );
};

// ... existing code ...

const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem, onFileClick, openFiles, activeFileId, onCloseFile, onAddFile }) => {

    const handleCreate = (type: 'file' | 'folder') => {
        if (!onAddFile) return;
        const name = prompt(`Enter ${type} name:`);
        if (name) onAddFile(name, type);
    };

    return (
        <div className="w-full h-full bg-[#252526] text-[#cccccc] font-sans flex flex-col pt-1">
            <div className="px-4 py-2 text-[11px] text-[#bbbbbb] flex items-center justify-between font-bold">
                <span className="tracking-wide">EXPLORER</span>
                <span className="material-symbols-outlined !text-[16px] cursor-pointer hover:text-white">more_horiz</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* OPEN EDITORS Section */}
                <ExplorerSection title="OPEN EDITORS" defaultOpen={true}>
                    {openFiles.map(file => (
                        <div
                            key={file.id}
                            onClick={() => onFileClick(file)}
                            className={`group flex items-center justify-between py-[3px] pl-5 pr-3 cursor-pointer text-[13px] select-none hover:bg-[#2a2d2e] ${activeFileId === file.id ? 'bg-[#37373d] text-white' : 'text-[#969696]'}`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className={`material-symbols-outlined !text-[14px] cursor-pointer hover:bg-[#454545] rounded-sm p-0.5 ${activeFileId === file.id ? 'visible' : 'invisible group-hover:visible'}`} onClick={(e) => onCloseFile(e, file.id)}>close</span>
                                <div className="flex items-center gap-1.5 truncate">
                                    <span className={`material-symbols-outlined !text-[16px] ${getFileIconColor(file.name)}`}>
                                        {getFileIcon(file.name, 'file', false) === 'typescript' ? 'code' : getFileIcon(file.name, 'file', false)}
                                    </span>
                                    <span className={`${activeFileId === file.id ? 'text-white' : 'text-[#969696]'} font-${activeFileId === file.id ? 'medium' : 'normal'}`}>{file.name}</span>
                                </div>
                            </div>
                            {/* Unsaved indicator mock */}
                            <div className={`size-2 rounded-full bg-white transition-opacity ${activeFileId === file.id ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                    ))}
                </ExplorerSection>

                {/* PROJECT FOLDER Section */}
                <ExplorerSection
                    title="MEETING_1"
                    defaultOpen={true}
                    actions={
                        <>
                            <span onClick={() => handleCreate('file')} className="material-symbols-outlined !text-[16px] hover:text-white" title="New File">note_add</span>
                            <span onClick={() => handleCreate('folder')} className="material-symbols-outlined !text-[16px] hover:text-white" title="New Folder">create_new_folder</span>
                        </>
                    }
                >
                    {fileSystem.map(node => (
                        <TreeNode key={node.id} node={node} level={0} onFileClick={onFileClick} />
                    ))}
                </ExplorerSection>

                {/* DUMMY Sections */}
                <ExplorerSection title="OUTLINE" defaultOpen={false}>
                    <div className="p-4 text-xs italic opacity-50">No symbols found</div>
                </ExplorerSection>

                <ExplorerSection title="TIMELINE" defaultOpen={false}>
                    <div className="p-4 text-xs italic opacity-50">No timeline data</div>
                </ExplorerSection>

                <ExplorerSection title="NPM SCRIPTS" defaultOpen={false}>
                    <div className="pl-4 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-xs group">
                        <span className="material-symbols-outlined !text-[14px] invisible group-hover:visible">play_arrow</span>
                        <span className="material-symbols-outlined !text-[14px] group-hover:hidden">terminal</span>
                        <span>dev</span>
                    </div>
                    <div className="pl-4 py-1 flex items-center gap-2 hover:bg-[#2a2d2e] cursor-pointer text-xs group">
                        <span className="material-symbols-outlined !text-[14px] invisible group-hover:visible">play_arrow</span>
                        <span className="material-symbols-outlined !text-[14px] group-hover:hidden">terminal</span>
                        <span>build</span>
                    </div>
                </ExplorerSection>
            </div>
        </div>
    );
};

export default FileExplorer;
