'use client';
import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useTheme } from 'next-themes';
import { supabase } from './lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { Sun, Moon, PlayCircle, Radio, X, Loader2, Clock, CalendarDays, Timer, Activity, Zap, LayoutGrid, Trophy, EyeOff } from 'lucide-react';

// --- Smart Countdown Timer ---
const MatchCountdown = ({ date, time }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const targetString = time && time !== '00:00' ? `${date}T${time}:00` : `${date}T23:59:59`;
    const targetDate = new Date(targetString).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft('Starting Soon');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) setTimeLeft(`Starts in ${days}d ${hours}h`);
      else setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [date, time]);

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-500/20">
      <Timer className="w-3.5 h-3.5 opacity-90" /> {timeLeft}
    </div>
  );
};

// --- Dynamic Enterprise Team Logo ---
const TeamLogo = ({ name, logoUrl }) => {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover shadow-sm border-[3px] border-white dark:border-slate-800 bg-white dark:bg-slate-900"
      />
    );
  }
  return (
    <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-xl shadow-sm border-[3px] border-white dark:border-slate-800 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-slate-700 dark:to-slate-800">
      {(name || 'T').charAt(0).toUpperCase()}
    </div>
  );
};

export default function EnterpriseApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [servers, setServers] = useState([]);
  const [activeMatch, setActiveMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const playerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    fetchData();

    const channel = supabase
      .channel('realtime_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stream_servers' }, () => {
        fetchData();
        toast('Live Sync: Data updated seamlessly.', { icon: '⚡', style: { borderRadius: '10px', background: theme === 'dark' ? '#1e293b' : '#fff', color: theme === 'dark' ? '#fff' : '#0f172a' } });
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [theme]);

  const fetchData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('stream_servers').select('*').order('match_date', { ascending: true });
    if (data) setServers(data);
    setIsLoading(false);
  };

  const handlePlayStream = (match) => {
    const hasStreamUrl = match.url && match.url.trim() !== '';

    if (!hasStreamUrl) {
      toast('Streaming restricted. Live score widget is active.', { icon: '📊' });
      return;
    }
    if (match.status === 'UPCOMING') {
      toast('Broadcast offline. Waiting for the countdown!', { icon: '⏳' });
      return;
    }

    toast.success(`Secure connection established: ${match.name}`, { duration: 3000 });
    setPlayerReady(false);
    setActiveMatch(match);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Smart Data Filtering
  const categories = ['All', ...new Set(servers.map(s => s.category || 'Football'))];
  const filteredServers = activeCategory === 'All' ? servers : servers.filter(match => (match.category || 'Football') === activeCategory);

  const liveMatches = filteredServers.filter(match => match.status === 'LIVE');
  const upcomingMatches = filteredServers.filter(match => match.status !== 'LIVE');

  const groupedUpcoming = upcomingMatches.reduce((group, match) => {
    const date = match.match_date || 'TBA';
    if (!group[date]) group[date] = [];
    group[date].push(match);
    return group;
  }, {});

  if (!mounted) return null;

  return (
    // আল্টিমেট ব্যাকগ্রাউন্ড ট্রানজিশন
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f18] text-slate-900 dark:text-slate-200 font-sans transition-colors duration-500 selection:bg-blue-500/30">
      <Toaster position="top-center" toastOptions={{ className: 'dark:bg-[#1e293b] dark:text-white font-medium shadow-2xl border border-slate-200 dark:border-slate-800' }} />

      {/* 🌟 Premium App Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0a0f18]/80 backdrop-blur-2xl px-6 md:px-10 py-4 flex justify-between items-center shadow-sm dark:shadow-none transition-colors duration-500">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-transparent dark:border-white/10">
            <Radio className="text-white w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">StreamKeeper</h1>
            <p className="text-[9px] uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 font-bold">Premium Edition</p>
          </div>
        </div>

        {/* থিম টগল বাটন */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-inner"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </header>

      <main className="max-w-[100rem] mx-auto p-4 md:p-8 flex flex-col gap-8">

        {/* 🎬 Smart Category Filter Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveCategory(cat);
                setActiveMatch(null);
              }}
              className={`flex items-center gap-2 whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border ${activeCategory === cat
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg dark:bg-blue-600 dark:text-white dark:border-blue-500 dark:shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                }`}
            >
              {cat === 'All' ? <LayoutGrid className="w-4 h-4" /> : <Trophy className="w-4 h-4" />}
              {cat}
            </button>
          ))}
        </div>

        {/* 🍿 Cinematic Video Player */}
        {activeMatch && (
          <section className="animate-fade-in-down scroll-mt-24" ref={playerRef}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 px-2">
              <div>
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-4 text-slate-900 dark:text-white">
                  <TeamLogo name={activeMatch.team_a} logoUrl={activeMatch.team_a_logo} />
                  {activeMatch.team_a || 'Team A'}
                  <span className="text-slate-300 dark:text-slate-700 font-black px-2 text-xl italic">VS</span>
                  {activeMatch.team_b || 'Team B'}
                  <TeamLogo name={activeMatch.team_b} logoUrl={activeMatch.team_b_logo} />
                </h2>
                <div className="flex items-center gap-3 mt-4">
                  <span className="px-3 py-1 rounded-md text-xs font-bold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse"></span> {activeMatch.status === 'LIVE' ? 'LIVE BROADCAST' : 'UPCOMING'}
                  </span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">
                    {activeMatch.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setTimeout(() => setActiveMatch(null), 150);
                }}
                className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 transition-all bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-transparent"
              >
                <X className="w-4 h-4" /> Close Player
              </button>
            </div>

            <div className="relative aspect-video w-full max-w-6xl bg-[#030303] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/50 dark:border-slate-800 ring-4 ring-slate-100 dark:ring-slate-900/50">
              {!playerReady && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505] text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mb-5" />
                  <p className="font-bold tracking-[0.3em] text-xs animate-pulse text-slate-400">DECRYPTING SECURE STREAM...</p>
                </div>
              )}
              <ReactPlayer
                url={activeMatch.url}
                width="100%"
                height="100%"
                controls={true}
                playing={true}
                onReady={() => setPlayerReady(true)}
                onError={() => {
                  toast.error('Stream playback failed. Server might be strictly protected.');
                  setPlayerReady(true);
                }}
                config={{ file: { forceHLS: true } }}
                className="relative z-20"
              />
            </div>
          </section>
        )}

        {/* 📊 Main Dashboard Area */}
        <section className={`transition-opacity duration-500 ${activeMatch ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing Enterprise Database...</p>
            </div>
          ) : (
            <div className="space-y-16 mt-4">

              {/* --- LIVE NOW SECTION --- */}
              {liveMatches.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6 px-2">
                    <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-slate-900 dark:text-white tracking-tight">
                      <Activity className="text-red-500 w-8 h-8 animate-pulse" /> Live Now
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-red-200 dark:from-red-900/50 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                    {liveMatches.map((match) => <MatchCard key={match.id} match={match} onPlay={handlePlayStream} />)}
                  </div>
                </div>
              )}

              {/* --- UPCOMING SCHEDULE SECTION --- */}
              {Object.keys(groupedUpcoming).length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8 px-2">
                    <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-slate-900 dark:text-white tracking-tight">
                      <Zap className="text-amber-500 w-8 h-8" /> Upcoming Fixtures
                    </h2>
                  </div>

                  <div className="space-y-12">
                    {Object.keys(groupedUpcoming).map((date) => (
                      <div key={date}>
                        <div className="flex items-center gap-4 mb-6 px-2">
                          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-5 py-2.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            {date === 'TBA' ? 'Dates To Be Announced' : new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                          </h3>
                          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                          {groupedUpcoming[date].map((match) => <MatchCard key={match.id} match={match} onPlay={handlePlayStream} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Premium Empty State --- */}
              {filteredServers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 rounded-[40px] mx-2">
                  <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                    <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">No {activeCategory !== 'All' ? activeCategory : ''} Matches Right Now</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md text-lg">Our scouts are looking for new streams. Please check back later for live action.</p>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="mt-8 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105"
                  >
                    Explore All Sports
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

// Reusable Premium Match Card
const MatchCard = ({ match, onPlay }) => {
  const hasStreamUrl = match.url && match.url.trim() !== '';

  return (
    <div className="group relative flex flex-col bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] hover:border-blue-200 dark:hover:border-slate-600 transition-all duration-300 overflow-hidden transform hover:-translate-y-1">

      {/* Card Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 transition-colors">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{match.category || 'Football'}</span>
        {match.status === 'LIVE' ? (
          <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1.5 rounded-md border border-red-100 dark:border-red-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 animate-pulse"></span> LIVE
          </span>
        ) : (
          <MatchCountdown date={match.match_date} time={match.match_time} />
        )}
      </div>

      {/* Versus Arena */}
      <div className="flex justify-between items-center px-6 py-10 transition-colors">
        <div className="flex flex-col items-center gap-3 w-[40%]">
          <TeamLogo name={match.team_a} logoUrl={match.team_a_logo} />
          <span className="text-sm font-bold text-center line-clamp-1 text-slate-800 dark:text-slate-200">{match.team_a || 'TBA'}</span>
        </div>

        <div className="flex flex-col items-center justify-center w-[20%]">
          {match.status === 'LIVE' || match.status === 'FINISHED' ? (
            <div className="bg-slate-100 dark:bg-slate-800 text-xl font-black px-4 py-2 rounded-xl text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 shadow-inner">
              {match.score_a || 0} - {match.score_b || 0}
            </div>
          ) : (
            <span className="text-xs font-black text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">VS</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-3 w-[40%]">
          <TeamLogo name={match.team_b} logoUrl={match.team_b_logo} />
          <span className="text-sm font-bold text-center line-clamp-1 text-slate-800 dark:text-slate-200">{match.team_b || 'TBA'}</span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center mt-auto transition-colors">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
          {match.match_time || 'TBA'}
        </div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[120px]" title={match.name}>{match.name}</span>
      </div>

      {/* Hover Action Overlay */}
      <div
        onClick={() => onPlay(match)}
        className="absolute inset-0 z-30 cursor-pointer bg-white/0 hover:bg-slate-900/5 dark:hover:bg-black/40 transition-colors flex flex-col justify-center items-center backdrop-blur-[0px] hover:backdrop-blur-[2px]"
      >
        <div className={`flex items-center gap-2 font-bold text-sm px-6 py-3.5 rounded-full shadow-2xl transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 dark:border dark:border-white/10 ${hasStreamUrl
          ? 'text-white bg-blue-600 dark:bg-blue-600/90'
          : 'text-slate-700 bg-white dark:text-white dark:bg-slate-800/90'
          }`}>
          {hasStreamUrl ? (
            <>
              <PlayCircle className="w-5 h-5" /> {match.status === 'LIVE' ? 'Watch Broadcast' : 'View Details'}
            </>
          ) : (
            <>
              <EyeOff className="w-5 h-5 text-slate-400" /> Live Score Only
            </>
          )}
        </div>
      </div>
    </div>
  );
}