import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_INBOX = [
    {
        id: 1,
        type: 'job',
        title: 'New Mission Offer: AI Core Optimization',
        repo: 'cyberdyne/skynet-core',
        message: 'Cyberdyne Systems wants you for "AI Core Optimization". This is a high-priority mission with a reward bounty of $50,000.',
        time: '2m ago',
        read: false,
        author: 'Cyberdyne HR',
        avatar: 'https://ui-avatars.com/api/?name=C+S&background=random'
    },
    {
        id: 2,
        type: 'mention',
        title: 'Mentioned in PR #42',
        repo: 'trackcodex/frontend',
        message: '@alex-coder Great work on the refactor! Can you check the responsiveness on mobile?',
        time: '1h ago',
        read: true,
        author: 'sarah-connor',
        avatar: 'https://ui-avatars.com/api/?name=S+C&background=random'
    },
    {
        id: 3,
        type: 'community',
        title: 'Trending: "Rust vs C++ in 2024"',
        repo: 'community/discussions',
        message: 'Your post is trending with 150 upvotes and 45 comments.',
        time: '3h ago',
        read: true,
        author: 'System',
        avatar: 'https://ui-avatars.com/api/?name=T+C&background=000&color=fff'
    },
    {
        id: 4,
        type: 'review_request',
        title: 'Review Requested: Feature/Dark-Mode',
        repo: 'trackcodex/design-system',
        message: 'requested your review on this pull request.',
        time: '5h ago',
        read: true,
        author: 'design-lead',
        avatar: 'https://ui-avatars.com/api/?name=D+L&background=random'
    },
    {
        id: 5,
        type: 'security',
        title: 'Security Alert: Lodash Vulnerability',
        repo: 'trackcodex/backend-api',
        message: 'Dependabot detected a high severity vulnerability in lodash version 4.17.15.',
        time: '1d ago',
        read: true,
        author: 'dependabot',
        avatar: 'https://avatars.githubusercontent.com/in/29110?v=4'
    }
];

const NotificationsView = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('Inbox');
    const [notifications, setNotifications] = useState(MOCK_INBOX);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="flex h-full bg-gh-bg text-slate-300 font-display">
            {/* Sidebar Filter */}
            <div className="w-64 border-r border-gh-border p-4 flex flex-col gap-1 hidden md:flex bg-[#0d1117]">
                <h2 className="px-3 text-xs font-black uppercase tracking-widest text-slate-500 mb-4 mt-2">Notifications</h2>

                {['Inbox', 'Saved', 'Done'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-left px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-between transition-colors ${filter === f ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-white hover:bg-[#161b22]'}`}
                    >
                        {f}
                        {f === 'Inbox' && unreadCount > 0 && (
                            <span className="bg-primary text-white text-[10px] px-1.5 rounded-full">{unreadCount}</span>
                        )}
                    </button>
                ))}

                <div className="h-px bg-[#30363d]/50 my-4 mx-2"></div>
                <h3 className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">Filters</h3>

                {['Assigned', 'Participating', 'Mentioned', 'Review requests'].map(f => (
                    <button key={f} className="text-left px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#161b22] transition-colors">
                        {f}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-14 border-b border-gh-border flex items-center justify-between px-6 bg-[#0d1117] sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-400"><span className="material-symbols-outlined">menu</span></button>
                        <h1 className="text-lg font-bold text-white">{filter}</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-[#161b22] border border-[#30363d] rounded-lg flex p-0.5">
                            <button className="px-3 py-1 text-xs font-bold text-white bg-[#30363d] rounded-md shadow-sm">Unread</button>
                            <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-300">All</button>
                        </div>
                        <button
                            onClick={markAllRead}
                            className="text-xs font-bold text-primary hover:text-blue-400 flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined !text-[16px]">done_all</span>
                            Mark all as read
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-500">
                            <span className="material-symbols-outlined !text-[48px] mb-4 opacity-50">inbox</span>
                            <p className="font-medium">All caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#30363d]/50">
                            {notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`p-4 flex gap-4 hover:bg-[#161b22] transition-colors group cursor-pointer ${!notif.read ? 'bg-[#161b22]/50' : 'bg-transparent'}`}
                                    onClick={() => markAsRead(notif.id)}
                                >
                                    <div className="pt-1 shrink-0">
                                        <div className={`size-8 rounded-lg flex items-center justify-center border border-transparent group-hover:border-[#30363d] transition-all ${notif.type === 'job' ? 'text-amber-500 bg-amber-500/10' :
                                                notif.type === 'mention' ? 'text-blue-500 bg-blue-500/10' :
                                                    notif.type === 'review_request' ? 'text-purple-500 bg-purple-500/10' :
                                                        notif.type === 'security' ? 'text-rose-500 bg-rose-500/10' :
                                                            'text-slate-400 bg-slate-500/10'
                                            }`}>
                                            <span className="material-symbols-outlined !text-[18px]">
                                                {notif.type === 'job' ? 'work' :
                                                    notif.type === 'mention' ? 'alternate_email' :
                                                        notif.type === 'review_request' ? 'rate_review' :
                                                            notif.type === 'security' ? 'security' : 'forum'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <span className="font-mono text-slate-400">{notif.repo}</span>
                                                <span>•</span>
                                                <span>{notif.time}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button title="Archive" className="p-1 hover:bg-[#30363d] rounded"><span className="material-symbols-outlined !text-[16px]">archive</span></button>
                                                <button title="Unsubscribe" className="p-1 hover:bg-[#30363d] rounded"><span className="material-symbols-outlined !text-[16px]">notifications_off</span></button>
                                            </div>
                                        </div>

                                        <h3 className={`text-sm font-bold mb-1 ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                                            {notif.title}
                                        </h3>

                                        <div className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                                            <img src={notif.avatar} className="size-4 rounded-full mt-0.5" />
                                            <span className="font-medium text-slate-300">{notif.author}</span>
                                            <span className="line-clamp-1">{notif.message}</span>
                                        </div>
                                    </div>

                                    {!notif.read && (
                                        <div className="shrink-0 self-center">
                                            <div className="size-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsView;
