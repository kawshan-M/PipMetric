import React from 'react';

type AdBannerProps = {
    size?: 'leaderboard' | 'rectangle' | 'fluid' | 'skyscraper'; // leaderboard: 728x90, rectangle: 300x250, skyscraper: 160x600
    className?: string;
};

export default function AdBanner({ size = 'leaderboard', className = '' }: AdBannerProps) {
    // Define dimensions based on size Let's use responsive tailwind classes to approximate
    let dimensionsClass = '';
    switch (size) {
        case 'leaderboard':
            dimensionsClass = 'w-full max-w-[728px] h-[90px]';
            break;
        case 'rectangle':
            dimensionsClass = 'w-full max-w-[300px] h-[250px]';
            break;
        case 'skyscraper':
            dimensionsClass = 'w-full max-w-[160px] h-[600px]';
            break;
        case 'fluid':
            dimensionsClass = 'w-full h-full min-h-[90px]';
            break;
    }

    return (
        <div
            className={`mx-auto bg-gray-900/40 border border-gray-800 rounded-lg flex flex-col items-center justify-center overflow-hidden relative group backdrop-blur-sm ${dimensionsClass} ${className}`}
        >
            <span className="text-[10px] text-gray-500 uppercase tracking-widest absolute top-2 right-2">
                Advertisement
            </span>
            <div className="text-gray-600 flex flex-col items-center mt-2 group-hover:text-gray-400 transition-colors duration-300">
                <span className="text-sm font-semibold mb-1">Your Ad Here</span>
                <span className="text-xs">Support PipMetric</span>
            </div>

            {/* Decorative neon subtle glow for the ad container to match app theme */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
        </div>
    );
}
