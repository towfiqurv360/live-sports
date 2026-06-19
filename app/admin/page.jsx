'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // আপনার Supabase ক্লায়েন্ট পাথ
import { ShieldAlert, Save } from 'lucide-react';

export default function SuperAdmin() {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [category, setCategory] = useState('Football');

    const handleAddServer = async (e) => {
        e.preventDefault();
        const { error } = await supabase
            .from('stream_servers')
            .insert([{ name, url, category }]); // ডাটাবেসে category কলামটি যোগ করে নেবেন

        if (error) alert('Error adding server: ' + error.message);
        else {
            alert('✅ সার্ভার সফলভাবে যুক্ত হয়েছে!');
            setName(''); setUrl('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white p-8 flex justify-center items-center">
            <div className="max-w-md w-full bg-white dark:bg-[#1e293b] rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                    <ShieldAlert className="text-red-500 w-8 h-8" />
                    <h1 className="text-2xl font-bold">Super Admin</h1>
                </div>

                <form onSubmit={handleAddServer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Server Name</label>
                        <input required value={name} onChange={(e) => setName(e.target.value)} type="text" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Premium Server 1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stream URL (m3u8)</label>
                        <input required value={url} onChange={(e) => setUrl(e.target.value)} type="url" className="w-full p-3 rounded-lg bg-gray-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 rounded-lg bg-gray-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500">
                            <option>Football</option>
                            <option>Cricket</option>
                            <option>News</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all">
                        <Save className="w-5 h-5" /> Deploy Server
                    </button>
                </form>
            </div>
        </div>
    );
}