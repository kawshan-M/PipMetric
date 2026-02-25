"use client";

import { useState } from "react";
import { Percent, ArrowRight } from "lucide-react";

export default function MarginCalculator() {
    const [assetPrice, setAssetPrice] = useState("1.1000");
    const [tradeSize, setTradeSize] = useState("100000"); // Standard Lot
    const [leverage, setLeverage] = useState("100"); // 1:100

    const calculateMargin = () => {
        const price = parseFloat(assetPrice);
        const units = parseFloat(tradeSize);
        const lev = parseFloat(leverage);

        if (isNaN(price) || isNaN(units) || isNaN(lev) || lev <= 0) return "0.00";
        return ((units * price) / lev).toFixed(2);
    };

    return (
        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                        <Percent size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Margin Calculator</h2>
                        <p className="text-sm text-gray-500">Required deposit to open trade</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Asset Price</label>
                        <input
                            type="number"
                            value={assetPrice}
                            onChange={(e) => setAssetPrice(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Trade Size (Units)</label>
                        <input
                            type="number"
                            value={tradeSize}
                            onChange={(e) => setTradeSize(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                        />
                        <p className="text-xs text-gray-500">Ex: 100,000 for 1 Standard Lot</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400">Leverage (1:X)</label>
                    <input
                        type="number"
                        value={leverage}
                        onChange={(e) => setLeverage(e.target.value)}
                        className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-mono"
                    />
                </div>

                <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Required Margin</span>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold font-mono text-white text-shadow-neon-red drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            ${calculateMargin()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
