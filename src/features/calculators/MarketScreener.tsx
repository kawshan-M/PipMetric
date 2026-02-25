"use client";

import { useEffect, useRef, useState } from "react";
import { MonitorPlay } from "lucide-react";

type ScreenerType = "forex_mkt" | "crypto_mkt" | "america";

export default function MarketScreener() {
  const container = useRef<HTMLDivElement>(null);
  const [screenerType, setScreenerType] = useState<ScreenerType>("forex_mkt");

  useEffect(() => {
    if (!container.current) return;

    // Clear container when switching tabs
    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    script.type = "text/javascript";
    script.async = true;

    // Configure the authentic Screener widget
    script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "defaultColumn": "overview",
          "defaultScreen": "general",
          "market": "forex",
          "showToolbar": true,
          "colorTheme": "dark",
          "locale": "en",
          "isTransparent": true,
          "screener_type": "${screenerType}",
          "displayCurrency": "USD"
        }`;

    container.current.appendChild(script);
  }, [screenerType]);

  return (
    <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl w-full">
      <div className="p-4 md:p-6 border-b border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-900/50 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF]">
            <MonitorPlay size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Market Screener</h2>
            <p className="text-sm text-gray-500">Advanced technical metrics & ratings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#161B22] p-1 rounded-xl border border-gray-800 w-full md:w-auto overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setScreenerType("forex_mkt")}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition-all whitespace-nowrap ${screenerType === "forex_mkt" ? "bg-[#007BFF]/20 text-[#007BFF]" : "text-gray-500 hover:text-white"
              }`}
          >
            Forex
          </button>
          <button
            onClick={() => setScreenerType("crypto_mkt")}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition-all whitespace-nowrap ${screenerType === "crypto_mkt" ? "bg-[#007BFF]/20 text-[#007BFF]" : "text-gray-500 hover:text-white"
              }`}
          >
            Crypto
          </button>
          <button
            onClick={() => setScreenerType("america")}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-lg transition-all whitespace-nowrap ${screenerType === "america" ? "bg-[#007BFF]/20 text-[#007BFF]" : "text-gray-500 hover:text-white"
              }`}
          >
            US Indices & Stocks
          </button>
        </div>
      </div>

      <div className="w-full relative bg-[#0B0E11] h-[600px] md:h-[800px]" ref={container}>
        {/* Trading View Script is injected here automatically */}
      </div>

    </div>
  );
}
