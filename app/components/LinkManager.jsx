'use client';
import { useState, useEffect } from 'react';

export default function LinkManager() {
    const [links, setLinks] = useState(["", "", ""]);

    // লোড করার সময় সেভ করা লিংকগুলো আনবে
    useEffect(() => {
        const saved = localStorage.getItem('myStreamLinks');
        if (saved) setLinks(JSON.parse(saved));
    }, []);

    const handleSave = () => {
        localStorage.setItem('myStreamLinks', JSON.stringify(links));
        alert("লিংকগুলো সেভ হয়েছে! এখন প্লেয়ার পেজে যান।");
    };

    return (
        <div className="p-8 bg-slate-900 min-h-screen text-white">
            <h2 className="text-2xl mb-6">স্ট্রিম লিংক আপডেট করুন</h2>
            {links.map((link, i) => (
                <input
                    key={i}
                    className="w-full p-3 mb-4 bg-slate-800 rounded border border-slate-700"
                    placeholder={`Server ${i + 1} URL`}
                    value={link}
                    onChange={(e) => {
                        const newLinks = [...links];
                        newLinks[i] = e.target.value;
                        setLinks(newLinks);
                    }}
                />
            ))}
            <button onClick={handleSave} className="bg-blue-600 px-6 py-2 rounded">
                সব লিংক সেভ করুন
            </button>
        </div>
    );
}