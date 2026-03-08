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
    Eye,
    Target,
    MapPin,
    Calendar,
    DollarSign,
    CheckCircle,
    Award,
    TextSelect,
    MoreHorizontal
} from "lucide-react";

import { TradeEntry } from "@/features/journal/types";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { colorMap } from "./BadgeSelectPopover";
import TradeDetailsModal from "./TradeDetailsModal";

interface JournalTableProps {
    onEditEntry?: (entry: TradeEntry) => void;
}

export default function JournalTable({ onEditEntry }: JournalTableProps) {
    const { user } = useAuth();
    const [entries, setEntries] = React.useState<TradeEntry[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedEntry, setSelectedEntry] = React.useState<TradeEntry | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

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

    const handleDelete = async (entryId: string) => {
        if (!user) return;
        try {
            const docRef = doc(db, "users", user.uid, "journal_entries", entryId);
            await deleteDoc(docRef);
            // Modal will close automatically via its internal logic
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("Failed to delete the trade entry. Please try again.");
        }
    };

    // Helper functions for displaying values
    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "Empty";
        let cleanDateStr = dateStr;
        if (dateStr.includes("|")) {
            cleanDateStr = dateStr.split("|")[0];
        }

        const formatSingle = (str: string, short: boolean) => {
            const hasTime = str.includes(" ");
            const datePart = str.split(" ")[0];

            const dateObj = new Date(datePart);
            let result = dateObj.toLocaleString('en-US', {
                month: short ? 'short' : 'long',
                day: 'numeric',
                year: 'numeric'
            });
            return result;
        };

        const parts = cleanDateStr.split(" → ");
        let finalDisplay = "";

        if (parts.length === 1) {
            finalDisplay = formatSingle(parts[0], false);
        } else {
            finalDisplay = `${formatSingle(parts[0], true)} → ${formatSingle(parts[1], true)}`;
        }

        return finalDisplay;
    };

    const getBadgeStyle = (fieldId: string, value: string, row: TradeEntry) => {
        if (!row.formFields || !value) return null;
        const field = row.formFields.find((f: any) => f.id === fieldId);
        if (!field || !field.options) return null;

        const option = field.options.find((o: any) => o.value === value);
        if (!option || !option.color) return null;

        return colorMap[option.color as keyof typeof colorMap];
    };

    return (
        <div className="flex-1 bg-[#121418] border border-gray-800/60 rounded-xl p-0 flex flex-col overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800/60 bg-gray-900/20">
                <div className="flex items-center gap-3">
                    <div className="bg-green-500/10 text-green-500 p-2 rounded-lg">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Trading Journal</h3>
                </div>
                <div className="text-sm text-gray-400">
                    {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="text-gray-400 border-b border-gray-800/60 font-medium">
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Target className="w-4 h-4" /> Pairs</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Session</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Target className="w-4 h-4" /> Direction</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> Profit/Loss</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> WIN</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><TextSelect className="w-4 h-4" /> Model</div></th>
                            <th className="px-4 py-3"><div className="flex items-center gap-2"><Award className="w-4 h-4" /> Rating</div></th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60">
                        {loading ? (
                            <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-500">Loading entries...</td></tr>
                        ) : entries.length === 0 ? (
                            <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No trading entries found. Click "+ TRADE ENTRY" to add one.</td></tr>
                        ) : entries.map((row) => {
                            const pairStyle = getBadgeStyle('f-pairs', row.pairs as string, row);
                            const sessionStyle = getBadgeStyle('f-session', row.session as string, row);
                            const dirStyle = getBadgeStyle('f-direction', row.direction as string, row);
                            const winStyle = getBadgeStyle('f-win', row.win as string, row);
                            const modelStyle = getBadgeStyle('f-model', row.model as string, row);

                            return (
                                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-4 py-3 text-gray-300">
                                        {formatDateDisplay(row.date as string)}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.pairs && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${pairStyle ? `${pairStyle.bg} ${pairStyle.text}` : 'bg-gray-800 text-gray-300'}`}>
                                                {row.pairs}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.session && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${sessionStyle ? `${sessionStyle.bg} ${sessionStyle.text}` : 'bg-gray-800 text-gray-300'}`}>
                                                {row.session}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.direction && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${dirStyle ? `${dirStyle.bg} ${dirStyle.text}` : 'bg-gray-800 text-gray-300'}`}>
                                                {row.direction}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.pl !== null && row.pl !== undefined && row.pl !== "" && (
                                            <span className={Number(row.pl) > 0 ? "text-green-500 font-medium" : Number(row.pl) < 0 ? "text-red-500 font-medium" : "text-gray-400 font-medium"}>
                                                {Number(row.pl) > 0 ? "+" : ""}{row.pl}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.win && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${winStyle ? `${winStyle.bg} ${winStyle.text}` : 'bg-gray-800 text-gray-300'}`}>
                                                {String(row.win)}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.model && (
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${modelStyle ? `${modelStyle.bg} ${modelStyle.text}` : 'bg-gray-800 text-gray-300'}`}>
                                                {row.model}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {row.rating && (
                                            <span className="text-yellow-500 font-bold">{row.rating}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => {
                                                setSelectedEntry(row);
                                                setIsDetailsModalOpen(true);
                                            }}
                                            className="text-gray-500 hover:text-white flex items-center gap-1 text-xs font-medium transition-colors bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded-md opacity-0 group-hover:opacity-100"
                                        >
                                            <MoreHorizontal className="w-3 h-3" /> More
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Details Modal Popup */}
            <TradeDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                entry={selectedEntry}
                onEdit={(entry) => {
                    setIsDetailsModalOpen(false);
                    if (onEditEntry) onEditEntry(entry);
                }}
                onDelete={handleDelete}
            />
        </div>
    );
}
