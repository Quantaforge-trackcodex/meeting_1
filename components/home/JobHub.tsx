
import React from 'react';

const JobHub = () => {
  const jobs = [
    { 
      title: 'React & Rust Security Audit', 
      desc: 'Looking for a specialist to audit our new authentication flow built with...', 
      pay: '$85/hr',
      tags: ['Remote', 'Contract']
    },
    { 
      title: 'Frontend Lead (Vue.js)', 
      desc: 'Full-time role for a security-focused frontend architect...', 
      pay: '$120k - $140k',
      tags: ['Full-time']
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100 overflow-hidden">
      {jobs.map((job, i) => (
        <div key={i} className="p-5 hover:bg-slate-50 transition-all cursor-pointer group">
           <div className="flex items-start justify-between mb-2">
              <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600">{job.title}</h4>
              <span className="text-emerald-600 text-xs font-black">{job.pay}</span>
           </div>
           <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{job.desc}</p>
           <div className="flex gap-2">
              {job.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[9px] font-black uppercase rounded">
                   {tag}
                </span>
              ))}
           </div>
        </div>
      ))}
    </div>
  );
};

export default JobHub;
