import React, { useState } from "react";
import { X, Target, MapPin, Calendar, DollarSign, CheckCircle, TextSelect, MessageSquare, Tag, Award, Edit, Trash2, AlertTriangle } from "lucide-react";
import { TradeEntry, EditorBlock } from "@/features/journal/types";
import { colorMap } from "./BadgeSelectPopover";

interface TradeDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: TradeEntry | null;
    onEdit?: (entry: TradeEntry) => void;
    onDelete?: (entryId: string) => void;
}

export default function TradeDetailsModal({ isOpen, onClose, entry, onEdit, onDelete }: TradeDetailsModalProps) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!isOpen || !entry) return null;

    // Helper to get badge style based on saved schema
    const getBadgeStyle = (fieldId: string, value: string) => {
        if (!entry.formFields || !value) return null;
        const field = entry.formFields.find((f: any) => f.id === fieldId);
        if (!field || !field.options) return null;

        const option = field.options.find((o: any) => o.value === value);
        if (!option || !option.color) return null;

        return colorMap[option.color as keyof typeof colorMap];
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Centered Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-3xl max-h-[90vh] bg-[#1E1E1E] shadow-2xl z-50 overflow-y-auto rounded-xl border border-gray-800/80 animate-in fade-in zoom-in-95 duration-200 hide-scrollbar p-6 md:p-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Target className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Trade Details</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            title="Edit Entry"
                            onClick={() => onEdit && onEdit(entry)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                        <button
                            title="Delete Entry"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => {
                                setShowDeleteConfirm(false);
                                onClose();
                            }}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation Overlay */}
                {showDeleteConfirm && (
                    <div className="absolute inset-x-0 inset-y-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-xl">
                        <div className="bg-[#1a1a1a] border border-red-500/20 rounded-xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white">Delete Trade?</h3>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Are you sure you want to delete this trade entry? This action cannot be undone and will permanently remove this data from your journal.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (onDelete && entry.id) {
                                            onDelete(entry.id);
                                        }
                                        setShowDeleteConfirm(false);
                                        onClose();
                                    }}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Core Properties Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-8">

                    {/* Date */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</span>
                        <span className="text-gray-200 font-medium">{entry.date || "Empty"}</span>
                    </div>

                    {/* Pairs */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><Target className="w-4 h-4" /> Pairs</span>
                        <span>
                            {entry.pairs ? (() => {
                                const style = getBadgeStyle('f-pairs', entry.pairs as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.pairs}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Session */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Session</span>
                        <span>
                            {entry.session ? (() => {
                                const style = getBadgeStyle('f-session', entry.session as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.session}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Entry Window */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> Entry Window</span>
                        <span>
                            {entry.entryWindow ? (() => {
                                const style = getBadgeStyle('f-entryWindow', entry.entryWindow as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.entryWindow}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Direction */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><Target className="w-4 h-4" /> Direction</span>
                        <span>
                            {entry.direction ? (() => {
                                const style = getBadgeStyle('f-direction', entry.direction as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.direction}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Profit/Loss */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Profit/Loss</span>
                        <span className={`font-bold ${Number(entry.pl) > 0 ? 'text-green-500' : Number(entry.pl) < 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {entry.pl !== null && entry.pl !== undefined && entry.pl !== "" ? `${Number(entry.pl) > 0 ? '+' : ''}${entry.pl}` : 'Empty'}
                        </span>
                    </div>

                    {/* Followed Rules */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Followed Rules</span>
                        <span>
                            {entry.followedRules ? (() => {
                                const style = getBadgeStyle('f-followedRules', entry.followedRules as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{String(entry.followedRules)}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Break Even */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Break Even</span>
                        <span>
                            {entry.be ? (() => {
                                const style = getBadgeStyle('f-be', entry.be as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{String(entry.be)}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* WIN */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> WIN</span>
                        <span>
                            {entry.win ? (() => {
                                const style = getBadgeStyle('f-win', entry.win as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{String(entry.win)}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Model */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><TextSelect className="w-4 h-4" /> Model</span>
                        <span>
                            {entry.model ? (() => {
                                const style = getBadgeStyle('f-model', entry.model as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.model}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Account */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Account</span>
                        <span>
                            {entry.account ? (() => {
                                const style = getBadgeStyle('f-account', entry.account as string);
                                return <span className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>{entry.account}</span>
                            })() : <span className="text-gray-600">Empty</span>}
                        </span>
                    </div>

                    {/* Rating */}
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-500 flex items-center gap-2"><Award className="w-4 h-4" /> Rating (1-5)</span>
                        <span className="text-yellow-500 font-bold">{entry.rating || "Empty"}</span>
                    </div>

                    {/* Positive Tags */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Positive Tags</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {entry.positiveTags && entry.positiveTags.length > 0 ? entry.positiveTags.map((tag, idx) => {
                                const style = getBadgeStyle('f-positiveTags', tag);
                                return (
                                    <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>
                                        {tag}
                                    </span>
                                );
                            }) : <span className="text-gray-600">Empty</span>}
                        </div>
                    </div>

                    {/* Negative Tags */}
                    <div className="flex flex-col gap-1 sm:col-span-2">
                        <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4" /> Negative Tags</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {entry.negativeTags && entry.negativeTags.length > 0 ? entry.negativeTags.map((tag, idx) => {
                                const style = getBadgeStyle('f-negativeTags', tag);
                                return (
                                    <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${style ? `${style.bg} ${style.text}` : 'bg-gray-800 text-gray-300'}`}>
                                        {tag}
                                    </span>
                                );
                            }) : <span className="text-gray-600">Empty</span>}
                        </div>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-gray-800/80 my-6"></div>

                {/* Editor Content Blocks */}
                {entry.contentBlocks && entry.contentBlocks.length > 0 && (
                    <div className="flex flex-col gap-4 text-sm text-gray-300">
                        {entry.contentBlocks.map((block: EditorBlock) => {
                            if (!block.content && block.type !== 'image' && block.type !== 'checkbox') return null;

                            switch (block.type) {
                                case "heading":
                                    return (
                                        <h3 key={block.id} className={`text-lg font-semibold mt-4 ${block.color ? `text-${block.color}-500` : 'text-white'}`}>
                                            {block.content}
                                        </h3>
                                    );
                                case "bullet":
                                    return (
                                        <li key={block.id} className="ml-4 list-disc text-gray-400">
                                            {block.content}
                                        </li>
                                    );
                                case "checkbox":
                                    return (
                                        <div key={block.id} className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={block.checked || false}
                                                readOnly
                                                className="w-4 h-4 rounded bg-transparent border-gray-600 appearance-none border checked:bg-blue-500"
                                            />
                                            <span className={block.checked ? "text-gray-500 line-through" : "text-gray-300"}>
                                                {block.content || "Empty rule"}
                                            </span>
                                        </div>
                                    );
                                case "image":
                                    return block.content ? (
                                        <div key={block.id} className="my-4 rounded-lg overflow-hidden border border-gray-800">
                                            <img src={block.content} alt="Trade capture" className="w-full h-auto object-cover" />
                                        </div>
                                    ) : (
                                        <div key={block.id} className="my-4 text-xs text-gray-600 italic">
                                            [Empty image block]
                                        </div>
                                    );
                                default:
                                    return <div key={block.id}>{block.content}</div>;
                            }
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
