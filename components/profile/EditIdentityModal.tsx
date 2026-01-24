
import React, { useState } from 'react';
import { UserProfile, profileService } from '../../services/profile';

interface EditIdentityModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: UserProfile;
}

const EMOJI_PRESETS = ['😁', '💻', '🤔', '🚀', '🔥', '👀', '🎧', '⚡', '💤', '🎓', '🛠️', '🐛'];
const AVATAR_PRESETS = [
    'https://picsum.photos/seed/alexprofile/600',
    'https://picsum.photos/seed/cyberpunk/600',
    'https://picsum.photos/seed/coder/600',
    'https://picsum.photos/seed/robot/600',
];

const EditIdentityModal: React.FC<EditIdentityModalProps> = ({ isOpen, onClose, profile }) => {
    const [formData, setFormData] = useState({
        avatar: profile.avatar || '',
        statusEmoji: profile.techStatus?.emoji || '💻',
        statusText: profile.techStatus?.text || '',
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileService.updateProfile({
            avatar: formData.avatar,
            techStatus: {
                emoji: formData.statusEmoji,
                text: formData.statusText,
                expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            }
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#161b22] border border-[#30363d] w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl flex flex-col font-display">
                {/* Header */}
                <div className="p-6 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">Edit Identity</h3>
                    <button onClick={onClose} className="size-8 rounded-full hover:bg-white/5 text-slate-500 transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex gap-8">
                        <div className="relative group shrink-0">
                            <img src={formData.avatar} className="size-24 rounded-full border-2 border-[#30363d] object-cover" />
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest pointer-events-none">
                                Preview
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Avatar Image</label>
                                <div className="flex gap-2 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('avatar-upload')?.click()}
                                        className="px-4 py-2 bg-[#21262d] border border-[#30363d] hover:border-slate-400 rounded-lg text-xs font-bold text-white transition-all flex items-center gap-2"
                                    >
                                        <span className="material-symbols-outlined !text-base">upload</span>
                                        Upload from Device
                                    </button>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setFormData({ ...formData, avatar: reader.result as string });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </div>
                                <input
                                    value={formData.avatar}
                                    onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                                    placeholder="Or enter image URL..."
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2 text-xs text-slate-400 focus:text-white focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2 px-1">Or choose preset</label>
                                <div className="flex gap-2">
                                    {AVATAR_PRESETS.map(url => (
                                        <img
                                            key={url}
                                            src={url}
                                            onClick={() => setFormData({ ...formData, avatar: url })}
                                            className={`size-8 rounded-full cursor-pointer hover:scale-110 transition-transform ${formData.avatar === url ? 'ring-2 ring-primary' : 'opacity-50 hover:opacity-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-[#30363d]" />

                    {/* Status Section */}
                    <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3 px-1">Set Status</label>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <div className="size-12 bg-[#0d1117] border border-[#30363d] rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:border-primary transition-colors">
                                    {formData.statusEmoji}
                                </div>
                            </div>
                            <div className="flex-1">
                                <input
                                    value={formData.statusText}
                                    onChange={e => setFormData({ ...formData, statusText: e.target.value })}
                                    placeholder="What's happening?"
                                    className="w-full h-12 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 text-sm text-white focus:ring-1 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Emoji Grid */}
                        <div className="mt-4 grid grid-cols-8 gap-2">
                            {EMOJI_PRESETS.map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, statusEmoji: emoji })}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-lg hover:bg-white/5 transition-colors ${formData.statusEmoji === emoji ? 'bg-primary/20 ring-1 ring-primary' : ''}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-primary hover:bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-primary/20">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditIdentityModal;
