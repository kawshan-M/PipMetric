import PipCalculator from "@/features/calculators/PipCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pip Value Calculator | PipMetric",
    description: "Determine the exact value of a single pip for any currency pair.",
};

export default function PipPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Pip Value Calculator</h1>
                <p className="text-gray-400">Calculate the exact monetary value of a single pip based on your trade size.</p>
            </div>
            <PipCalculator />
        </div>
    );
}
