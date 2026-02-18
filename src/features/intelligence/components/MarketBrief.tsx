"use client";

interface MarketBriefProps {
    summary: string;
}

export default function MarketBrief({ summary }: MarketBriefProps) {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#007BFF] animate-pulse" />
                <h3 className="text-gray-400 font-medium">AI Market Brief</h3>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed">
                {summary || "Analyzing market data..."}
            </p>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#007BFF]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        </div>
    );
}
