import ProfitCalculator from "@/features/calculators/ProfitCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profit Calculator | PipMetric",
    description: "Calculate your estimated Profit and Loss for any trade setup.",
};

export default function ProfitPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Profit Calculator</h1>
                <p className="text-gray-400">Project your monetary gain or loss before entering a trade.</p>
            </div>
            <ProfitCalculator />
        </div>
    );
}
