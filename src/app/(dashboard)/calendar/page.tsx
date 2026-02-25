"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// Configuration for UTC Session Times
interface SessionConfig {
    name: string;
    startUTC: number; // 0-23
    endUTC: number;   // 0-23
    icon: string;
}

const sessionsConfig: SessionConfig[] = [
    { name: "Sydney", startUTC: 22, endUTC: 7, icon: "🇦🇺" },
    { name: "Tokyo", startUTC: 0, endUTC: 9, icon: "🇯🇵" },
    { name: "London", startUTC: 8, endUTC: 17, icon: "🇬🇧" },
    { name: "New York", startUTC: 13, endUTC: 22, icon: "🇺🇸" }
];

// Helper to calculate exact countdowns using generic UTC timing
const getSessionInfo = (config: SessionConfig, now: Date) => {
    const currentUTCHour = now.getUTCHours();
    const currentUTCMin = now.getUTCMinutes();
    const currentUTCSec = now.getUTCSeconds();
    const currentTimeInSeconds = currentUTCHour * 3600 + currentUTCMin * 60 + currentUTCSec;

    const startInSeconds = config.startUTC * 3600;
    const endInSeconds = config.endUTC * 3600;

    let isOpen = false;

    if (startInSeconds < endInSeconds) {
        isOpen = currentTimeInSeconds >= startInSeconds && currentTimeInSeconds < endInSeconds;
    } else {
        // Crosses midnight UTC (e.g., Sydney 22:00 to 07:00)
        isOpen = currentTimeInSeconds >= startInSeconds || currentTimeInSeconds < endInSeconds;
    }

    let targetTimeInSeconds = 0;

    if (isOpen) {
        if (startInSeconds < endInSeconds || currentTimeInSeconds < endInSeconds) {
            targetTimeInSeconds = endInSeconds;
        } else {
            targetTimeInSeconds = endInSeconds + 24 * 3600;
        }
    } else {
        if (currentTimeInSeconds < startInSeconds) {
            targetTimeInSeconds = startInSeconds;
        } else {
            targetTimeInSeconds = startInSeconds + 24 * 3600;
        }
    }

    const diffSeconds = targetTimeInSeconds - currentTimeInSeconds;
    const hours = Math.floor(diffSeconds / 3600);
    const mins = Math.floor((diffSeconds % 3600) / 60);
    const secs = diffSeconds % 60;

    const formattedTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const sessionDuration = (endInSeconds < startInSeconds ? endInSeconds + 24 * 3600 - startInSeconds : endInSeconds - startInSeconds);
    const closedDuration = 24 * 3600 - sessionDuration;

    let progress = 0; // 0 to 100
    if (isOpen) {
        const elapsed = sessionDuration - diffSeconds;
        progress = (elapsed / sessionDuration) * 100;
    } else {
        const elapsed = closedDuration - diffSeconds;
        progress = (elapsed / closedDuration) * 100;
    }

    const is15MinWarning = !isOpen && diffSeconds <= 15 * 60;

    return {
        ...config,
        isOpen,
        formattedTime,
        progress,
        is15MinWarning
    };
};

const ProgressRing = ({ progress, active, isWarning }: { progress: number, active: boolean, isWarning: boolean }) => {
    const radius = 8;
    const circumference = 2 * Math.PI * radius;
    // Limit progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    const color = active ? "#00ff41" : isWarning ? "#f97316" : "#4b5563";

    return (
        <div className="relative flex items-center justify-center w-6 h-6">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
                <circle
                    className="text-gray-800"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="12"
                    cy="12"
                />
                <circle
                    className="transition-all duration-1000 ease-linear"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="12"
                    cy="12"
                />
            </svg>
            <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-[#00ff41] animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" :
                    isWarning ? "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]" :
                        "bg-gray-600"
                }`} />
        </div>
    );
};

const MarketSessionWidget = () => {
    // Only hydrate on client to prevent initial server render mismatch with local time bounds
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!currentTime) return <div className="h-[90px] mb-8"></div>;

    const sessionData = sessionsConfig.map(config => getSessionInfo(config, currentTime));

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {sessionData.map((s) => (
                <div key={s.name} className={`px-5 py-4 flex flex-col justify-between rounded-xl border backdrop-blur-md transition-all ${s.isOpen
                        ? "bg-[#00ff41]/5 border-[#00ff41]/30 shadow-[0_0_15px_rgba(0,255,65,0.05)]"
                        : s.is15MinWarning
                            ? "bg-orange-500/5 border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.05)]"
                            : "bg-[#0B0E11]/80 border-gray-800"
                    }`}>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{s.icon}</span>
                            <h3 className="text-white font-bold">{s.name}</h3>
                        </div>
                        <ProgressRing progress={s.progress} active={s.isOpen} isWarning={s.is15MinWarning} />
                    </div>

                    <div className="space-y-1">
                        <p className={`text-[10px] uppercase font-bold tracking-wider ${s.isOpen ? "text-[#00ff41]" : s.is15MinWarning ? "text-orange-500" : "text-gray-500"
                            }`}>
                            {s.isOpen ? "Session Ends:" : "Volatility Inbound:"}
                        </p>
                        <p className={`text-xl font-mono tracking-tight font-bold ${s.isOpen
                                ? "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]"
                                : s.is15MinWarning
                                    ? "text-orange-500 animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                    : "text-gray-400"
                            }`}>
                            {s.formattedTime}
                        </p>
                    </div>
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
