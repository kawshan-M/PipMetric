
"use client";

import { Wallet, Menu } from "lucide-react";

export default function Topbar() {
    return (
        <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-[#0B0E11]/80 backdrop-blur-md border-b border-gray-800 z-30 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 md:hidden">
                <button className="p-2 text-gray-400 hover:text-white">
                    <Menu size={24} />
                </button>
                <span className="text-xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent">
                    PipMetric
                </span>
            </div>

            <div className="hidden md:block">
                {/* Breadcrumbs or Page Title could go here */}
                <div className="text-sm text-gray-400">
                    <span className="text-gray-600">Overview /</span> Dashboard
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-400">Market Open</span>
                </div>

                <button className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-[#007BFF]/20">
                    <Wallet size={16} />
                    Connect Wallet
                </button>
            </div>
        </header>
    );
}
