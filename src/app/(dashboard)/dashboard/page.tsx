import { Calendar as CalendarIcon, Clock, Activity } from "lucide-react";

export const metadata = {
    title: "Dashboard | PipMetric",
    description: "User Activity and Trading Journal",
};

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
                    <p className="text-gray-400">Overview of your trading activity and recent journal entries.</p>
                </div>
            </div>

            {/* Placeholder Activity Calendar */}
            <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-[#007BFF]/10 flex items-center justify-center text-[#007BFF]">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">User Activity Calendar</h2>
                        <p className="text-sm text-gray-500">Your recent trades and journal activity heatmap.</p>
                    </div>
                </div>

                <div className="border border-gray-800 rounded-xl bg-gray-900/50 p-12 flex flex-col items-center justify-center text-center">
                    <Activity size={48} className="text-gray-600 mb-4" />
                    <p className="text-gray-400 font-medium max-w-sm">
                        Activity heatmap component will go here. Connect your exchange or broker to see automated journal entries.
                    </p>
                    <button className="mt-6 px-6 py-2.5 bg-[#007BFF]/10 text-[#007BFF] hover:bg-[#007BFF]/20 rounded-lg font-bold transition-colors">
                        Connect Broker
                    </button>
                </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2"><Clock size={16} className="text-[#00ff41]" /> Recent Trades</h3>
                    <div className="space-y-4">
                        <div className="text-gray-500 text-sm text-center py-8">No recent trades found.</div>
                    </div>
                </div>
                <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl p-6">
                    <h3 className="font-bold mb-4">Latest Insights</h3>
                    <div className="space-y-4">
                        <div className="text-gray-500 text-sm text-center py-8">No AI insights generated yet.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
