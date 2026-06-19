'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShieldAlert, Save, Tv, CalendarClock, Swords, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function SuperAdmin() {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        url: '',
        category: 'Football',
        status: 'UPCOMING',
        match_date: '',
        match_time: '',
        team_a: '',
        team_a_logo: '',
        score_a: 0,
        team_b: '',
        team_b_logo: '',
        score_b: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddServer = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { error } = await supabase
            .from('stream_servers')
            .insert([formData]);

        if (error) {
            toast.error('Error adding server: ' + error.message);
        } else {
            toast.success('✅ Match successfully deployed to live server!');
            // ফর্ম রিসেট
            setFormData({
                name: '', url: '', category: 'Football', status: 'UPCOMING',
                match_date: '', match_time: '', team_a: '', team_a_logo: '', score_a: 0,
                team_b: '', team_b_logo: '', score_b: 0,
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f18] text-slate-900 dark:text-slate-200 p-4 md:p-8 flex justify-center items-start">
            <Toaster position="top-center" toastOptions={{ className: 'dark:bg-[#1e293b] dark:text-white font-medium' }} />

            <div className="max-w-4xl w-full bg-white dark:bg-[#111827] rounded-[32px] shadow-2xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 mt-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
                            <ShieldAlert className="text-red-500 w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Control Panel</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Super Admin Access</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleAddServer} className="space-y-8">

                    {/* --- Section 1: Basic Info --- */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-blue-600 dark:text-blue-400"><Tv className="w-5 h-5" /> Stream Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Server / Match Name</label>
                                <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g., El Clasico Live HD" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Stream URL (m3u8)</label>
                                <input name="url" value={formData.url} onChange={handleChange} type="url" className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Optional for Live Score only" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold">
                                    <option>Football</option>
                                    <option>Cricket</option>
                                    <option>Basketball</option>
                                    <option>eSports</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Live Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-blue-600 dark:text-blue-400">
                                    <option value="UPCOMING">🚀 UPCOMING</option>
                                    <option value="LIVE">🔴 LIVE NOW</option>
                                    <option value="FINISHED">✅ FINISHED</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- Section 2: Match Schedule --- */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-amber-600 dark:text-amber-500"><CalendarClock className="w-5 h-5" /> Schedule (For Upcoming Matches)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Match Date</label>
                                <input name="match_date" value={formData.match_date} onChange={handleChange} type="date" className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Match Time</label>
                                <input name="match_time" value={formData.match_time} onChange={handleChange} type="time" className="w-full p-3.5 rounded-xl bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    {/* --- Section 3: Teams & Scores --- */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h2 className="flex items-center gap-2 text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-500"><Swords className="w-5 h-5" /> Teams & Live Score</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Team A */}
                            <div className="space-y-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team A Name</label>
                                    <input name="team_a" value={formData.team_a} onChange={handleChange} type="text" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Real Madrid" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team A Logo (URL)</label>
                                    <input name="team_a_logo" value={formData.team_a_logo} onChange={handleChange} type="url" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team A Score</label>
                                    <input name="score_a" value={formData.score_a} onChange={handleChange} type="number" min="0" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-black text-xl" />
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="space-y-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team B Name</label>
                                    <input name="team_b" value={formData.team_b} onChange={handleChange} type="text" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Barcelona" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team B Logo (URL)</label>
                                    <input name="team_b_logo" value={formData.team_b_logo} onChange={handleChange} type="url" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1.5 text-slate-700 dark:text-slate-300">Team B Score</label>
                                    <input name="score_b" value={formData.score_b} onChange={handleChange} type="number" min="0" className="w-full p-3 rounded-lg bg-white dark:bg-[#0a0f18] border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-black text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button disabled={isLoading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white p-4 rounded-xl font-black text-lg flex justify-center items-center gap-3 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1">
                        {isLoading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-6 h-6" />}
                        {isLoading ? 'Deploying to Server...' : 'Deploy Match Data'}
                    </button>
                </form>
            </div>
        </div>
    );
}