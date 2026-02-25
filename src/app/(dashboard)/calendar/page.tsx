"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// Helper for Session Widget
const checkSession = (startHour: number, endHour: number, currentHour: number) => {
    if (startHour < endHour) {
        return currentHour >= startHour && currentHour < endHour;
    } else {
        // Crosses midnight
        return currentHour >= startHour || currentHour < endHour;
    }
};

const MarketSessionWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get current time in GMT+5:30 (Sri Lanka)
    const sltString = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    }).format(currentTime);

    const [h] = sltString.split(':').map(Number);
    const hours = h; // 0-23

    // Sydney: 05:30 - 14:30 SLT
    // Tokyo: 06:30 - 15:30 SLT
    // London: 13:30 - 22:30 SLT
    // New York: 18:30 - 03:30 SLT

    const sessions = [
        { name: "Sydney", active: checkSession(5, 14, hours), icon: "🇦🇺" },
        { name: "Tokyo", active: checkSession(6, 15, hours), icon: "🇯🇵" },
        { name: "London", active: checkSession(13, 22, hours), icon: "🇬🇧" },
        { name: "New York", active: checkSession(18, 3, hours), icon: "🇺🇸" }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {sessions.map((s) => (
                <div key={s.name} className={`p-4 rounded-xl border backdrop-blur-md transition-all ${s.active
                        ? "bg-[#00ff41]/10 border-[#00ff41]/40 shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                        : "bg-[#0B0E11]/80 border-gray-800"
                    }`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xl">{s.icon}</span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${s.active ? "bg-[#00ff41] animate-pulse" : "bg-gray-600"}`} />
                            <span className={`text-xs font-bold uppercase tracking-wider ${s.active ? "text-[#00ff41]" : "text-gray-500"}`}>
                                {s.active ? "Open" : "Closed"}
                            </span>
                        </div>
                    </div>
                    <h3 className="text-white font-bold">{s.name} Session</h3>
                </div>
            ))}
        </div>
    );
};

export default function MarketHubPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Market Hub</h1>
                    <p className="text-gray-400">Live sessions and global economic calendar.</p>
                </div>
            </div>

            <MarketSessionWidget />

            <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/50 flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF]">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Economic Data</h2>
                            <p className="text-sm text-gray-500">Powered by Myfxbook</p>
                        </div>
                    </div>
                </div>

                <div className="w-full relative bg-[#0B0E11]">
                    {/* The Myfxbook widget is usually light mode. 
                        We apply 'invert hue-rotate-180' to perfectly flip it to a Dark Mode,
                        while preserving the color hues (red stays red, green stays green). */}
                    <div className="relative w-full h-[800px] overflow-hidden filter invert hue-rotate-180 contrast-90 opacity-90 transition-all">
                        <iframe
                            src="https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=0,1,2,3&symbols=AUD,CAD,CHF,CNY,EUR,GBP,JPY,NZD,USD"
                            style={{ border: 0, width: "100%", height: "100%" }}
                            title="Myfxbook Economic Calendar"
                        />
                    </div>

                    {/* Subtle Overlay to blend the iFrame slightly into our Neon theme without breaking clicks */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0B0E11]/10 to-[#0B0E11]/20"></div>

                    {/* Footer provided by user */}
                    <div className="p-3 bg-[#11151a] text-center border-t border-gray-800">
                        <div className="font-sans text-xs text-gray-500">
                            <a href="https://www.myfxbook.com/forex-economic-calendar?utm_source=widget13&utm_medium=link&utm_campaign=copyright" title="Economic Calendar" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                                <b className="text-[#007BFF]">Economic Calendar</b>
                            </a>
                            {' '}by Myfxbook.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
