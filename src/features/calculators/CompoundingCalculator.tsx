"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

export default function CompoundingCalculator() {
    const [startingBalance, setStartingBalance] = useState("1000");
    const [gainPerPeriod, setGainPerPeriod] = useState("5"); // Percentage
    const [numPeriods, setNumPeriods] = useState("12");

    const calculateCompounding = () => {
        const principal = parseFloat(startingBalance);
        const rate = parseFloat(gainPerPeriod) / 100;
        const periods = parseFloat(numPeriods);

        if (isNaN(principal) || isNaN(rate) || isNaN(periods) || periods <= 0) return { final: "0.00", profit: "0.00" };

        const finalBalance = principal * Math.pow(1 + rate, periods);
        const totalProfit = finalBalance - principal;

        return {
            final: finalBalance.toFixed(2),
            profit: totalProfit.toFixed(2)
        };
    };

    const results = calculateCompounding();

    return (
        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41]">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Compounding Calculator</h2>
                        <p className="text-sm text-gray-500">Project exponential account growth</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Starting Balance ($)</label>
                        <input
                            type="number"
                            value={startingBalance}
                            onChange={(e) => setStartingBalance(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Gain per Period (%)</label>
                            <input
                                type="number"
                                value={gainPerPeriod}
                                onChange={(e) => setGainPerPeriod(e.target.value)}
                                className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-400">Number of Periods</label>
                            <input
                                type="number"
                                value={numPeriods}
                                onChange={(e) => setNumPeriods(e.target.value)}
                                className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                            />
                            <p className="text-xs text-gray-500">Ex: 12 months, 50 trades</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 flex flex-col gap-2">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Total Profit</span>
                        <span className="text-2xl font-bold font-mono text-[#00ff41]">
                            +${results.profit}
                        </span>
                    </div>
                    <div className="p-6 rounded-xl bg-[#00ff41]/5 border border-[#00ff41]/20 flex flex-col gap-2 relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 opacity-5 text-[#00ff41]">
                            <TrendingUp size={100} />
                        </div>
                        <span className="text-[#00ff41] font-bold uppercase tracking-wider text-xs z-10">Ending Balance</span>
                        <span className="text-3xl font-bold font-mono text-white drop-shadow-[0_0_15px_rgba(0,255,65,0.3)] z-10">
                            ${results.final}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
