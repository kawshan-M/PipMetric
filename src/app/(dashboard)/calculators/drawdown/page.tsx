import DrawdownCalculator from "@/features/calculators/DrawdownCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Drawdown Calculator | PipMetric",
    description: "Calculate maximum account decline from peak valuation.",
};

export default function DrawdownPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Drawdown Calculator</h1>
                <p className="text-gray-400">Measure risk and historical performance precisely.</p>
            </div>
            <DrawdownCalculator />
        </div>
    );
}
