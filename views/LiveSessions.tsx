import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MOCK_SESSIONS } from '../constants';
import { forgeAIService } from '../services/gemini';

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  isAI?: boolean;
  reactions?: { [emoji: string]: string[] };
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isSharingScreen: boolean;
  role: 'host' | 'participant';
  isTalking?: boolean; 
}

const COMMON_EMOJIS = ['👍', '❤️', '🔥', '🚀', '😄', '💡'];

const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  // Simple regex-based syntax highlighting for common keywords
  const highlight = (text: string) => {
    return text
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|from|export|default|async|await|try|catch|class|extends|interface|type)\b/g, '<span class="text-purple-400 font-bold">$1</span>')
      .replace(/\b(string|number|boolean|any|void|never|unknown|object)\b/g, '<span class="text-blue-300">$1</span>')
      .replace(/(\".*?\"|\'.*?\'|\`.*?\`)/g, '<span class="text-emerald-400">$1</span>')
      .replace(/\/\/.*/g, '<span class="text-slate-500">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <pre className="p-3 bg-background-dark/80 rounded-lg font-mono text-xs overflow-x-auto border border-white/5 my-2 custom-scrollbar">
      <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
    </pre>
  );
};

const INITIAL_MESSAGES: ChatMessage[] = [
  { 
    id: '1', 
    sender: 'Sarah Chen', 
    avatar: 'https://picsum.photos/seed/sarah/64', 
    text: 'Hey team, I started the auth module refactor session. Check this out:\n```typescript\nconst auth = async (req, res) => {\n  const user = await db.user.findUnique();\n  return user;\n}```', 
    timestamp: '10:30 AM', 
    isMe: false,
    reactions: { '🚀': ['Sarah Chen', 'Alex Rivers'], '👍': ['Marcus Thorne'] }
  },
  { 
    id: '2', 
    sender: 'Marcus Thorne', 
    avatar: 'https://picsum.photos/seed/marcus/64', 
    text: 'On my way. Just finishing a local build.', 
    timestamp: '10:32 AM', 
    isMe: false 
  },
];

const INITIAL_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/sarah/64', isMuted: false, isSharingScreen: true, role: 'host', isTalking: true },
  { id: 'p2', name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/64', isMuted: true, isSharingScreen: false, role: 'participant' },
  { id: 'p3', name: 'Alex Rivers', avatar: 'https://picsum.photos/seed/alex/64', isMuted: false, isSharingScreen: false, role: 'participant', isTalking: false },
  { id: 'p4', name: 'Jane Dev', avatar: 'https://picsum.photos/seed/user1/32', isMuted: false, isSharingScreen: false, role: 'participant' },
];

const LiveSessions = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHosting, setIsHosting] = useState(true);
  const [participants, setParticipants] = useState<Participant[]>(INITIAL_PARTICIPANTS);
  const [isSharingMyScreen, setIsSharingMyScreen] = useState(false);
  const [allMuted, setAllMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const [chatFontSize, setChatFontSize] = useState(13);
  const [showMentionPicker, setShowMentionPicker] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [pickerIndex, setPickerIndex] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleMute = (id: string) => {
    setParticipants(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isMuted: !p.isMuted, isTalking: !p.isMuted ? false : p.isTalking };
      }
      return p;
    }));
  };

  const toggleMuteAll = () => {
    const nextState = !allMuted;
    setAllMuted(nextState);
    setParticipants(prev => prev.map(p => 
      p.role === 'participant' ? { ...p, isMuted: nextState, isTalking: nextState ? false : p.isTalking } : p
    ));
  };

  const kickParticipant = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from this session?`)) {
      setParticipants(prev => prev.filter(p => p.id !== id));
    }
  };

  const stopSession = () => {
    if (confirm("Are you sure you want to end this live session for everyone?")) {
      setIsHosting(false);
    }
  };

  const adjustFontSize = (delta: number) => {
    setChatFontSize(prev => Math.min(Math.max(prev + delta, 11), 22));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtSymbol = textBeforeCursor.lastIndexOf('@');

    if (lastAtSymbol !== -1 && !textBeforeCursor.slice(lastAtSymbol).includes(' ')) {
      setShowMentionPicker(true);
      setMentionSearch(textBeforeCursor.slice(lastAtSymbol + 1).toLowerCase());
      setPickerIndex(0);
    } else {
      setShowMentionPicker(false);
    }
  };

  const filteredParticipants = useMemo(() => {
    return participants.filter(p => p.name.toLowerCase().includes(mentionSearch));
  }, [participants, mentionSearch]);

  const selectMention = (participant: Participant) => {
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const textBeforeMention = inputValue.slice(0, inputValue.lastIndexOf('@', cursorPosition - 1));
    const textAfterMention = inputValue.slice(cursorPosition);
    
    setInputValue(`${textBeforeMention}@${participant.name.replace(/\s/g, '')} ${textAfterMention}`);
    setShowMentionPicker(false);
    inputRef.current?.focus();
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const currentInput = inputValue;
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'You',
      avatar: 'https://picsum.photos/seed/user1/32',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setShowMentionPicker(false);
    setIsTyping(true);

    try {
      const activeSession = MOCK_SESSIONS[0];
      const participantNames = participants.map(p => p.name);
      
      const aiResponse = await forgeAIService.getLiveChatResponse(
        currentInput, 
        `Debugging ${activeSession.project}: ${activeSession.title}`, 
        participantNames
      );
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ForgeAI Co-pilot',
        avatar: 'https://picsum.photos/seed/ai/64',
        text: aiResponse || "Analysis complete. I recommend checking the middleware layers.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        isAI: true,
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
      }, 800);
    } catch (err) {
      console.error("ForgeAI Error:", err);
      setIsTyping(false);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = { ...(msg.reactions || {}) };
        const users = (reactions[emoji] ? [...reactions[emoji]] : []) as string[];
        if (users.includes('You')) {
          reactions[emoji] = users.filter(u => u !== 'You');
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...users, 'You'];
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
  };

  const renderMessageContent = (text: string) => {
    // Detection for Code Blocks
    const parts = text.split(/```(\w+)?\n([\s\S]*?)```/g);
    
    if (parts.length > 1) {
      const elements: React.ReactNode[] = [];
      for (let i = 0; i < parts.length; i++) {
        if (i % 3 === 0) {
          // Normal text
          if (parts[i]) elements.push(<div key={i}>{renderTextWithMentions(parts[i])}</div>);
        } else if (i % 3 === 2) {
          // Code block content (parts[i-1] is language, parts[i] is code)
          elements.push(<SyntaxHighlighter key={i} code={parts[i]} />);
        }
      }
      return elements;
    }

    return renderTextWithMentions(text);
  };

  const renderTextWithMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return <span key={i} className="text-primary font-bold">{part}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 font-display">Live Sessions</h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Real-time high-fidelity collaboration for distributed engineering teams.
            </p>
          </div>
          {!isHosting && (
             <button 
              onClick={() => setIsHosting(true)}
              className="bg-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
             >
               <span className="material-symbols-outlined text-lg">add_circle</span>
               New Live Session
             </button>
          )}
        </div>

        {isHosting && (
          <section className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-surface-dark border-2 border-primary/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-border-dark flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                    <span className="material-symbols-outlined text-2xl">settings_input_component</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      Host Command Console 
                      <span className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-black uppercase tracking-widest text-white">Master</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500"></span>
                      Streaming 1080p • Low Latency
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isRecording ? 'bg-red-500 text-white border-red-400 animate-pulse' : 'bg-surface-dark text-slate-400 border-border-dark hover:text-white hover:border-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isRecording ? 'radio_button_checked' : 'fiber_manual_record'}</span>
                    {isRecording ? 'REC 00:45:12' : 'Record Session'}
                  </button>
                  <button 
                    onClick={() => setIsSharingMyScreen(!isSharingMyScreen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSharingMyScreen ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-surface-dark text-slate-400 border-border-dark hover:text-white hover:border-slate-500'}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{isSharingMyScreen ? 'screen_share' : 'stop_screen_share'}</span>
                    {isSharingMyScreen ? 'Sharing' : 'Share Screen'}
                  </button>
                  <button 
                    onClick={stopSession}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-500/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                    End Session
                  </button>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">engineering</span>
                      Manage Engineers ({participants.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={toggleMuteAll}
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${allMuted ? 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' : 'text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20'}`}
                      >
                        <span className="material-symbols-outlined text-sm">{allMuted ? 'mic' : 'mic_off'}</span>
                        {allMuted ? 'Unmute Everyone' : 'Mute Everyone'}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[320px] overflow-y-auto custom-scrollbar pr-3">
                    {participants.map(p => (
                      <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl bg-background-dark/40 border transition-all group ${p.isMuted ? 'border-red-500/10 opacity-70' : 'border-border-dark hover:border-primary/30'}`}>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`size-10 rounded-full flex items-center justify-center transition-all ${p.isTalking && !p.isMuted ? 'ring-2 ring-primary ring-offset-2 ring-offset-background-dark animate-pulse' : ''}`}>
                              <img src={p.avatar} alt={p.name} className="size-full rounded-full border border-border-dark object-cover" />
                            </div>
                            {p.role === 'host' && (
                              <div className="absolute -top-1 -right-1 size-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] text-white border-2 border-surface-dark">
                                <span className="material-symbols-outlined !text-[10px] filled">verified</span>
                              </div>
                            )}
                            {p.isMuted && (
                              <div className="absolute -bottom-1 -right-1 size-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white border-2 border-surface-dark shadow-sm">
                                <span className="material-symbols-outlined !text-[10px]">mic_off</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-bold transition-colors ${p.isMuted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{p.name}</p>
                              {p.isSharingScreen && <span className="material-symbols-outlined text-[14px] text-emerald-500">present_to_all</span>}
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                              {p.role === 'host' ? 'Session Host' : (p.isMuted ? 'Audio Restricted' : (p.isTalking ? 'Talking now...' : 'Standby'))}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          {p.role !== 'host' && (
                            <>
                              <button 
                                onClick={() => toggleMute(p.id)}
                                className={`size-8 rounded-lg flex items-center justify-center transition-all ${p.isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/40' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'}`}
                                title={p.isMuted ? 'Enable Audio' : 'Silence Participant'}
                              >
                                <span className="material-symbols-outlined text-[18px]">{p.isMuted ? 'mic_off' : 'mic'}</span>
                              </button>
                              <button 
                                onClick={() => kickParticipant(p.id, p.name)}
                                className="size-8 rounded-lg flex items-center justify-center bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                title="Remove from Session"
                              >
                                <span className="material-symbols-outlined text-[18px]">person_remove</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">analytics</span>
                      Session Health & Stats
                   </h3>
                   <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold text-primary uppercase">Spectators</p>
                          <span className="material-symbols-outlined text-primary text-sm">visibility</span>
                        </div>
                        <p className="text-3xl font-black">124</p>
                        <p className="text-[9px] text-slate-500 mt-1">Global Organization View</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] font-bold text-emerald-500 uppercase">Commits</p>
                          <span className="material-symbols-outlined text-emerald-500 text-sm">data_object</span>
                        </div>
                        <p className="text-3xl font-black">12</p>
                        <p className="text-[9px] text-slate-500 mt-1">Pending Code Reviews</p>
                      </div>
                      <div className="col-span-2 p-5 rounded-2xl bg-slate-800/40 border border-border-dark relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="material-symbols-outlined text-5xl">auto_awesome</span>
                         </div>
                         <p className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">ForgeAI Live Audit Log</p>
                         <div className="space-y-3">
                            <div className="flex items-center gap-3">
                               <div className="size-2 rounded-full bg-primary animate-ping"></div>
                               <span className="text-[11px] font-medium text-slate-400">Sarah Chen started screen sharing via IDE instance</span>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="size-2 rounded-full bg-amber-500"></div>
                               <span className="text-[11px] font-medium text-slate-400">
                                 {allMuted ? 'Global audio restriction enforced by host' : 'Audio channels synchronized with ForgeAI noise reduction'}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold">Recommended for You</h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-wider">
              <span className="size-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Trending
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SESSIONS.map(session => (
              <div key={session.id} className="group bg-surface-dark rounded-2xl border border-border-dark p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">hub</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{session.project}</p>
                      <h4 className="font-bold text-sm truncate w-40 text-slate-100">{session.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-[10px] font-bold text-slate-400 border border-border-dark">
                    <span className="material-symbols-outlined text-xs">group</span>
                    {session.viewers}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <img key={i} className="size-8 rounded-full border-2 border-surface-dark bg-slate-800" src={`https://picsum.photos/seed/${i + 20}/32`} alt="Participant" />
                    ))}
                    <div className="size-8 rounded-full border-2 border-surface-dark bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-500">+{session.participants}</div>
                  </div>
                  <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-5 py-2 rounded-xl text-xs font-black transition-all border border-primary/20">
                    Watch Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="w-85 border-l border-border-dark bg-surface-dark/10 flex flex-col shrink-0 relative backdrop-blur-sm">
        <div className="p-5 border-b border-border-dark bg-background-dark/50 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary filled">diversity_3</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Collaborative Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-surface-dark border border-border-dark rounded-lg p-0.5 overflow-hidden shadow-sm">
                <button 
                  onClick={() => adjustFontSize(-1)}
                  className="size-6 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/5 transition-all text-xs font-bold"
                  aria-label="Decrease Font Size"
                >
                  <span className="material-symbols-outlined !text-[14px]">remove</span>
                </button>
                <div className="w-px h-3 bg-border-dark mx-0.5"></div>
                <span className="text-[9px] font-black text-slate-600 px-1 select-none">AA</span>
                <div className="w-px h-3 bg-border-dark mx-0.5"></div>
                <button 
                  onClick={() => adjustFontSize(1)}
                  className="size-6 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-white/5 transition-all text-xs font-bold"
                  aria-label="Increase Font Size"
                >
                   <span className="material-symbols-outlined !text-[14px]">add</span>
                </button>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                 <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[9px] font-black text-emerald-500 uppercase">Live Sync</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl flex items-center gap-3 group cursor-help transition-all hover:bg-primary/15 shadow-lg shadow-primary/5">
             <div className="size-9 rounded-lg bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px] filled animate-pulse">auto_awesome</span>
             </div>
             <div className="flex flex-col">
                <span className="text-[11px] font-black text-primary uppercase tracking-tighter">ForgeAI Assistant</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Contextual Monitoring</span>
             </div>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-5 overflow-y-auto custom-scrollbar flex flex-col gap-6"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 relative group/msg ${msg.isMe ? 'flex-row-reverse' : ''}`}>
              <img src={msg.avatar} alt={msg.sender} className={`size-9 rounded-full shrink-0 mt-1 shadow-md object-cover border-2 ${msg.isAI ? 'border-primary/50' : 'border-border-dark'}`} />
              <div className={`flex flex-col max-w-[85%] ${msg.isMe ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className={`text-[11px] font-black uppercase tracking-tight ${msg.isAI ? 'text-primary' : 'text-slate-400'}`}>{msg.sender}</span>
                  <span className="text-[9px] text-slate-600 font-mono">{msg.timestamp}</span>
                </div>
                <div 
                  style={{ fontSize: `${chatFontSize}px`, lineHeight: '1.6' }}
                  className={`p-3 rounded-2xl shadow-lg relative transition-all ${
                    msg.isMe 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : msg.isAI 
                        ? 'bg-primary/5 border border-primary/20 text-blue-100 rounded-tl-none ring-1 ring-primary/10'
                        : 'bg-surface-dark border border-border-dark text-slate-200 rounded-tl-none'
                  }`}
                >
                  {renderMessageContent(msg.text)}
                  
                  {/* Reaction Picker on Hover */}
                  {!msg.isAI && (
                    <div className={`absolute top-0 opacity-0 group-hover/msg:opacity-100 transition-all duration-300 flex items-center gap-1.5 bg-[#161b22] border border-[#30363d] p-1.5 rounded-xl shadow-2xl z-40 scale-90 group-hover/msg:scale-100 ${msg.isMe ? '-left-56' : '-right-56'}`}>
                      {COMMON_EMOJIS.map(emoji => (
                        <button 
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="size-7 flex items-center justify-center hover:bg-primary/20 rounded-lg transition-colors text-sm hover:scale-125 duration-200"
                          title={emoji}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Reactions list under message */}
                {msg.reactions && (Object.entries(msg.reactions) as [string, string[]][]).map(([emoji, users]) => {
                  // Fix: Properly cast Object.entries result to string[] to resolve 'unknown' type errors for includes, join, and length
                  const hasReacted = users.includes('You');
                  return (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className={`px-2 py-0.5 rounded-full text-[10px] border flex items-center gap-1.5 transition-all ${
                        hasReacted 
                          ? 'bg-primary/10 border-primary/40 text-primary shadow-sm' 
                          : 'bg-surface-dark border-border-dark text-slate-400 hover:border-slate-500'
                      }`}
                      title={users.join(', ')}
                    >
                      <span className="scale-110">{emoji}</span>
                      <span className="font-black">{users.length}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="size-9 rounded-full bg-slate-800 animate-pulse border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
              </div>
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-2xl rounded-tl-none flex items-center justify-center w-16">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {showMentionPicker && filteredParticipants.length > 0 && (
          <div className="absolute bottom-24 left-5 right-5 bg-surface-dark border-2 border-primary/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 backdrop-blur-xl">
            <div className="p-3 border-b border-border-dark bg-background-dark/80">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-symbols-outlined text-xs">alternate_email</span>
                Reference Participant
              </p>
            </div>
            <div className="max-h-56 overflow-y-auto custom-scrollbar">
              {filteredParticipants.map((p, i) => (
                <button
                  key={p.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    i === pickerIndex ? 'bg-primary/20 border-l-4 border-l-primary' : 'hover:bg-white/5 border-l-4 border-l-transparent'
                  }`}
                  onClick={() => selectMention(p)}
                >
                  <img src={p.avatar} alt={p.name} className="size-7 rounded-full border border-border-dark" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-100">{p.name}</span>
                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">{p.role}</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono ml-auto">@{p.name.replace(/\s/g, '').toLowerCase()}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-5 bg-background-dark/80 border-t border-border-dark backdrop-blur-md">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-600 group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined text-base">terminal</span>
            </div>
            <input 
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              className="w-full bg-surface-dark border-2 border-border-dark rounded-2xl text-[13px] p-4 pl-10 pr-24 focus:ring-0 focus:border-primary placeholder:text-slate-600 text-white transition-all shadow-inner font-medium" 
              placeholder="Type message or code with ```..."
              autoComplete="off"
            />
            <div className="absolute right-3 top-2.5 flex items-center gap-2">
              <button 
                type="button"
                onClick={() => setInputValue(prev => prev + '```typescript\n\n```')}
                className="size-9 flex items-center justify-center text-slate-500 hover:text-primary transition-all rounded-xl hover:bg-primary/10"
                title="Insert Code Snippet"
              >
                <span className="material-symbols-outlined !text-[20px]">code</span>
              </button>
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="size-9 flex items-center justify-center bg-primary disabled:bg-slate-800 text-white disabled:text-slate-600 rounded-xl transition-all shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined !text-[20px] filled">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </aside>
    </div>
  );
};

export default LiveSessions;