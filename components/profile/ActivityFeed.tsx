
import React from 'react';

const ActivityFeed = () => {
  const events = [
    { type: 'push', repo: 'rust-crypto-guard', date: '2 hours ago', commits: 3 },
    { type: 'pr', repo: 'forge-ai-security', date: 'Yesterday', title: 'Fix: update AI model path' },
    { type: 'create', repo: 'temp-security-test', date: '3 days ago' },
    { type: 'push', repo: 'rust-crypto-guard', date: '4 days ago', commits: 1 }
  ];

  return (
    <div className="font-display space-y-2">
      <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest mb-2">March 2024</p>
      <div className="space-y-4">
        {events.map((event, i) => (
          <div key={i} className="flex gap-3 text-sm">
            <div className="pt-1 flex flex-col items-center">
              <div className="size-6 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center">
                <span className="material-symbols-outlined !text-[14px] text-slate-400">
                  {event.type === 'push' ? 'commit' : event.type === 'pr' ? 'fork_right' : 'add'}
                </span>
              </div>
            </div>
            <div className="flex-1 pb-4 border-b border-[#30363d] last:border-0">
              <p className="text-[#c9d1d9]">
                Created {event.type === 'push' ? `${event.commits} commits` : event.type === 'pr' ? `pull request ${event.title}` : 'repository'} 
                {" "}in <span className="text-[#f0f6fc] font-semibold hover:text-[#58a6ff] cursor-pointer">{event.repo}</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
