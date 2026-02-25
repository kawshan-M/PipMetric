import CurrencyConverter from "@/features/calculators/CurrencyConverter";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Currency Converter | PipMetric",
    description: "Convert major global currencies with real-time exchange rates via Twelve Data API.",
};

export default function ConverterPage() {
    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Live Currency Converter</h1>
                <p className="text-gray-400">Convert amounts with exact prevailing interbank market rates.</p>
            </div>
            <CurrencyConverter />
        </div>
    );
}
