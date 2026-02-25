import CompoundingCalculator from "@/features/calculators/CompoundingCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Compounding Calculator | PipMetric",
    description: "Visualize explosive account growth through compounding interest.",
};

export default function CompoundingPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Compounding Calculator</h1>
                <p className="text-gray-400">Plan long-term portfolio growth by continually reinvesting profits.</p>
            </div>
            <CompoundingCalculator />
        </div>
    );
}
