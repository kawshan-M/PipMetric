
import PositionSizeCalculator from "@/features/calculators/PositionSizeCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Position Size Calculator | PipMetric",
    description: "Calculate accurate position sizes for Forex, Crypto, and Stocks.",
};

export default function CalculatorsPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Calculators</h1>
                <p className="text-gray-400">Professional-grade tools for risk management.</p>
            </div>

            <PositionSizeCalculator />

            {/* Placeholder for future calculators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 border-t border-gray-800">
                <div className="p-6 rounded-2xl bg-gray-900/30 border border-gray-800 border-dashed flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium text-gray-400">Coming Soon</span>
                    <span className="text-lg font-bold">Pip Value Calculator</span>
                </div>
                <div className="p-6 rounded-2xl bg-gray-900/30 border border-gray-800 border-dashed flex flex-col items-center justify-center text-center opacity-50 hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium text-gray-400">Coming Soon</span>
                    <span className="text-lg font-bold">Liquidation Calculator</span>
                </div>
            </div>
        </div>
    );
}
