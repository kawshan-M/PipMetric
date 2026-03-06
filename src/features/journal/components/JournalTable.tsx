import React from "react";
import {
    Filter,
    ArrowUpDown,
    Zap,
    Search,
    Maximize2,
    List,
    ChevronDown,
    Plus,
    FileText,
    BookOpen,
    Eye
} from "lucide-react";

import { TradeEntry } from "@/features/journal/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

export default function JournalTable() {
    const { user } = useAuth();
    const [entries, setEntries] = React.useState<TradeEntry[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "users", user.uid, "journal_entries"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as TradeEntry[];
            setEntries(fetched);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching journal entries: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);
    return (
        <div className="flex-1 bg-[#121418] border border-gray-800/60 rounded-xl p-0 flex flex-col overflow-hidden shadow-sm">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/60">
                <div className="flex items-center gap-2">
                    <div className="bg-green-500/10 text-green-500 p-1.5 rounded-md mr-2">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-800/60">
                        <button className="px-4 py-1.5 text-sm font-medium text-white bg-gray-700/50 rounded-md shadow-sm">
                            This Week
                        </button>
                        <button className="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            This Month
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="text-blue-500 hover:text-blue-400 transition-colors">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <ArrowUpDown className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Zap className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Search className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Maximize2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors mr-2">
                        <List className="w-4 h-4" />
                    </button>

                    <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                        New
                        <ChevronDown className="w-4 h-4 ml-1 opacity-80" />
                    </button>
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-800/60 font-medium">
                            <th className="px-4 py-3 w-10 text-center"><Plus className="w-4 h-4 text-gray-500 mx-auto cursor-pointer" /></th>
                            <th className="px-2 py-3 w-10"><input type="checkbox" className="rounded bg-transparent border-gray-600 appearance-none w-4 h-4 border checked:bg-blue-500 checked:border-blue-500" /></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Name</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Date</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Zap className="w-4 h-4" /> Pairs</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Session</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><ArrowUpDown className="w-4 h-4" /> Direction</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Eye className="w-4 h-4" /> Profit/Loss</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><input type="checkbox" checked readOnly className="rounded bg-transparent border-gray-600 appearance-none w-4 h-4 border checked:bg-gray-500 checked:border-gray-500" /> Follow</div></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                        {loading ? (
                            <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading entries...</td></tr>
                        ) : entries.length === 0 ? (
                            <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">No trading entries found. Click "+ TRADE ENTRY" to add one.</td></tr>
                        ) : entries.map((row) => (
                            <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-3 text-center">
                                    <div className="opacity-0 group-hover:opacity-100 cursor-pointer flex justify-center">
                                        <Plus className="w-4 h-4 text-gray-500" />
                                    </div>
                                </td>
                                <td className="px-2 py-3">
                                    <input type="checkbox" className="rounded bg-transparent border-gray-600 appearance-none w-4 h-4 border checked:bg-blue-500 checked:border-blue-500 cursor-pointer" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-4 h-4 text-gray-500" />
                                        {/* Name property could be derived from pairs or date if desired, mocked empty toggles for now */}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-300">
                                    {row.date}
                                </td>
                                <td className="px-4 py-3">
                                    {row.pairs && (
                                        <span className="bg-green-900/30 text-green-500 px-2 py-1 rounded bg-opacity-20 border border-green-900/50 text-xs font-medium">
                                            {row.pairs}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {row.session && (
                                        <span className="bg-blue-900/30 text-blue-400 px-2 py-1 rounded bg-opacity-20 border border-blue-900/50 text-xs font-medium">
                                            {row.session}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {row.direction && (
                                        <span className="bg-green-900/30 text-green-500 px-2 py-1 rounded bg-opacity-20 border border-green-900/50 text-xs font-medium">
                                            {row.direction}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right pr-8">
                                    {row.pl !== null && row.pl !== undefined && (
                                        <span className={row.pl >= 0 ? "text-green-500" : "text-red-500"}>{row.pl}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <input type="checkbox" defaultChecked={row.followedRules} className="rounded bg-transparent border-gray-600 appearance-none w-4 h-4 border checked:bg-blue-500 checked:border-blue-500 cursor-pointer" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-2 border-t border-gray-800/60">
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm px-2 py-1.5 transition-colors">
                    <Plus className="w-4 h-4" />
                    New page
                </button>
            </div>
        </div>
    );
}
