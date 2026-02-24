import { CalendarDays, Filter } from "lucide-react";

export const metadata = {
    title: "Economic Calendar | PipMetric",
    description: "Track all major global economic events and their volatility impact.",
};

export default function EconomicCalendarPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Economic Calendar</h1>
                    <p className="text-gray-400">Track high-impact global financial events affecting Forex and Crypto markets.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors shadow-sm text-sm font-medium">
                    <Filter size={16} />
                    Filter Events
                </button>
            </div>

            {/* Placeholder Calendar List */}
            <div className="bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <CalendarDays size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                        <p className="text-sm text-gray-500">Events scheduled for this week</p>
                    </div>
                </div>

                <div className="divide-y divide-gray-800">
                    <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-900/30">
                        <p className="text-gray-400 font-medium">
                            Integration with financial event API is pending.
                            <br />
                            High, Medium, and Low volatility events will populate here.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
