"use client";

import { useState } from "react";
import { RefreshCw, ArrowRightLeft } from "lucide-react";

export default function CurrencyConverter() {
    const [amount, setAmount] = useState("1000");
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [quoteCurrency, setQuoteCurrency] = useState("EUR");

    const [rate, setRate] = useState<number | null>(0.92); // Mock initial fallback
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commonCurrencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD"];

    const fetchRate = async () => {
        if (!baseCurrency || !quoteCurrency) return;
        setLoading(true);
        setError(null);

        try {
            const symbol = `${baseCurrency}/${quoteCurrency}`;
            const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;

            if (!apiKey) {
                throw new Error("API Key missing"); // Local fallback logic relies on throwing here or returning mock if needed, but we prefer checking.
            }

            const res = await fetch(`https://api.twelvedata.com/exchange_rate?symbol=${symbol}&apikey=${apiKey}`);
            const data = await res.json();

            if (data.rate) {
                setRate(parseFloat(data.rate));
            } else if (data.message) {
                throw new Error(data.message);
            } else {
                throw new Error("Invalid response");
            }
        } catch (err: any) {
            console.error("Currency Fetch Error", err);
            setError(err.message || "Failed to fetch live rate.");
        } finally {
            setLoading(false);
        }
    };

    const handleSwap = () => {
        setBaseCurrency(quoteCurrency);
        setQuoteCurrency(baseCurrency);
        // Force refresh
        setTimeout(fetchRate, 100);
    };

    const amt = parseFloat(amount);
    const finalAmount = !isNaN(amt) && rate !== null ? (amt * rate).toFixed(2) : "0.00";

    return (
        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF]">
                        <RefreshCw size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Live Currency Converter</h2>
                        <p className="text-sm text-gray-500">Real-time exchange rates (Twelve Data)</p>
                    </div>
                </div>

                <button
                    onClick={fetchRate}
                    disabled={loading}
                    className="p-2 bg-[#161B22] border border-gray-800 rounded-lg hover:border-[#007BFF]/50 hover:text-[#007BFF] transition-all disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin text-[#007BFF]" : ""} />
                </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400">Amount</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-4 text-2xl text-white focus:outline-none focus:border-[#007BFF]/50 focus:ring-1 focus:ring-[#007BFF]/50 transition-all font-mono"
                    />
                </div>

                <div className="flex items-center gap-4 py-4">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-bold text-gray-400">From</label>
                        <select
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none font-bold"
                        >
                            {commonCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={handleSwap}
                            className="p-3 bg-gray-900 border border-gray-800 rounded-full hover:bg-gray-800 hover:border-[#007BFF]/50 text-gray-400 hover:text-[#007BFF] transition-all"
                        >
                            <ArrowRightLeft size={20} />
                        </button>
                    </div>

                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-bold text-gray-400">To</label>
                        <select
                            value={quoteCurrency}
                            onChange={(e) => setQuoteCurrency(e.target.value)}
                            className="w-full bg-[#161B22] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none font-bold"
                        >
                            {commonCurrencies.filter(c => c !== baseCurrency).map(c => <option key={c} value={c}>{c}</option>)}
                            {/* Ensure quote currency is selectable if swap happened */}
                            {!commonCurrencies.filter(c => c !== baseCurrency).includes(quoteCurrency) && <option value={quoteCurrency}>{quoteCurrency}</option>}
                        </select>
                    </div>
                </div>

                {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">{error}</div>}

                <div className="p-6 rounded-xl bg-[#007BFF]/5 border border-[#007BFF]/20 flex flex-col items-center justify-center gap-2 mt-4 text-center">
                    <span className="text-gray-400 font-bold uppercase tracking-wider text-sm flex gap-2">
                        {amt} {baseCurrency} =
                    </span>
                    <span className="text-5xl font-bold font-mono text-white drop-shadow-[0_0_15px_rgba(0,123,255,0.3)] break-all">
                        {finalAmount} <span className="text-2xl text-[#007BFF]">{quoteCurrency}</span>
                    </span>
                    <span className="text-xs text-gray-500 mt-2">
                        Rate: 1 {baseCurrency} = {rate} {quoteCurrency}
                    </span>
                </div>
            </div>
        </div>
    );
}
