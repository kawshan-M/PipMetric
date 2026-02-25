"use client";

import { useState } from "react";
import { DollarSign } from "lucide-react";

export default function ProfitCalculator() {
    const [openPrice, setOpenPrice] = useState("1.1000");
    const [closePrice, setClosePrice] = useState("1.1050");
    const [tradeSize, setTradeSize] = useState("100000"); // Units
    const [position, setPosition] = useState<"Long" | "Short">("Long");

    const calculateProfit = () => {
        const open = parseFloat(openPrice);
        const close = parseFloat(closePrice);
        const units = parseFloat(tradeSize);

        if (isNaN(open) || isNaN(close) || isNaN(units) || units <= 0) return "0.00";

        let profit = 0;
        if (position === "Long") {
            profit = (close - open) * units;
        } else {
            profit = (open - close) * units;
        }

        return profit.toFixed(2);
    };

    const pnl = parseFloat(calculateProfit());
    const isProfit = pnl >= 0;

    return (
        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41]">
                        <DollarSign size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Profit & Loss Calculator</h2>
                        <p className="text-sm text-gray-500">Estimate trade outcome</p>
                    </div>
                </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="flex bg-[#161B22] p-1 rounded-xl border border-gray-800">
                    <button
                        onClick={() => setPosition("Long")}
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-all ${position === "Long" ? "bg-[#00ff41]/20 text-[#00ff41]" : "text-gray-500 hover:text-white"
                            }`}
                    >
                        Long (Buy)
                    </button>
                    <button
                        onClick={() => setPosition("Short")}
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-lg transition-all ${position === "Short" ? "bg-red-500/20 text-red-500" : "text-gray-500 hover:text-white"
                            }`}
                    >
                        Short (Sell)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Open Price</label>
                        <input
                            type="number"
                            value={openPrice}
                            onChange={(e) => setOpenPrice(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-400">Close Price</label>
                        <input
                            type="number"
                            value={closePrice}
                            onChange={(e) => setClosePrice(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff41]/50 focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono"
                        />
                    </div>
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

                <div className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-2 mt-8 ${isProfit ? "bg-[#00ff41]/5 border-[#00ff41]/20" : "bg-red-500/5 border-red-500/20"
                    }`}>
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Estimated P&L</span>
                    <span className={`text-5xl font-bold font-mono ${isProfit ? "text-[#00ff41] drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]" : "text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        }`}>
                        {isProfit ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
}
