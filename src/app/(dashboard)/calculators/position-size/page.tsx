import PositionSizeCalculator from "@/features/calculators/PositionSizeCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Position Size Calculator | PipMetric",
    description: "Calculate accurate position sizes for Forex, Crypto, and Stocks.",
};

export default function PositionSizePage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Position Size Calculator</h1>
                <p className="text-gray-400">Calculate accurate lot sizes and risk parameters.</p>
            </div>
            <PositionSizeCalculator />
        </div>
    );
}
