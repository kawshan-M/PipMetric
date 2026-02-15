
"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, DollarSign, Percent, AlertCircle, Copy, CheckCircle2, RotateCcw, Activity } from "lucide-react";
import Combobox from "@/components/Combobox";
import { fetchPrice } from "@/services/priceService";
import InteractiveSLChart from "@/components/charts/InteractiveSLChart";

type AssetClass = "Forex" | "Crypto" | "Stocks";

export default function PositionSizeCalculator() {
    const [assetClass, setAssetClass] = useState<AssetClass>("Forex");
    const [accountBalance, setAccountBalance] = useState<number | "">("");
    const [riskPercentage, setRiskPercentage] = useState<number | "">("");
    const [stopLoss, setStopLoss] = useState<number | "">(""); // Pips for Forex
    const [currencyPair, setCurrencyPair] = useState("EUR/USD"); // Slash format for TwelveData
    const [entryPrice, setEntryPrice] = useState<number | "">("");
    const [stopLossPrice, setStopLossPrice] = useState<number | "">("");

    // Live Data State
    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [isLive, setIsLive] = useState(false);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);

    // Results
    const [positionSize, setPositionSize] = useState<number>(0); // Units
    const [standardLots, setStandardLots] = useState<number>(0);
    const [miniLots, setMiniLots] = useState<number>(0);
    const [microLots, setMicroLots] = useState<number>(0);
    const [amountAtRisk, setAmountAtRisk] = useState<number>(0);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Constants
    const STANDARD_LOT_UNITS = 100000;

    // Assets Lists
    const FOREX_PAIRS = [
        "EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD", "USD/CHF", "NZD/USD",
        "EUR/GBP", "EUR/JPY", "GBP/JPY", "AUD/JPY", "CAD/JPY", "CHF/JPY", "NZD/JPY",
        "XAU/USD"
    ];
    const CRYPTO_ASSETS = ["BTC", "ETH", "SOL", "BNB", "XRP", "ADA", "DOGE", "AVAX", "DOT", "LINK"];
    const STOCK_ASSETS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA", "META", "NFLX"];

    // Fetch Price Effect
    useEffect(() => {
        let isActive = true;

        const getPrice = async () => {
            // Reset live status if pair changes
            setIsLive(false);
            setCurrentPrice(null);

            // Clear Entry Price immediately on pair change
            setEntryPrice("");

            if (!currencyPair) return;

            setIsLoadingPrice(true);
            const data = await fetchPrice(currencyPair, assetClass);

            if (isActive && data) {
                setCurrentPrice(data.price);
                setIsLive(true);
                // Auto-fill entry price
                setEntryPrice(data.price);
            } else {
                setIsLive(false);
            }
            setIsLoadingPrice(false);
        };

        // Debounce slightly or just call
        const timeoutId = setTimeout(getPrice, 500);
        return () => { isActive = false; clearTimeout(timeoutId); };
    }, [currencyPair, assetClass]);


    // Calculation Effect
    const calculate = useCallback(() => {
        if (!accountBalance || !riskPercentage) {
            resetResults();
            return;
        }

        const balance = Number(accountBalance);
        const risk = Number(riskPercentage);
        const riskAmount = balance * (risk / 100);
        setAmountAtRisk(riskAmount);

        let sizeUnits = 0;

        // Price to use for value calc (Live or User Input Entry)
        const valuationPrice = Number(entryPrice) || currentPrice || 0;

        if (assetClass === "Forex") {
            if (!stopLoss) return;

            const slPips = Number(stopLoss);
            const isJpy = currencyPair.includes("JPY");
            const pipSize = isJpy ? 0.01 : 0.0001;

            // Approximate Pip Value Logic
            let pipValuePerStdLot = 10;

            if (currencyPair.endsWith("USD")) {
                pipValuePerStdLot = 10;
            } else if (currencyPair.includes("JPY")) {
                if (currencyPair === "USD/JPY" && valuationPrice > 0) {
                    pipValuePerStdLot = 1000 / valuationPrice;
                } else {
                    pipValuePerStdLot = 1000 / 150; // Fallback
                }
            } else if (currencyPair.startsWith("USD")) {
                if (valuationPrice > 0) pipValuePerStdLot = 10 / valuationPrice;
            }

            if (slPips > 0) {
                const lots = riskAmount / (slPips * pipValuePerStdLot);
                sizeUnits = lots * STANDARD_LOT_UNITS;

                setStandardLots(lots);
                setMiniLots(lots * 10);
                setMicroLots(lots * 100);
                setPositionSize(sizeUnits);

                if (currencyPair.startsWith("USD")) {
                    setTotalValue(sizeUnits);
                } else {
                    setTotalValue(sizeUnits * valuationPrice);
                }
            }

        } else {
            // Crypto & Stocks
            if (!entryPrice || !stopLossPrice) return;

            const entry = Number(entryPrice);
            const slPrice = Number(stopLossPrice);
            const distance = Math.abs(entry - slPrice);

            if (distance > 0) {
                sizeUnits = riskAmount / distance;
                setPositionSize(sizeUnits);
                setStandardLots(0);
                setTotalValue(sizeUnits * entry);
            }
        }
    }, [accountBalance, riskPercentage, stopLoss, entryPrice, stopLossPrice, assetClass, currencyPair, currentPrice]);

    useEffect(() => {
        calculate();
    }, [calculate]);

    const resetResults = () => {
        setPositionSize(0);
        setStandardLots(0);
        setMiniLots(0);
        setMicroLots(0);
        setAmountAtRisk(0);
        setTotalValue(0);
    };

    const handleResetAll = () => {
        setAccountBalance("");
        setRiskPercentage("");
        setStopLoss("");
        setEntryPrice("");
        setStopLossPrice("");
        resetResults();
        // Optionally reset pair to defaults based on AssetClass
        if (assetClass === "Forex") setCurrencyPair("EUR/USD");
        if (assetClass === "Crypto") setCurrencyPair("BTC");
        if (assetClass === "Stocks") setCurrencyPair("AAPL");
    };

    const copyToClipboard = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Logic for Forex Chart Sync
    // Calculate effective Stop Loss Price for chart visualization from Pips
    const getForexChartSLPrice = () => {
        if (!currentPrice || !stopLoss) return null;
        const isJpy = currencyPair.includes("JPY");
        const pipSize = isJpy ? 0.01 : 0.0001;
        const pips = Number(stopLoss);
        // Assume Long: SL is below price
        return currentPrice - (pips * pipSize);
    };

    const handleForexChartSLChange = (newPrice: number) => {
        if (!currentPrice) return;
        const isJpy = currencyPair.includes("JPY");
        const pipSize = isJpy ? 0.01 : 0.0001;
        const diff = Math.abs(currentPrice - newPrice);
        const pips = Math.round(diff / pipSize);
        setStopLoss(pips);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                        {/* Asset Class Selector */}
                        <div className="flex bg-gray-900 p-1 rounded-xl mb-6">
                            {(["Forex", "Crypto", "Stocks"] as AssetClass[]).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setAssetClass(type);
                                        setStopLoss("");
                                        setEntryPrice("");
                                        setStopLossPrice("");
                                        if (type === "Forex") setCurrencyPair("EUR/USD");
                                        if (type === "Crypto") setCurrencyPair("BTC");
                                        if (type === "Stocks") setCurrencyPair("AAPL");
                                    }}
                                    className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all uppercase tracking-wider ${assetClass === type
                                            ? "bg-[#007BFF] text-white shadow-lg"
                                            : "text-gray-500 hover:text-white"
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-5">

                            {/* Asset Selection */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                                    Asset
                                    {isLive && (
                                        <span className="flex items-center gap-1 text-[#00ff41] animate-pulse">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff41]"></div>
                                            Live
                                        </span>
                                    )}
                                </label>
                                <Combobox
                                    options={assetClass === "Forex" ? FOREX_PAIRS : assetClass === "Crypto" ? CRYPTO_ASSETS : STOCK_ASSETS}
                                    value={currencyPair}
                                    onChange={(val) => {
                                        setCurrencyPair(val);
                                    }}
                                    placeholder="Select Pair/Asset"
                                />
                            </div>

                            {/* Account Balance */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Balance (USD)</label>
                                <div className="relative group">
                                    <DollarSign size={16} className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                    <input
                                        type="number"
                                        value={accountBalance}
                                        onChange={(e) => setAccountBalance(Number(e.target.value))}
                                        placeholder="10000"
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all font-mono"
                                    />
                                </div>
                            </div>

                            {/* Risk Percentage */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Risk %</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={riskPercentage}
                                        onChange={(e) => setRiskPercentage(Number(e.target.value))}
                                        placeholder="1.0"
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all font-mono"
                                    />
                                    <Percent size={16} className="absolute right-3 top-3.5 text-gray-500 group-focus-within:text-[#007BFF] transition-colors" />
                                </div>
                            </div>

                            {/* Inputs based on Asset Class */}
                            {assetClass === "Forex" ? (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                        Stop Loss (Pips)
                                        {isLoadingPrice && <Activity size={12} className="animate-spin text-[#007BFF]" />}
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="number"
                                            value={stopLoss}
                                            onChange={(e) => setStopLoss(Number(e.target.value))}
                                            placeholder="10"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all font-mono"
                                        />
                                        <AlertCircle size={16} className="absolute right-3 top-3.5 text-gray-500" />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                            Entry Price
                                            {isLoadingPrice && <Activity size={12} className="animate-spin text-[#007BFF]" />}
                                        </label>
                                        <input
                                            type="number"
                                            value={entryPrice}
                                            onChange={(e) => setEntryPrice(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Stop Loss Price</label>
                                        <input
                                            type="number"
                                            value={stopLossPrice}
                                            onChange={(e) => setStopLossPrice(Number(e.target.value))}
                                            placeholder="0.00"
                                            className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all font-mono"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleResetAll}
                        className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors py-2 text-sm font-medium"
                    >
                        <RotateCcw size={14} /> Reset Calculator
                    </button>
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Chart Section */}
                    {isLive && currentPrice && (assetClass === "Crypto" || assetClass === "Stocks") && (
                        <InteractiveSLChart
                            symbol={currencyPair}
                            currentPrice={currentPrice}
                            stopLossPrice={stopLossPrice ? Number(stopLossPrice) : null}
                            onStopLossChange={(price) => setStopLossPrice(price)}
                            isLive={isLive}
                        />
                    )}

                    {/* Forex Chart Section */}
                    {isLive && currentPrice && assetClass === "Forex" && (
                        <InteractiveSLChart
                            symbol={currencyPair}
                            currentPrice={currentPrice}
                            stopLossPrice={getForexChartSLPrice()}
                            onStopLossChange={handleForexChartSLChange}
                            isLive={isLive}
                        />
                    )}

                    {/* Main Result Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Risk Card */}
                        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-red-500/30 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <AlertCircle size={64} className="text-red-500" />
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium mb-1">Amount at Risk</h3>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-4xl font-bold text-[#ff3131]">${amountAtRisk.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        {/* Total Value Card */}
                        <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-all">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <DollarSign size={64} className="text-green-500" />
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium mb-1">Total Position Value</h3>
                            <div className="flex items-baseline gap-1 relative z-10">
                                <span className="text-4xl font-bold text-[#00ff41]">${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Position Size & Breakdown */}
                    <div className="bg-[#161B22] border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-white">Position Size</h3>
                                <p className="text-gray-400 text-xs">Recommended trade size based on risk.</p>
                            </div>
                        </div>

                        {assetClass === "Forex" ? (
                            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                                {/* Standard Lots */}
                                <div className="p-6 text-center hover:bg-gray-800/50 transition-colors relative group">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Standard</div>
                                    <div className="text-3xl font-bold text-white">{standardLots.toFixed(2)}</div>
                                    <div className="text-gray-600 text-xs mt-1">100k Units</div>
                                    <button
                                        onClick={() => copyToClipboard(standardLots.toFixed(2), "std")}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-[#007BFF] transition-colors"
                                    >
                                        {copiedField === "std" ? <CheckCircle2 size={14} className="text-[#00ff41]" /> : <Copy size={14} />}
                                    </button>
                                </div>

                                {/* Mini Lots */}
                                <div className="p-6 text-center hover:bg-gray-800/50 transition-colors relative group">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Mini</div>
                                    <div className="text-2xl font-bold text-gray-200">{miniLots.toFixed(1)}</div>
                                    <div className="text-gray-600 text-xs mt-1">10k Units</div>
                                    <button
                                        onClick={() => copyToClipboard(miniLots.toFixed(2), "mini")}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-[#007BFF] transition-colors"
                                    >
                                        {copiedField === "mini" ? <CheckCircle2 size={14} className="text-[#00ff41]" /> : <Copy size={14} />}
                                    </button>
                                </div>

                                {/* Micro Lots */}
                                <div className="p-6 text-center hover:bg-gray-800/50 transition-colors relative group">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Micro</div>
                                    <div className="text-xl font-bold text-gray-300">{microLots.toFixed(1)}</div>
                                    <div className="text-gray-600 text-xs mt-1">1k Units</div>
                                    <button
                                        onClick={() => copyToClipboard(microLots.toFixed(2), "micro")}
                                        className="absolute top-2 right-2 text-gray-600 hover:text-[#007BFF] transition-colors"
                                    >
                                        {copiedField === "micro" ? <CheckCircle2 size={14} className="text-[#00ff41]" /> : <Copy size={14} />}
                                    </button>
                                </div>

                                <div className="p-6 text-center hover:bg-gray-800/50 transition-colors bg-gray-900/30">
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-2">Units</div>
                                    <div className="text-xl font-bold text-[#007BFF]">{Math.round(positionSize).toLocaleString()}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center relative">
                                <button
                                    onClick={() => copyToClipboard(positionSize.toFixed(4), "units")}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-[#007BFF] transition-colors"
                                >
                                    {copiedField === "units" ? <CheckCircle2 size={18} className="text-[#00ff41]" /> : <Copy size={18} />}
                                </button>

                                <div className="flex flex-col items-center justify-center">
                                    <span className="text-6xl font-bold text-white tracking-tight">{positionSize.toFixed(4)}</span>
                                    <span className="text-gray-500 text-xl font-medium mt-2">{currencyPair.split('/')[0]}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-gray-600 text-xs mt-4">
                        Calculations are estimates. Always verify with your broker before trading.
                        {currentPrice && (
                            <span className="block mt-1 text-gray-500">
                                Live Price Used: <span className="text-white font-mono">${currentPrice}</span>
                            </span>
                        )}
                    </p>

                </div>
            </div>

        </div>
    );
}
