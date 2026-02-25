import MarketScreener from "@/features/calculators/MarketScreener";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Market Screener | PipMetric",
    description: "Multi-market symbol screener tracking Indices, Crypto, and Forex in real-time.",
};

export default function ScreenerPage() {
    return (
        <div className="space-y-4">
            <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">Global Market Screener</h1>
                <p className="text-gray-400">Track and filter live price action, volatility, and technical ratings across all asset classes.</p>
            </div>
            <MarketScreener />
        </div>
    );
}
