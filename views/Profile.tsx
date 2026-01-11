
import React from 'react';
import ProfileCard from '../components/profile/ProfileCard';
import Highlights from '../components/profile/Highlights';
import CodingSnapshot from '../components/profile/CodingSnapshot';
import ForgeAIUsage from '../components/profile/ForgeAIUsage';
import SecurityImpact from '../components/profile/SecurityImpact';
import FreelanceCard from '../components/profile/FreelanceCard';
import PinnedRepos from '../components/profile/PinnedRepos';
import ActivityFeed from '../components/profile/ActivityFeed';

const ProfileView = () => {
  // Generate contribution heatmap data (7 rows x 52 columns for a full year view)
  const heatmapData = Array.from({ length: 7 * 52 }, () => Math.floor(Math.random() * 5));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] font-display">
      <div className="max-w-[1440px] mx-auto px-10 py-10 flex flex-col lg:flex-row gap-12">
        
        {/* Column 1: Profile Card */}
        <ProfileCard />

        {/* Content Area split into Center and Right */}
        <div className="flex-1 min-w-0">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-8 border-b border-[#30363d] mb-8 overflow-x-auto no-scrollbar">
            {[
              { label: 'Overview', icon: 'dashboard', active: true },
              { label: 'Code & Repos', icon: 'account_tree', badge: '42' },
              { label: 'Security', icon: 'verified_user', badge: 'Top 5%', badgeColor: 'green' },
              { label: 'AI & ForgeAI', icon: 'auto_awesome' },
              { label: 'Community', icon: 'groups' },
              { label: 'Jobs', icon: 'work' },
              { label: 'Activity', icon: 'history' }
            ].map((tab) => (
              <button 
                key={tab.label} 
                className={`flex items-center gap-2 pb-4 text-[14px] font-medium transition-all relative shrink-0 ${tab.active ? 'text-[#f0f6fc]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <span className="material-symbols-outlined !text-[20px]">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight ${tab.badgeColor === 'green' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-[#21262d] text-slate-500'}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.active && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f78166] rounded-t-full"></div>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
            {/* Center Column */}
            <div className="min-w-0 flex flex-col gap-8">
              <Highlights />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <CodingSnapshot />
                <SecurityImpact />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ForgeAIUsage />
                <FreelanceCard />
              </div>

              <PinnedRepos />

              {/* Heatmap Section */}
              <div className="font-display">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[16px] font-bold text-[#f0f6fc]">TrackCodex Activity</h3>
                  <span className="text-[12px] text-slate-500">
                    <span className="font-bold text-[#f0f6fc]">2,450</span> contributions in the last year
                  </span>
                </div>
                
                <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl shadow-sm overflow-x-auto custom-scrollbar">
                  <div className="flex gap-2">
                    {/* Days Labels Column */}
                    <div className="grid grid-rows-7 gap-[3px] text-[9px] text-slate-500 pr-2 pt-6">
                      {weekDays.map((day, i) => (
                        <div key={i} className="h-2.5 flex items-center">{day}</div>
                      ))}
                    </div>
                    
                    <div className="flex-1">
                      {/* Months Labels Row */}
                      <div className="flex justify-between text-[10px] text-slate-500 mb-2 px-1">
                        {months.map(month => <span key={month}>{month}</span>)}
                      </div>
                      
                      {/* Heatmap Grid */}
                      <div className="grid grid-flow-col grid-rows-7 gap-[3px] h-[88px]">
                        {heatmapData.map((val, i) => (
                          <div 
                            key={i} 
                            className={`rounded-[2px] w-2.5 h-2.5 transition-all duration-300 hover:ring-1 hover:ring-white/50 cursor-pointer ${
                              val === 0 ? 'bg-[#0d1117]' : 
                              val === 1 ? 'bg-[#0e4429]' : 
                              val === 2 ? 'bg-[#006d32]' : 
                              val === 3 ? 'bg-[#26a641]' : 'bg-[#39d353]'
                            }`}
                            title={`${val} contributions on this day`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-[11px] text-slate-500 border-t border-[#30363d] pt-4">
                    <p className="hover:text-primary cursor-pointer transition-colors">Learn how TrackCodex counts contributions</p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold">Less</span>
                       <div className="flex gap-[3px]">
                          <div className="size-2.5 bg-[#0d1117] rounded-[1px] border border-white/5"></div>
                          <div className="size-2.5 bg-[#0e4429] rounded-[1px]"></div>
                          <div className="size-2.5 bg-[#006d32] rounded-[1px]"></div>
                          <div className="size-2.5 bg-[#26a641] rounded-[1px]"></div>
                          <div className="size-2.5 bg-[#39d353] rounded-[1px]"></div>
                       </div>
                       <span className="text-[10px] font-bold">More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Latest Activity Sidebar */}
            <div className="min-w-0">
               <ActivityFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
