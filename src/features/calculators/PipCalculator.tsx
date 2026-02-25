"use client";

import { useState } from "react";
import { Target } from "lucide-react";

export default function PipCalculator() {
    const [exchangeRate, setExchangeRate] = useState("1.1000"); // E.g., EUR/USD
    const [tradeSize, setTradeSize] = useState("100000"); // 1 Standard Lot
    const [pipSize, setPipSize] = useState("0.0001"); // Standard forex pair pip size

    const calculatePipValue = () => {
        const rate = parseFloat(exchangeRate);
        const units = parseFloat(tradeSize);
        const pip = parseFloat(pipSize);

        if (isNaN(rate) || isNaN(units) || isNaN(pip) || rate <= 0) return "0.00";

        // Pip Value = (One Pip / Exchange Rate) * Lot Size
        // Assuming base currency account for simplicity
        const value = (pip / rate) * units;
        return value.toFixed(2);
    };

    return (
        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41]">
                        <Target size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Pip Value Calculator</h2>
                        <p className="text-sm text-gray-500">Calculate exact value per pip</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Exchange Rate</label>
                        <input
                            type="number"
                            value={exchangeRate}
                            onChange={(e) => setExchangeRate(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Trade Size (Units)</label>
                        <input
                            type="number"
                            value={tradeSize}
                            onChange={(e) => setTradeSize(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400">Pip Size</label>
                    <select
                        value={pipSize}
                        onChange={(e) => setPipSize(e.target.value)}
                        className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                    >
                        <option value="0.0001">Standard Forex (0.0001)</option>
                        <option value="0.01">JPY Pairs (0.01)</option>
                        <option value="1">Indices / Gold (1.0)</option>
                    </select>
                </div>

                <div className="p-6 rounded-xl bg-[#00ff41]/5 border border-[#00ff41]/20 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Value per Pip</span>
                    <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold font-mono text-white pt-1">
                            ${calculatePipValue()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
