
import React, { useState, useEffect } from 'react';
import { githubService } from '../../services/github';

// Reusable Section Component (matching ProfileSettings)
const SettingsSection = ({ title, description, children }: { title: string, description: string, children: React.ReactNode }) => (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gh-border first:pt-0 first:border-0">
        <div className="md:col-span-1">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-sm text-gh-text-secondary mt-1">{description}</p>
        </div>
        <div className="md:col-span-2 bg-gh-bg-secondary border border-gh-border rounded-xl p-6 space-y-6 shadow-sm">
            {children}
        </div>
    </section>
);

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: string; // Material symbol or image URL
    connected: boolean;
    color: string;
    isCustomIcon?: boolean;
}

const IntegrationCard = ({ integration, onToggle }: { integration: Integration, onToggle: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-lg hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-4">
            <div className={`size-12 rounded-lg bg-[#0d1117] border border-[#30363d] flex items-center justify-center ${integration.color}`}>
                <span className="material-symbols-outlined text-2xl">{integration.icon}</span>
            </div>
            <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {integration.name}
                    {integration.connected && <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wide">Connected</span>}
                </h4>
                <p className="text-xs text-gh-text-secondary mt-0.5">{integration.description}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${integration.connected
                ? 'bg-transparent border-[#30363d] text-gh-text-secondary hover:text-white hover:border-red-500/50 hover:bg-red-500/10'
                : 'bg-primary border-transparent text-white hover:bg-blue-600 shadow-lg shadow-primary/20'
                }`}
        >
            {integration.connected ? 'Disconnect' : 'Connect'}
        </button>
    </div>
);

const IntegrationsSettings = () => {
    // Initial State with Mock Data
    const [integrations, setIntegrations] = useState<Integration[]>([
        { id: 'github', name: 'GitHub', description: 'Sync repositories, issues, and pull requests.', icon: 'code', connected: false, color: 'text-white' },
        { id: 'gitlab', name: 'GitLab', description: 'Connect your GitLab projects and CI/CD pipelines.', icon: 'code_blocks', connected: false, color: 'text-orange-500' },
        { id: 'forgebrowser', name: 'ForgeBrowser', description: 'Enable deep context search across web resources.', icon: 'travel_explore', connected: true, color: 'text-cyan-400' },
        { id: 'quantalab', name: 'QuantaLab', description: 'Unified lab environment for AI experiments.', icon: 'science', connected: false, color: 'text-purple-400' },
        { id: 'quantacode', name: 'QuantaCode', description: 'Advanced code analysis and refactoring engine.', icon: 'code_off', connected: true, color: 'text-emerald-400' }
    ]);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('trackcodex_integrations');
        if (saved) {
            setIntegrations(JSON.parse(saved));
        }
    }, []);

    const toggleConnection = (id: string) => {
        const updated = integrations.map(int =>
            int.id === id ? { ...int, connected: !int.connected } : int
        );
        setIntegrations(updated);
        localStorage.setItem('trackcodex_integrations', JSON.stringify(updated));

        // Show notification
        const integration = updated.find(i => i.id === id);
        if (integration) {
            window.dispatchEvent(new CustomEvent('trackcodex-notification', {
                detail: {
                    title: integration.connected ? 'Integration Connected' : 'Integration Disconnected',
                    message: `${integration.name} has been ${integration.connected ? 'successfully connected' : 'disconnected'}.`,
                    type: integration.connected ? 'success' : 'info'
                }
            }));
        }
    };

    // ... existing imports


    // ... inside component
    const [showTokenModal, setShowTokenModal] = useState(false);
    const [tokenInput, setTokenInput] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnectClick = (integration: Integration) => {
        if (integration.connected) {
            // Disconnect immediately
            toggleConnection(integration.id);
            if (integration.id === 'github') localStorage.removeItem('trackcodex_github_token');
        } else {
            if (integration.id === 'github') {
                setShowTokenModal(true);
            } else {
                toggleConnection(integration.id);
            }
        }
    };

    const submitToken = async () => {
        setError(null);
        setIsVerifying(true);
        try {
            await githubService.verifyToken(tokenInput);
            localStorage.setItem('trackcodex_github_token', tokenInput);
            toggleConnection('github');
            setShowTokenModal(false);
            setTokenInput('');

            window.dispatchEvent(new CustomEvent('trackcodex-notification', {
                detail: { title: 'GitHub Verified', message: 'Token valid. Fetching repositories...', type: 'success' }
            }));
        } catch (e) {
            setError('Invalid Personal Access Token. Please check scopes.');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-10 relative">
            {/* Modal */}
            {showTokenModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setShowTokenModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        <h3 className="text-xl font-bold text-white mb-2">Connect GitHub</h3>
                        <p className="text-sm text-slate-400 mb-6">Enter a Personal Access Token (classic) with <code>repo</code> scope to enable real sync.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Personal Access Token</label>
                                <input
                                    type="password"
                                    value={tokenInput}
                                    onChange={(e) => setTokenInput(e.target.value)}
                                    placeholder="ghp_..."
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none"
                                />
                                {error && <p className="text-xs text-rose-500 mt-2 font-bold">{error}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <a href="https://github.com/settings/tokens/new?scopes=repo&description=TrackCodex" target="_blank" className="flex items-center px-4 py-2 hover:bg-white/5 rounded-xl text-xs font-bold text-slate-400 transition-colors">
                                    Generate Token
                                    <span className="material-symbols-outlined !text-[14px] ml-1">open_in_new</span>
                                </a>
                                <button
                                    onClick={submitToken}
                                    disabled={!tokenInput || isVerifying}
                                    className="px-6 py-2 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                                >
                                    {isVerifying ? 'Verifying...' : 'Connect'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="border-b border-gh-border pb-6">
                <h1 className="text-2xl font-black text-white tracking-tight">Integrations</h1>
                <p className="text-sm text-gh-text-secondary mt-1 leading-relaxed">
                    Connect external tools to enhance ForgeAI's context and capabilities.
                </p>
            </header>

            <SettingsSection title="Version Control" description="Connect your code repositories.">
                <div className="space-y-4">
                    {integrations.filter(i => ['github', 'gitlab'].includes(i.id)).map(integration => (
                        <IntegrationCard key={integration.id} integration={integration} onToggle={() => handleConnectClick(integration)} />
                    ))}
                </div>
            </SettingsSection>

            <SettingsSection title="Ecosystem Tools" description="Integrate with the wider Quantaforge ecosystem.">
                <div className="space-y-4">
                    {integrations.filter(i => !['github', 'gitlab'].includes(i.id)).map(integration => (
                        <IntegrationCard key={integration.id} integration={integration} onToggle={() => handleConnectClick(integration)} />
                    ))}
                </div>
            </SettingsSection>
        </div>
    );
};

export default IntegrationsSettings;
