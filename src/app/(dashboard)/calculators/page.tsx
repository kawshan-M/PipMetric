import { Metadata } from "next";
import Link from "next/link";
import {
    Calculator,
    Percent,
    TrendingDown,
    TrendingUp,
    DollarSign,
    Target,
    RefreshCw,
    Activity,
    MonitorPlay
} from "lucide-react";

export const metadata: Metadata = {
    title: "Calculator Hub | PipMetric",
    description: "Professional-grade calculators for risk management, profit tracking, and market data.",
};

const calcCategories = [
    {
        title: "Risk Management",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        hover: "group-hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] group-hover:border-red-500/50",
        items: [
            { name: "Position Size", path: "/calculators/position-size", icon: <Calculator size={24} />, desc: "Calculate exact lot sizes to manage risk strictly." },
            { name: "Margin", path: "/calculators/margin", icon: <Percent size={24} />, desc: "Find required margin before opening a trade." },
            { name: "Drawdown", path: "/calculators/drawdown", icon: <TrendingDown size={24} />, desc: "Track account decline from peak value." },
        ]
    },
    {
        title: "Profit Tracking",
        color: "text-[#00ff41]",
        bg: "bg-[#00ff41]/10",
        border: "border-[#00ff41]/30",
        hover: "group-hover:shadow-[0_0_15px_rgba(0,255,65,0.3)] group-hover:border-[#00ff41]/50",
        items: [
            { name: "Pip Value", path: "/calculators/pip", icon: <Target size={24} />, desc: "Calculate exactly what 1 pip is worth." },
            { name: "Profit/Loss", path: "/calculators/profit", icon: <DollarSign size={24} />, desc: "Estimate profit value using entry and exit targets." },
            { name: "Compounding", path: "/calculators/compounding", icon: <TrendingUp size={24} />, desc: "Project long-term account growth." },
        ]
    },
    {
        title: "Market Data",
        color: "text-[#007BFF]",
        bg: "bg-[#007BFF]/10",
        border: "border-[#007BFF]/30",
        hover: "group-hover:shadow-[0_0_15px_rgba(0,123,255,0.3)] group-hover:border-[#007BFF]/50",
        items: [
            { name: "Currency Converter", path: "/calculators/converter", icon: <RefreshCw size={24} />, desc: "Live exchange rates powered by Twelve Data." },
            { name: "Forex Heat Map", path: "/calculators/heatmap", icon: <Activity size={24} />, desc: "Real-time currency strength matrix." },
            { name: "Market Screener", path: "/calculators/screener", icon: <MonitorPlay size={24} />, desc: "Global multi-asset screener and technical ratings." },
        ]
    }
];

export default function CalculatorHubPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2">Calculator Hub</h1>
                <p className="text-gray-400">Your professional suite of precision financial tools.</p>
            </div>

            {calcCategories.map((category) => (
                <div key={category.title} className="space-y-6">
                    <h2 className="text-2xl font-bold border-b border-gray-800 pb-2">{category.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.map((item) => (
                            <Link
                                href={item.path}
                                key={item.name}
                                className={`group p-6 rounded-2xl bg-[#0B0E11] border border-gray-800 transition-all duration-300 hover:bg-gray-900/50 flex flex-col items-start gap-4 ${category.hover}`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.bg} ${category.color} border ${category.border} transition-colors`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors mb-2">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-sans">
                                        {item.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
