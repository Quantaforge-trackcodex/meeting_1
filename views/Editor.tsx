import React, { useState, useCallback, useMemo } from 'react';
import { Editor } from '@monaco-editor/react';
import { 
  PanelGroup, 
  Panel, 
  PanelResizeHandle 
} from 'react-resizable-panels';

// --- MOCK DATA ---

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path: string;
}

const FILE_STRUCTURE: FileNode[] = [
  {
    name: 'src', type: 'folder', path: 'src', children: [
      {
        name: 'components', type: 'folder', path: 'src/components', children: [
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx' },
          { name: 'Card.tsx', type: 'file', path: 'src/components/Card.tsx' },
        ],
      },
      { name: 'styles', type: 'folder', path: 'src/styles', children: [
          { name: 'globals.css', type: 'file', path: 'src/styles/globals.css' },
        ],
      },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
];

const FILE_CONTENTS: Record<string, string> = {
  'Button.tsx': `import React from 'react';\n\nconst Button = () => <button>Click me</button>;\n\nexport default Button;`,
  'Card.tsx': `import React from 'react';\n\nconst Card = ({ children }) => <div>{children}</div>;\n\nexport default Card;`,
  'globals.css': `body {\n  margin: 0;\n  font-family: sans-serif;\n}`,
  'App.tsx': `import React from 'react';\nimport Button from './components/Button';\n\nconst App = () => (\n  <div>\n    <h1>Welcome to TrackCodex</h1>\n    <Button />\n  </div>\n);\n\nexport default App;`,
  'package.json': JSON.stringify({ name: 'trackcodex-app', version: '1.0.0' }, null, 2),
};

// --- SUBCOMPONENTS ---

const ActivityBarItem = ({ icon, label, active = false }: { icon: string; label: string; active?: boolean }) => (
  <button title={label} className="w-full h-12 flex items-center justify-center relative">
    {active && <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-white rounded-r-full"></div>}
    <span className={`material-symbols-outlined !text-2xl ${active ? 'text-white' : 'text-slate-500 hover:text-white'}`}>
      {icon}
    </span>
  </button>
);

const FileEntry = ({ node, depth = 0, onSelect, activeFile, expandedFolders, onToggleFolder }: any) => {
  const isFolder = node.type === 'folder';
  const isActive = activeFile === node.path;
  const isExpanded = expandedFolders.has(node.path);

  const handleSelect = () => {
    if (isFolder) {
      onToggleFolder(node.path);
    } else {
      onSelect(node.path, node.name);
    }
  };

  return (
    <div>
      <div
        onClick={handleSelect}
        style={{ paddingLeft: `${depth * 12 + 12}px` }}
        className={`flex items-center gap-1.5 h-6 cursor-pointer text-slate-400 hover:bg-white/5 hover:text-white text-sm ${isActive ? 'bg-white/10 text-white' : ''}`}
      >
        {isFolder ? (
          <span className={`material-symbols-outlined !text-base transition-transform ${isExpanded ? '' : '-rotate-90'}`}>expand_more</span>
        ) : <div className="w-4"></div>}
        <span className="material-symbols-outlined !text-base text-slate-500">{isFolder ? (isExpanded ? 'folder_open' : 'folder') : 'description'}</span>
        <span>{node.name}</span>
      </div>
      {isFolder && isExpanded && node.children?.map((child: FileNode) => (
        <FileEntry 
          key={child.path} 
          node={child} 
          depth={depth + 1} 
          onSelect={onSelect}
          activeFile={activeFile}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
        />
      ))}
    </div>
  );
};

const EditorView = () => {
  const [openFiles, setOpenFiles] = useState<string[]>(['src/App.tsx']);
  const [activeFile, setActiveFile] = useState<string>('src/App.tsx');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components', 'src/styles']));
  const [line, setLine] = useState(1);
  const [col, setCol] = useState(1);

  const handleFileSelect = useCallback((path: string) => {
    if (!openFiles.includes(path)) {
      setOpenFiles(prev => [...prev, path]);
    }
    setActiveFile(path);
  }, [openFiles]);

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(f => f !== path);
    setOpenFiles(newOpenFiles);
    if (activeFile === path) {
      setActiveFile(newOpenFiles[0] || '');
    }
  };

  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  const language = useMemo(() => {
    const ext = activeFile.split('.').pop();
    switch (ext) {
      case 'tsx': return 'typescript';
      case 'css': return 'css';
      case 'json': return 'json';
      default: return 'plaintext';
    }
  }, [activeFile]);
  
  const renderTree = (nodes: FileNode[]) => {
    return nodes.map(node => (
      <FileEntry 
        key={node.path} 
        node={node} 
        onSelect={handleFileSelect}
        activeFile={activeFile}
        expandedFolders={expandedFolders}
        onToggleFolder={toggleFolder}
      />
    ));
  };

  return (
    <div className="flex h-full font-display bg-[#1e1e1e]">
      {/* Activity Bar */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-2 shrink-0 z-20">
        <ActivityBarItem icon="description" label="Explorer" active />
        <ActivityBarItem icon="search" label="Search" />
        <ActivityBarItem icon="hub" label="Source Control" />
        <ActivityBarItem icon="play_circle" label="Run and Debug" />
        <ActivityBarItem icon="extension" label="Extensions" />
        <div className="mt-auto">
          <ActivityBarItem icon="account_circle" label="Account" />
          <ActivityBarItem icon="settings" label="Settings" />
        </div>
      </div>

      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15}>
          {/* File Explorer Panel */}
          <div className="h-full bg-vscode-sidebar flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-4 py-2">Explorer</h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              {renderTree(FILE_STRUCTURE)}
            </div>
          </div>
        </Panel>
        <PanelResizeHandle className="w-1 bg-vscode-activity-bar hover:bg-primary transition-colors" />
        <Panel>
          <div className="flex flex-col h-full bg-vscode-editor">
            {/* Tabs Bar */}
            <div className="flex bg-[#252526] shrink-0 overflow-x-auto no-scrollbar">
              {openFiles.map(path => (
                <div 
                  key={path} 
                  onClick={() => setActiveFile(path)}
                  className={`flex items-center gap-2 px-3 h-9 text-sm cursor-pointer border-r border-[#1e1e1e] ${activeFile === path ? 'bg-vscode-editor text-white' : 'text-slate-400 hover:bg-[#333333]'}`}
                >
                  <span className="material-symbols-outlined !text-base text-blue-400">javascript</span>
                  <span>{path.split('/').pop()}</span>
                  <button onClick={(e) => handleCloseTab(e, path)} className="ml-2 p-0.5 rounded hover:bg-white/10 text-slate-500 hover:text-white">
                    <span className="material-symbols-outlined !text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden">
              <Editor
                height="100%"
                path={activeFile}
                defaultValue={FILE_CONTENTS[activeFile] || ''}
                value={FILE_CONTENTS[activeFile] || ''}
                language={language}
                theme="vs-dark"
                options={{ 
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, monospace',
                  scrollBeyondLastLine: false,
                }}
                onMount={(editor) => {
                  editor.onDidChangeCursorPosition(e => {
                     setLine(e.position.lineNumber);
                     setCol(e.position.column);
                  });
                }}
              />
            </div>
          </div>
        </Panel>
      </PanelGroup>

      {/* Status Bar */}
      <footer className="h-6 bg-[#007acc] text-white flex items-center justify-between px-3 text-[11px] font-medium shrink-0 z-50">
        <div className="flex items-center gap-4 h-full">
          <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer">
            <span className="material-symbols-outlined !text-[14px]">account_tree</span>
            <span className="font-bold">main</span>
          </div>
        </div>
        <div className="flex items-center gap-4 h-full">
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">
            Ln {line}, Col {col}
          </div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">Spaces: 2</div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer">UTF-8</div>
          <div className="hover:bg-white/10 px-2 h-full flex items-center cursor-pointer uppercase">{language}</div>
        </div>
      </footer>
    </div>
  );
};

export default EditorView;
