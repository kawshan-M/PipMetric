"use client";

import React, { useState, useEffect, useRef } from "react";
import { Edit2, Copy, Trash2, Eye, EyeOff, MessageSquare, Maximize2, Check, ChevronRight } from "lucide-react";

interface PropertyMenuPopoverProps {
    fieldId: string;
    label: string;
    visibility: "always" | "hide-empty" | "always-hide";
    onRename: (newLabel: string) => void;
    onVisibilityChange: (newVisibility: "always" | "hide-empty" | "always-hide") => void;
    onDuplicate: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export default function PropertyMenuPopover({ fieldId, label, visibility, onRename, onVisibilityChange, onDuplicate, onDelete, onClose }: PropertyMenuPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [editMode, setEditMode] = useState(false);
    const [tempLabel, setTempLabel] = useState(label);
    const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleSaveRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onRename(tempLabel);
            setEditMode(false);
        } else if (e.key === "Escape") {
            setTempLabel(label);
            setEditMode(false);
        }
    };

    return (
        <div
            ref={popoverRef}
            className="absolute top-8 left-0 z-50 flex animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-2xl w-[260px] flex flex-col text-sm text-gray-200 py-1">

                {/* Header / Rename Field */}
                <div className="px-3 py-2 border-b border-gray-800">
                    {editMode ? (
                        <input
                            autoFocus
                            type="text"
                            value={tempLabel}
                            onChange={e => setTempLabel(e.target.value)}
                            onKeyDown={handleSaveRename}
                            onBlur={() => { onRename(tempLabel); setEditMode(false); }}
                            className="bg-black/20 border border-blue-500 rounded px-2 py-1 focus:outline-none w-full text-white text-xs"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-300 px-2 py-1">
                            <span className="font-medium truncate">{label}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col py-1">
                    <button onClick={() => setEditMode(true)} className="flex items-center gap-3 px-4 py-1.5 hover:bg-white/5 text-left transition-colors text-gray-300">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                        Rename
                    </button>
                    <button className="flex items-center gap-3 px-4 py-1.5 hover:bg-white/5 text-left transition-colors text-gray-300 opacity-50 cursor-not-allowed">
                        <MessageSquare className="w-4 h-4 text-gray-500" />
                        Comment
                    </button>

                    <button
                        className="flex items-center justify-between px-4 py-1.5 hover:bg-white/5 text-left transition-colors text-gray-300 relative group"
                        onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                    >
                        <div className="flex items-center gap-3">
                            {visibility === "always" && <Eye className="w-4 h-4 text-gray-500" />}
                            {visibility === "hide-empty" && <Eye className="w-4 h-4 text-gray-500 opacity-70" />}
                            {visibility === "always-hide" && <EyeOff className="w-4 h-4 text-gray-500" />}
                            Property visibility
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <button className="flex items-center gap-3 px-4 py-1.5 hover:bg-white/5 text-left transition-colors text-gray-300 opacity-50 cursor-not-allowed">
                        <Maximize2 className="w-4 h-4 text-gray-500" />
                        Customize layout
                    </button>
                    <button onClick={() => { onDuplicate(); onClose(); }} className="flex items-center gap-3 px-4 py-1.5 hover:bg-white/5 text-left transition-colors text-gray-300">
                        <Copy className="w-4 h-4 text-gray-500" />
                        Duplicate property
                    </button>
                    <button onClick={() => { onDelete(); onClose(); }} className="flex items-center gap-3 px-4 py-1.5 hover:bg-red-500/10 hover:text-red-400 text-left transition-colors text-gray-300">
                        <Trash2 className="w-4 h-4 text-red-400/70" />
                        Delete property
                    </button>
                </div>
            </div>

            {/* Visibility Sub-menu */}
            {showVisibilityMenu && (
                <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-2xl w-[220px] ml-1 flex flex-col text-sm text-gray-300 animate-in fade-in slide-in-from-left-2 duration-200 h-max py-2 mt-10">
                    <button
                        onClick={() => { onVisibilityChange("always"); setShowVisibilityMenu(false); }}
                        className="w-full text-left px-4 py-1.5 hover:bg-white/5 flex justify-between items-center transition-colors"
                    >
                        <span>Always show</span>
                        {visibility === "always" && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <button
                        onClick={() => { onVisibilityChange("hide-empty"); setShowVisibilityMenu(false); }}
                        className="w-full text-left px-4 py-1.5 hover:bg-white/5 flex justify-between items-center transition-colors"
                    >
                        <span>Hide when empty</span>
                        {visibility === "hide-empty" && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <button
                        onClick={() => { onVisibilityChange("always-hide"); setShowVisibilityMenu(false); }}
                        className="w-full text-left px-4 py-1.5 hover:bg-white/5 flex justify-between items-center transition-colors text-red-400"
                    >
                        <span>Always hide</span>
                        {visibility === "always-hide" && <Check className="w-4 h-4 text-red-500" />}
                    </button>
                </div>
            )}
        </div>
    );
}
