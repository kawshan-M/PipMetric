import ForexHeatmap from "@/features/calculators/ForexHeatmap";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forex Heat Map | PipMetric",
    description: "Live Forex correlation and strength matrices powered by TradingView.",
};

export default function HeatmapPage() {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Forex Heat Map</h1>
                <p className="text-gray-400">Instantly identify the strongest and weakest currencies in the market.</p>
            </div>
            <ForexHeatmap />
        </div>
    );
}
