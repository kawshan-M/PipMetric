import React from "react";
import { Plus } from "lucide-react";

export default function QuickActions({ onOpenTradeModal }: { onOpenTradeModal?: () => void }) {
    return (
        <div className="flex flex-col gap-6 w-[280px] shrink-0">
            {/* Quick Actions Card */}
            <div className="bg-[#121418] border border-gray-800/60 rounded-xl p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-4 tracking-tight">
                    Quick Actions
                </h2>

                <div className="w-full h-[1px] bg-gray-800/60 mb-4"></div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onOpenTradeModal}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-transparent border border-gray-700/60 hover:bg-white/5 rounded-lg text-sm font-bold text-gray-300 transition-colors group"
                    >
                        <Plus className="w-5 h-5 text-green-500 group-hover:text-green-400" />
                        TRADE ENTRY
                    </button>
                    <button className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-transparent border border-gray-700/60 hover:bg-white/5 rounded-lg text-sm font-bold text-gray-300 transition-colors group">
                        <Plus className="w-5 h-5 text-green-500 group-hover:text-green-400" />
                        DAILY REVIEW
                    </button>
                </div>
            </div>

            {/* Performance Profile Placeholder Area */}
            <div className="bg-[#121418] border border-gray-800/60 rounded-xl p-5 shadow-sm flex-1 min-h-[400px] flex flex-col items-center justify-center opacity-50">
                <span className="text-sm font-semibold text-gray-500 tracking-wider">Performance Profile</span>
                <span className="text-xs text-gray-600 mt-2">Win Rate</span>
            </div>
        </div>
    );
}
