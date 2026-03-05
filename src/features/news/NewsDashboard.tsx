"use client";

import { motion } from "framer-motion";
import { Clock, TrendingUp, TrendingDown, ArrowRight, Share2, Bookmark } from "lucide-react";
import AdBanner from "@/components/AdBanner";

import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface NewsItem {
    id: number | string;
    title: string;
    summary: string;
    category: string;
    time: string;
    impact: string;
    author: string;
    url: string;
}


// Mock trending categories
const trendingTopics = [
    "Central Bank Rates", "US NFP Report", "Gold All-Time Highs", "JPY Intervention", "Crypto Regulation"
];

export default function NewsDashboard() {
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const unsub = onSnapshot(doc(db, "news", "latest"), (docSnap) => {
            if (docSnap.exists() && isMounted) {
                const data = docSnap.data();
                if (data.articles && Array.isArray(data.articles)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const formatted = data.articles.map((item: any, idx: number) => {
                        // Calculate hours ago
                        const date = new Date(item.datetime * 1000);
                        const now = new Date();
                        const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
                        const timeStr = diffHours > 24
                            ? `${Math.floor(diffHours / 24)} days ago`
                            : diffHours === 0 ? 'Just now' : `${diffHours} hours ago`;

                        return {
                            id: item.id || idx,
                            title: item.headline || 'No Title Available',
                            summary: item.summary || item.headline || '',
                            category: (item.category || "General").toUpperCase(),
                            time: timeStr,
                            impact: ["high", "medium", "low"][Math.floor(Math.random() * 3)],
                            author: item.source || "Market Team",
                            url: item.url || "#",
                        };
                    });
                    setNewsItems(formatted);
                }
                setLoading(false);
            } else if (isMounted) {
                setLoading(false);
            }
        }, (error) => {
            if (error.code !== "cancelled") {
                console.error("Error fetching news:", error);
            }
            if (isMounted) setLoading(false);
        });

        return () => {
            isMounted = false;
            unsub();
        };
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Market News</h1>
                    <p className="text-gray-400">Real-time updates, analysis, and insights powered by Finnhub APIs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main News Feed (Left) */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="w-10 h-10 border-4 border-[#007BFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-400">Loading latest market news...</p>
                        </div>
                    ) : newsItems.length === 0 ? (
                        <div className="text-center py-20 bg-[#11161B] border border-gray-800 rounded-xl">
                            <p className="text-gray-400">No news articles found. Update your feed to see the latest.</p>
                        </div>
                    ) : (
                        newsItems.map((news, index) => (
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
                                    transition={{ delay: Math.min(index * 0.05, 0.5) }} // Cap the delay to make fast loading
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

                                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#007BFF] transition-colors cursor-pointer" onClick={() => window.open(news.url, "_blank")}>
                                        {news.title}
                                    </h2>
                                    <p className="text-gray-400 mb-4 line-clamp-3">
                                        {news.summary}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-800/50">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span>By {news.author}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-400">
                                            <button className="hover:text-white transition-colors"><Bookmark size={18} /></button>
                                            <button className="hover:text-white transition-colors"><Share2 size={18} /></button>
                                            <a href={news.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#007BFF] hover:text-[#00ff41] transition-colors text-sm font-medium">
                                                Read More <ArrowRight size={16} />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    )}

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
