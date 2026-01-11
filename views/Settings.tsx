
import React from 'react';

const SettingsView = () => {
  return (
    <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">Team & API Settings</h1>
          <p className="text-slate-500 text-sm">Configure access control and developer credentials for your engineering team.</p>
        </div>

        <section className="bg-surface-dark rounded-xl border border-border-dark overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-border-dark">
            <h2 className="text-lg font-bold">Workspace Members</h2>
            <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg">person_add</span>
              Invite Member
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c1d24] text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                <th className="px-6 py-3">Member</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-dark">
              {[
                { name: 'Alex Rivers', email: 'alex@trackcodex.io', role: 'Owner', status: 'Active', avatar: 'https://picsum.photos/seed/alex/64' },
                { name: 'Sarah Chen', email: 'sarah.c@trackcodex.io', role: 'Admin', status: 'Active', avatar: 'https://picsum.photos/seed/sarah/64' },
                { name: 'Marcus Thorne', email: 'm.thorne@partner.com', role: 'Member', status: 'Invited', avatar: 'https://picsum.photos/seed/marcus/64' }
              ].map(member => (
                <tr key={member.email} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img className="size-9 rounded-full bg-cover" src={member.avatar} alt={member.name} />
                      <div>
                        <p className="text-sm font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-300">{member.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      <span className={`size-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-white"><span className="material-symbols-outlined text-xl">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Security Preferences</h2>
          <div className="bg-surface-dark border border-border-dark rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <span className="material-symbols-outlined">verified_user</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Enforce 2FA for all members of this workspace.</p>
                </div>
              </div>
              <button className="w-11 h-6 bg-primary rounded-full relative transition-colors cursor-pointer">
                <span className="absolute right-1 top-1 size-4 bg-white rounded-full"></span>
              </button>
            </div>
            <div className="h-px bg-border-dark"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <span className="material-symbols-outlined">domain</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Single Sign-On (SSO)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Allow login via Okta, Azure AD, or Google Workspace.</p>
                </div>
              </div>
              <button className="w-11 h-6 bg-slate-700 rounded-full relative transition-colors cursor-pointer">
                <span className="absolute left-1 top-1 size-4 bg-white rounded-full"></span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
