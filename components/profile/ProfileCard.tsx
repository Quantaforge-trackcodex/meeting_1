import React, { useState, useEffect } from 'react';
import { profileService, UserProfile } from '../../services/profile';
import OfferJobModal from '../jobs/offer/OfferJobModal';
import { directMessageBus } from '../../services/directMessageBus';

const ProfileCard = () => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getProfile());
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = profileService.subscribe(setProfile);
    return unsubscribe;
  }, []);

  const handleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  const handleOffer = () => {
    setIsOfferModalOpen(true);
  };

  const handleMessage = () => {
    directMessageBus.openChat({
      id: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      context: 'From their profile'
    });
  };

  return (
    <div className="font-display relative text-gh-text">
      <div className="relative w-48 h-48 mx-auto mb-6">
        <img src={profile.avatar} className="size-full rounded-full border-4 border-[#30363d] object-cover" alt={profile.name} />
        {profile.techStatus && profile.techStatus.emoji && (
          <div className="absolute bottom-2 right-2 size-10 rounded-full bg-[#161b22] border-2 border-[#30363d] flex items-center justify-center text-xl shadow-lg" title={profile.techStatus.text || 'Online'}>
            {profile.techStatus.emoji}
          </div>
        )}
      </div>

      <div className="text-left mb-4">
        <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
        <p className="text-lg text-slate-400 -mt-1">{profile.username}</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleFollow}
          className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${isFollowing ? 'bg-[#21262d] text-slate-200 border border-[#30363d] hover:border-slate-400' : 'bg-primary text-white'}`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        <button onClick={handleOffer} className="px-4 py-2 bg-[#21262d] text-slate-200 border border-[#30363d] rounded-lg text-xs font-bold hover:border-slate-400 transition-all">
          Job Offer
        </button>
        <button onClick={handleMessage} className="px-4 py-2 bg-[#21262d] text-slate-200 border border-[#30363d] rounded-lg text-xs font-bold hover:border-slate-400 transition-all">
          Message
        </button>
      </div>
      
      <p className="text-base text-slate-300 mb-6">{profile.bio}</p>

      <div className="flex items-center gap-4 mb-6 text-sm">
        <span className="material-symbols-outlined !text-base text-slate-500">group</span>
        <span className="font-bold text-white">{profile.followers}</span>
        <span className="text-slate-400">followers</span>
        <span className="text-slate-400">·</span>
        <span className="font-bold text-white">{profile.following}</span>
        <span className="text-slate-400">following</span>
      </div>

      <div className="space-y-3 text-sm mb-8">
        {profile.location && (
          <div className="flex items-center gap-3 text-slate-300">
            <span className="material-symbols-outlined !text-lg text-slate-500">location_on</span>
            <span>{profile.location}</span>
          </div>
        )}
        {profile.linkedinUrl && (
          <a href={`https://linkedin.com/${profile.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-primary">
            <svg className="size-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            <span>{profile.linkedinUrl}</span>
          </a>
        )}
        {profile.redditUrl && (
          <a href={`https://reddit.com/${profile.redditUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-primary">
             <svg className="size-4 text-slate-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-3.342 15.341c-.085.085-.188.147-.312.185-.039.013-.08.021-.12.03-.119.027-.243.04-.37.04-.32 0-.632-.124-.868-.361-.237-.236-.361-.548-.361-.868s.124-.632.361-.868c.237-.236.548-.361.868-.361.127 0 .251.013.37.04.04.008.081.017.12.03.124.038.227.1.312.185.085.085.147.188.185.312.013.039.021.08.03.12.027.119.04.243.04.37s-.013.251-.04.37c-.008.04-.017.081-.03.12-.038.124-.1.227-.185.312zm6.733 0c-.085.085-.188.147-.312.185-.039.013-.08.021-.12.03-.119.027-.243.04-.37.04-.32 0-.632-.124-.868-.361-.237-.236-.361-.548-.361-.868s.124-.632.361-.868c.237-.236.548-.361.868-.361.127 0 .251.013.37.04.04.008.081.017.12.03.124.038.227.1.312.185.085.085.147.188.185.312.013.039.021.08.03.12.027.119.04.243.04.37s-.013.251-.04.37c-.008.04-.017.081-.03.12-.038.124-.1.227-.185.312zm-4.75-2.09c.671 0 1.258-.292 1.67-.788.118.252.196.53.196.83 0 1.748-2.31 3.167-5.163 3.167-2.854 0-5.164-1.42-5.164-3.167 0-.3.078-.578.196-.83.412.496 1 .788 1.67.788.084 0 .167-.008.25-.022-1.745-.333-2.91-2.02-2.91-3.957 0-2.227 1.758-4.032 3.93-4.032.553 0 1.074.122 1.543.344.428-.198.892-.31 1.37-.31.564 0 1.103.143 1.57.39.46-.226.974-.356 1.523-.356 2.172 0 3.93 1.805 3.93 4.032 0 1.938-1.165 3.624-2.91 3.957.083.014.166.022.25.022z" /></svg>
            <span>{profile.redditUrl}</span>
          </a>
        )}
      </div>

      {profile.achievements && profile.achievements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-base font-bold text-white mb-4">Achievements</h2>
          <div className="flex flex-wrap gap-4">
            {profile.achievements.map((ach, i) => (
              <div key={i} className="flex items-center gap-2 group" title={ach.name}>
                <img src={ach.imageUrl} alt={ach.name} className="size-16 group-hover:scale-110 transition-transform" />
                {ach.count > 1 && (
                  <span className="text-sm font-bold text-slate-400">x{ach.count}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 pt-6 border-t border-[#30363d]">
        <button className="text-sm text-slate-500 hover:text-rose-500">Block or Report</button>
      </div>

      {isOfferModalOpen && (
        <OfferJobModal 
          isOpen={isOfferModalOpen} 
          onClose={() => setIsOfferModalOpen(false)} 
          targetUser={{ name: profile.name, username: profile.username }}
        />
      )}
    </div>
  );
};

export default ProfileCard;