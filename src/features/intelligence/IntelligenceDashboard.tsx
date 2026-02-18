"use client";

import { useEffect, useState } from "react";
import { aiService, SentimentData, AssetSentiment } from "@/services/aiService";
import SentimentGauge from "./components/SentimentGauge";
import MarketBrief from "./components/MarketBrief";
import TopAssetsList from "./components/TopAssetsList";
import { RefreshCw, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function IntelligenceDashboard() {
    const [sentiment, setSentiment] = useState<SentimentData | null>(null);
    const [assets, setAssets] = useState<AssetSentiment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [marketData, assetData] = await Promise.all([
                aiService.getMarketSentiment(),
                aiService.getAssetSentiments(),
            ]);
            setSentiment(marketData);
            setAssets(assetData);
        } catch (err) {
            console.error("Failed to fetch intelligence data:", err);
            setError("Failed to load market intelligence. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Run diagnostics once on mount
        aiService.checkModelAccess();
        fetchData();
    }, []);

    const isLive = sentiment?.isLive ?? false;
    const configMissing = sentiment?.configMissing ?? false;
    const score = sentiment?.score ?? 0;

    // Dynamic Glow based on sentiment
    const glowColor = score > 0 ? "rgba(34, 197, 94, 0.5)" : score < 0 ? "rgba(239, 68, 68, 0.5)" : "rgba(168, 85, 247, 0.5)";
    const glowStyle = { boxShadow: `0 0 40px -10px ${glowColor}` };

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Market Intelligence</h1>
                    <p className="text-gray-400">Real-time AI-powered market sentiment analysis</p>

                    {configMissing ? (
                        <div className="mt-2 text-xs font-mono px-3 py-1 rounded-full inline-block text-red-300 bg-red-900/30 border border-red-500/30">
                            ⚠ Configuration Required
                        </div>
                    ) : (
                        <div className={`mt-2 text-xs font-mono px-3 py-1 rounded-full inline-block border ${isLive
                            ? "text-green-300 bg-green-900/30 border-green-500/30"
                            : "text-amber-300 bg-amber-900/30 border-amber-500/30"
                            }`}>
                            {isLive
                                ? "● System Online"
                                : "○ Live AI Unavailable (Simulated)"
                            }
                        </div>
                    )}
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-blue-400 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-md"
                >
                    <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    <span>{loading ? "Analyzing..." : "Refresh Insight"}</span>
                </button>
            </div>

            {loading && !sentiment && !error && (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <p className="text-gray-400 animate-pulse">Initializing Intelligent Analysis...</p>
                </div>
            )}

            {configMissing && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-300 backdrop-blur-sm">
                    <AlertCircle size={20} />
                    <div>
                        <p className="font-bold">Configuration Error</p>
                        <p className="text-sm">Please ensure <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY</code> is set in your environment variables.</p>
                    </div>
                </div>
            )}

            {error && !configMissing && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-300 backdrop-blur-sm">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {!error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Sentiment Gauge Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-1 p-1 rounded-3xl transition-shadow duration-700"
                        style={glowStyle}
                    >
                        <div className="bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl h-full p-6 shadow-2xl">
                            <SentimentGauge score={score} />
                        </div>
                    </motion.div>

                    {/* Market Brief Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-[#121212]/60 backdrop-blur-lg border border-white/10 rounded-3xl h-full p-6 shadow-lg hover:bg-[#121212]/80 transition-colors">
                            <MarketBrief summary={sentiment?.summary ?? ""} />
                        </div>
                    </motion.div>

                    {/* Top Assets List Section - Full width on mobile/tablet, span 3 on large if needed or just arrange nicely */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-[#121212]/60 backdrop-blur-lg border border-white/10 rounded-3xl p-6 shadow-lg">
                            <TopAssetsList assets={assets} />
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
