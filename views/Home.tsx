
import React from 'react';
import HomeHero from '../components/home/HomeHero';
import ContinueWorkspaces from '../components/home/ContinueWorkspaces';
import NeedsAttention from '../components/home/NeedsAttention';
import JobHub from '../components/home/JobHub';
import LearnGrow from '../components/home/LearnGrow';

const HomeView = () => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc] p-10 font-display">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Home</h1>
        </div>

        {/* Hero Section */}
        <div className="mb-12">
          <HomeHero />
        </div>

        {/* Continue Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Continue where you left</h2>
            <button className="text-teal-600 text-sm font-semibold hover:underline">View all</button>
          </div>
          <ContinueWorkspaces />
        </section>

        {/* Grid for Attention and Job Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
           <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-rose-500 filled">report</span>
                <h2 className="text-xl font-bold text-slate-900">Needs Attention</h2>
              </div>
              <NeedsAttention />
           </div>
           <div className="lg:col-span-5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-teal-600 filled">work</span>
                  <h2 className="text-xl font-bold text-slate-900">Job Hub</h2>
                </div>
                <button className="text-teal-600 text-sm font-semibold hover:underline">Go to Jobs</button>
              </div>
              <JobHub />
           </div>
        </div>

        {/* Footer Tiles */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-6">Learn, Share, Grow</h2>
          <LearnGrow />
        </section>
      </div>
    </div>
  );
};

export default HomeView;
