
import { ArrowRight, BarChart2, Zap, Shield } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 max-w-5xl mx-auto relative mt-16">
      {/* Background glow for hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#007BFF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#007BFF]/10 text-[#007BFF] border border-[#007BFF]/20 text-sm font-medium mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007BFF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007BFF]"></span>
        </span>
        v1.0 is now live
      </div>

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
        Precision Trading Tools, <br />
        <span className="bg-gradient-to-r from-[#00ff41] via-[#007BFF] to-[#00ff41] bg-clip-text text-transparent bg-300% animate-gradient">
          Powered by AI.
        </span>
      </h1>

      <p className="text-xl text-gray-400 max-w-2xl">
        PipMetric provides institutional-grade analytics, real-time position calculators, and AI-driven journal insights for the modern trader.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 items-center justify-center">
        <Link href="/dashboard" className="group flex items-center justify-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-[0_0_20px_rgba(0,123,255,0.3)] hover:shadow-[0_0_30px_rgba(0,123,255,0.5)]">
          Start Trading
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="w-full max-w-4xl overflow-hidden mt-12 bg-black/20 border border-gray-800/50 rounded-2xl py-3 backdrop-blur-md relative">
        <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-[#0B0E11] to-transparent z-10 pointer-events-none"></div>
        <div className="flex w-max animate-marquee space-x-12">
          {[1, 2].map((i) => (
            <div key={i} className="flex space-x-12 font-mono text-sm items-center px-6">
              <span className="text-gray-300 font-medium">NAS100 <span className="text-[#00ff41] ml-1">▲ 17,540 (+0.8%)</span></span>
              <span className="text-gray-300 font-medium">SPX500 <span className="text-[#ff3131] ml-1">▼ 5,120 (-0.2%)</span></span>
              <span className="text-gray-300 font-medium">BTC/USD <span className="text-[#00ff41] ml-1">▲ $68,400 (+2.1%)</span></span>
              <span className="text-gray-300 font-medium">EUR/USD <span className="text-[#ff3131] ml-1">▼ 1.0845 (-0.1%)</span></span>
              <span className="text-gray-300 font-medium">GOLD <span className="text-[#00ff41] ml-1">▲ $2,340 (+0.5%)</span></span>
              <span className="text-gray-300 font-medium">ETH/USD <span className="text-[#00ff41] ml-1">▲ $3,850 (+1.2%)</span></span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-[#0B0E11] to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 text-left w-full relative z-10 mb-20">
        <div className="p-6 rounded-2xl bg-[#161B22]/80 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-[0_0_30px_rgba(0,123,255,0.1)] group">
          <div className="w-12 h-12 rounded-lg bg-[#007BFF]/10 flex items-center justify-center mb-4 text-[#007BFF] group-hover:scale-110 transition-transform">
            <BarChart2 size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Smart Calculators</h3>
          <p className="text-gray-400">Instant position sizing, pip values, and liquidation points across Forex and Crypto markets.</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#161B22]/80 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">AI Intelligence</h3>
          <p className="text-gray-400">Real-time sentiment analysis and economic event impact predictions powered by machine learning.</p>
        </div>
        <div className="p-6 rounded-2xl bg-[#161B22]/80 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] group">
          <div className="w-12 h-12 rounded-lg bg-[#00ff41]/10 flex items-center justify-center mb-4 text-[#00ff41] group-hover:scale-110 transition-transform">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Risk Management</h3>
          <p className="text-gray-400">Advanced journaling with automated pattern recognition to improve your win rate.</p>
        </div>
      </div>
    </div>
  );
}
