"use client";

import { useEffect, useRef } from "react";
import { Activity } from "lucide-react";

export default function ForexHeatmap() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = '';

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script.type = "text/javascript";
    script.async = true;

    script.innerHTML = `
        {
          "width": "100%",
          "height": "100%",
          "currencies": [
            "EUR",
            "USD",
            "JPY",
            "GBP",
            "CHF",
            "AUD",
            "CAD",
            "NZD",
            "CNY"
          ],
          "isTransparent": true,
          "colorTheme": "dark",
          "locale": "en",
          "backgroundColor": "rgba(0, 0, 0, 0)"
        }`;

    container.current.appendChild(script);
  }, []);

  return (
    <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl w-full">
      <div className="p-4 md:p-6 border-b border-gray-800 flex items-center justify-between bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF]">
            <Activity size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Forex Heat Map</h2>
            <p className="text-sm text-gray-500">Real-time relative currency strengths</p>
          </div>
        </div>
      </div>

      <div className="w-full relative bg-[#0B0E11] h-[550px] md:h-[700px]" ref={container}>
        {/* Trading View Script is injected here automatically */}
      </div>

      <div className="p-4 bg-gray-900/50 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">Pairs are ranked in real-time. Green indicates strength against the paired currency; Red indicates weakness.</p>
      </div>
    </div>
  );
}
