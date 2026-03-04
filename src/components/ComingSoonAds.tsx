"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock } from "lucide-react";
import AdBanner from "./AdBanner";

interface ComingSoonAdsProps {
    title: string;
    description?: string;
}

export default function ComingSoonAds({ title, description = "We are working hard to bring you this feature. In the meantime, please support us by checking out our sponsors!" }: ComingSoonAdsProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="text-center space-y-4 max-w-2xl mx-auto py-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center p-4 bg-[#007BFF]/10 rounded-full mb-2"
                >
                    <Clock className="w-12 h-12 text-[#007BFF]" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{title} is Coming Soon</h1>
                <p className="text-gray-400 text-lg">
                    {description}
                </p>
            </div>

            {/* Primary Top Ad */}
            <div className="flex justify-center w-full">
                <AdBanner size="leaderboard" className="w-full max-w-[970px] h-[250px] md:h-[90px]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Fill with Ads */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex justify-center"
                    >
                        <AdBanner size="rectangle" className="w-full max-w-[336px] h-[280px]" />
                    </motion.div>
                ))}
            </div>

            {/* Secondary Bottom Ad */}
            <div className="flex justify-center w-full mt-8">
                <AdBanner size="leaderboard" className="w-full max-w-[970px] h-[250px] md:h-[90px]" />
            </div>
        </div>
    );
}
