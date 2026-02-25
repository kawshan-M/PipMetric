import MarginCalculator from "@/features/calculators/MarginCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Margin Calculator | PipMetric",
    description: "Calculate required margin for your trades.",
};

export default function MarginPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Margin Calculator</h1>
                <p className="text-gray-400">Determine exactly how much capital is required to open a position.</p>
            </div>
            <MarginCalculator />
        </div>
    );
}
