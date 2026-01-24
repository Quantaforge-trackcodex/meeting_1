
import React, { useState } from 'react';
import { Organization } from '../../../types';
import { useOutletContext } from 'react-router-dom';

const OrgGeneralSettings = () => {
    const { org } = useOutletContext<{ org: Organization }>();
    const [name, setName] = useState(org.name);
    const [description, setDescription] = useState(org.description);
    const [email, setEmail] = useState('');
    const [url, setUrl] = useState('');
    const [location, setLocation] = useState('');
    const [billingEmail, setBillingEmail] = useState('quantaforge25@gmail.com');
    const [socialLinks, setSocialLinks] = useState(['', '', '', '']);

    const handleSocialChange = (index: number, val: string) => {
        const newLinks = [...socialLinks];
        newLinks[index] = val;
        setSocialLinks(newLinks);
    };

    return (
        <div className="animate-in fade-in duration-500 pt-8 pb-20 pr-8">
            <header className="mb-8 border-b border-gh-border pb-4">
                <h2 className="text-2xl font-bold text-white mb-2">General</h2>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Main Form Column */}
                <div className="lg:col-span-2 space-y-8 text-sm">

                    {/* Public Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block font-bold text-white mb-2">Organization display name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-white mb-2">Email (will be public)</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-white mb-2">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-white mb-2">URL</label>
                            <input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Social Accounts */}
                    <div>
                        <label className="block font-bold text-white mb-2">Social accounts</label>
                        <div className="space-y-2">
                            {socialLinks.map((link, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="material-symbols-outlined text-slate-500 text-lg mr-2">link</span>
                                    <input
                                        value={link}
                                        onChange={(e) => handleSocialChange(i, e.target.value)}
                                        placeholder={`Link to social profile ${i + 1}`}
                                        className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-600"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block font-bold text-white mb-2">Location</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">public</span>
                            <input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Select a location"
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    {/* Emails Section */}
                    <div className="space-y-4 pt-4 border-t border-gh-border">
                        <div>
                            <label className="block font-bold text-white mb-1">Billing email (Private)</label>
                            <input
                                value={billingEmail}
                                onChange={(e) => setBillingEmail(e.target.value)}
                                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            />
                            <p className="text-xs text-blue-400 mt-1 cursor-pointer hover:underline">Add more billing email recipients in the billing page.</p>
                        </div>

                        <div>
                            <label className="block font-bold text-white mb-1">Gravatar email (Private)</label>
                            <input className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block font-bold text-white mb-1">Sponsors update email (Private)</label>
                            <input className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                            <p className="text-xs text-slate-500 mt-1">The developers and organizations that your organization sponsors can send you updates to this email.</p>
                        </div>
                    </div>

                    <button className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] text-white font-bold rounded-md text-sm transition-all border border-[rgba(240,246,252,0.1)] shadow-sm">
                        Update profile
                    </button>

                </div>

                {/* Right Column: Avatar */}
                <div className="lg:col-span-1">
                    <label className="block font-bold text-white mb-2">Profile picture</label>
                    <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 flex flex-col items-start gap-4">
                        <img src={org.avatar} className="size-48 rounded-md border border-[#30363d] object-cover" />
                        <button className="px-4 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-white font-medium rounded-md text-xs border border-[#30363d] transition-all w-full">
                            Upload new picture
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                        Note: To apply for a publisher verification your organization's profile picture should not be irrelevant, abusive or vulgar. It should not be a default image provided by GitHub.
                    </p>
                </div>
            </div>

        </div>
    );
};

export default OrgGeneralSettings;