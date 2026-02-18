"use client";

import { motion } from "framer-motion";

interface SentimentGaugeProps {
    score: number; // -1 to 1
}

export default function SentimentGauge({ score }: SentimentGaugeProps) {
    // Normalize score to 0-180 degrees
    // -1 => 0 degrees (Bearish)
    // 1 => 180 degrees (Bullish)
    const angle = ((score + 1) / 2) * 180;

    const getSentimentLabel = (s: number) => {
        if (s < -0.5) return "Strongly Bearish";
        if (s < -0.1) return "Bearish";
        if (s < 0.1) return "Neutral";
        if (s < 0.5) return "Bullish";
        return "Strongly Bullish";
    };

    const getSentimentColor = (s: number) => {
        if (s < -0.1) return "#ff3131"; // Bearish Red
        if (s > 0.1) return "#00ff41"; // Bullish Green
        return "#fbbf24"; // Neutral Yellow
    };

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-gray-400 font-medium mb-4 z-10">Market Sentiment</h3>

            <div className="relative w-64 h-32 overflow-hidden mb-4 z-10">
                {/* Gauge Background */}
                <div className="absolute top-0 left-0 w-full h-64 rounded-full border-8 border-gray-800 box-border"></div>

                {/* Gauge Tick Marks/Gradient representation could go here, keeping it simple for now */}

                {/* Needle */}
                <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-32 bg-white origin-bottom"
                    style={{ translateX: "-50%" }}
                    initial={{ rotate: 0 }}
                    animate={{ rotate: angle - 90 }} // -90 because 0deg is 12 o'clock in CSS rotation, we want -90 to be 9 o'clock
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                    <div className="w-4 h-4 bg-white rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                </motion.div>
            </div>

            <div className="text-center z-10">
                <h2 className="text-2xl font-bold" style={{ color: getSentimentColor(score) }}>
                    {getSentimentLabel(score)}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Score: {score.toFixed(2)}</p>
            </div>

            {/* Background Glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: `radial-gradient(circle, ${getSentimentColor(score)} 0%, transparent 70%)` }}
            />
        </div>
    );
}
