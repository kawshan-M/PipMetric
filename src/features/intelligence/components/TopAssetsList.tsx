"use client";

interface AssetSentiment {
    symbol: string;
    score: number;
}

interface TopAssetsListProps {
    assets: AssetSentiment[];
}

export default function TopAssetsList({ assets }: TopAssetsListProps) {
    const getScoreColor = (score: number) => {
        if (score < -0.1) return "text-[#ff3131]";
        if (score > 0.1) return "text-[#00ff41]";
        return "text-[#fbbf24]";
    };

    const getProgressBarColor = (score: number) => {
        if (score < -0.1) return "bg-[#ff3131]";
        if (score > 0.1) return "bg-[#00ff41]";
        return "bg-[#fbbf24]";
    }

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-gray-400 font-medium mb-4">Top Assets Sentiment</h3>
            <div className="space-y-4">
                {assets.map((asset) => (
                    <div key={asset.symbol} className="group">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-gray-200">{asset.symbol}</span>
                            <span className={`text-sm font-bold ${getScoreColor(asset.score)}`}>
                                {asset.score > 0 ? "+" : ""}{asset.score.toFixed(2)}
                            </span>
                        </div>
                        {/* Sentiment Bar - Center is 0 */}
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden relative">
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-600/50 -translate-x-1/2 z-10" />

                            {/* Bar */}
                            <div
                                className={`h-full rounded-full absolute top-0 ${getProgressBarColor(asset.score)} transition-all duration-500`}
                                style={{
                                    left: asset.score < 0 ? `${((asset.score + 1) / 2) * 100}%` : '50%',
                                    width: `${Math.abs(asset.score) / 2 * 100}%`,
                                    opacity: 0.8
                                }}
                            />
                        </div>
                    </div>
                ))}
                {assets.length === 0 && (
                    <div className="text-center text-gray-500 py-4">Loading assets...</div>
                )}
            </div>
        </div>
    );
}
