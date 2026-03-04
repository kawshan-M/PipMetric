"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, ArrowRight, Share2, Bookmark } from "lucide-react";
import AdBanner from "@/components/AdBanner";

// Mock news data
const newsItems = [
    {
        id: 1,
        title: "Fed Keeps Rates Steady, Powell Signals Potential Cut in September",
        summary: "The Federal Reserve held its benchmark interest rate steady but cited 'some further progress' on inflation, signaling a potential cut ahead.",
        category: "Central Banks",
        time: "2 hours ago",
        impact: "high",
        author: "Market Team",
    },
    {
        id: 2,
        title: "EUR/USD Struggles Near 1.0800 Ahead of Eurozone PMI Data",
        summary: "The Euro remains under pressure against the US Dollar as traders await crucial purchasing managers' index releases from major European economies.",
        category: "Forex",
        time: "4 hours ago",
        impact: "medium",
        author: "FX Analytics",
    },
    {
        id: 3,
        title: "Gold Prices Surge to New Record Highs on Safe-Haven Demand",
        summary: "Spot gold surged past $2,450 an ounce amid geopolitical tensions and increased central bank buying in emerging markets.",
        category: "Commodities",
        time: "5 hours ago",
        impact: "high",
        author: "Metals Desk",
    },
    {
        id: 4,
        title: "Bitcoin Consolidates Around $65,000 as ETF Inflows Moderate",
        summary: "The leading cryptocurrency is trading in a tight range as the initial surge of spot ETF inflows begins to normalize.",
        category: "Crypto",
        time: "6 hours ago",
        impact: "medium",
        author: "Crypto Insider",
    },
    {
        id: 5,
        title: "Bank of Japan Intervenes to Support Yielding Yen",
        summary: "Japanese authorities confirmed intervention in the foreign exchange market to prop up the rapidly depreciating currency against the USD.",
        category: "Forex",
        time: "7 hours ago",
        impact: "high",
        author: "Asian Markets",
    },
    {
        id: 6,
        title: "Oil Prices Dip as US Inventories Show Unexpected Build",
        summary: "WTI Crude fell below $80 per barrel following an API report indicating a surprise increase in US crude stockpiles.",
        category: "Commodities",
        time: "10 hours ago",
        impact: "low",
        author: "Energy Team",
    }
];

// Mock trending categories
const trendingTopics = [
    "Central Bank Rates", "US NFP Report", "Gold All-Time Highs", "JPY Intervention", "Crypto Regulation"
];

export default function NewsDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
                    <p className="text-gray-400">Real-time updates, analysis, and insights.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main News Feed (Left) */}
                <div className="lg:col-span-2 space-y-6">
                    {newsItems.map((news, index) => (
                        <div key={news.id}>
                            {/* Inject an AdBanner after the second news item */}
                            {index === 2 && (
                                <div className="my-8 flex justify-center w-full">
                                    <AdBanner size="leaderboard" className="w-full max-w-full" />
                                </div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#11161B] border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors group relative overflow-hidden"
                            >
                                {/* Subtle side accent based on impact */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${news.impact === 'high' ? 'bg-red-500/80' :
                                        news.impact === 'medium' ? 'bg-yellow-500/80' : 'bg-[#007BFF]/80'
                                    }`}></div>

                                <div className="flex items-center gap-3 mb-3 text-sm">
                                    <span className="text-[#00ff41] bg-[#00ff41]/10 px-2 py-0.5 rounded font-medium">
                                        {news.category}
                                    </span>
                                    <div className="flex items-center text-gray-500">
                                        <Clock size={14} className="mr-1" />
                                        {news.time}
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#007BFF] transition-colors cursor-pointer">
                                    {news.title}
                                </h2>
                                <p className="text-gray-400 mb-4 line-clamp-2">
                                    {news.summary}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>By {news.author}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-400">
                                        <button className="hover:text-white transition-colors"><Bookmark size={18} /></button>
                                        <button className="hover:text-white transition-colors"><Share2 size={18} /></button>
                                        <button className="flex items-center gap-1 text-[#007BFF] hover:text-[#00ff41] transition-colors text-sm font-medium">
                                            Read More <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    ))}

                    <div className="pt-4 flex justify-center">
                        <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700">
                            Load More News
                        </button>
                    </div>
                </div>

                {/* Sidebar (Right) */}
                <div className="space-y-6">
                    {/* Trending Topics Widget */}
                    <div className="bg-[#11161B] border border-gray-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-[#00ff41]" />
                            Trending Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {trendingTopics.map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors cursor-pointer">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Market Movers Widget */}
                    <div className="bg-[#11161B] border border-gray-800 rounded-xl p-5">
                        <h3 className="text-lg font-bold text-white mb-4">Top Movers</h3>
                        <div className="space-y-4">
                            {[
                                { pair: 'EUR/USD', change: '+0.45%', up: true },
                                { pair: 'GBP/JPY', change: '-0.21%', up: false },
                                { pair: 'XAU/USD', change: '+1.20%', up: true },
                                { pair: 'BTC/USD', change: '-1.50%', up: false }
                            ].map((asset, i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-800/50 pb-2 last:border-0 last:pb-0">
                                    <span className="font-semibold text-gray-200">{asset.pair}</span>
                                    <span className={`flex items-center gap-1 font-medium ${asset.up ? 'text-[#00ff41]' : 'text-red-500'}`}>
                                        {asset.up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {asset.change}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar Ad Unit */}
                    <div className="sticky top-24">
                        <AdBanner size="rectangle" className="w-full h-auto min-h-[250px] shadow-lg shadow-[#007BFF]/5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
