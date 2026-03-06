"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Search, MoreHorizontal, Check, Trash2, ArrowLeft } from "lucide-react";

export type BadgeOption = {
    id: string;
    value: string;
    label: string;
    color: BadgeColor;
};

export type BadgeColor = "default" | "gray" | "brown" | "orange" | "yellow" | "green" | "blue" | "purple" | "pink" | "red";

export const colorMap: Record<BadgeColor, { bg: string, text: string, hover: string }> = {
    default: { bg: "bg-gray-800", text: "text-gray-300", hover: "hover:bg-gray-700" },
    gray: { bg: "bg-[#252525]", text: "text-[#9B9A97]", hover: "hover:bg-[#2A2A2A]" },
    brown: { bg: "bg-[#2A2420]", text: "text-[#BA856F]", hover: "hover:bg-[#312B26]" },
    orange: { bg: "bg-[#2E261A]", text: "text-[#C77D48]", hover: "hover:bg-[#362D1F]" },
    yellow: { bg: "bg-[#2E2916]", text: "text-[#CA9849]", hover: "hover:bg-[#36301A]" },
    green: { bg: "bg-[#1C2C24]", text: "text-[#529E72]", hover: "hover:bg-[#21352A]" },
    blue: { bg: "bg-[#1D282E]", text: "text-[#5E87C9]", hover: "hover:bg-[#233037]" },
    purple: { bg: "bg-[#29222B]", text: "text-[#9D68D3]", hover: "hover:bg-[#312833]" },
    pink: { bg: "bg-[#2C1F26]", text: "text-[#D15796]", hover: "hover:bg-[#34242D]" },
    red: { bg: "bg-[#301C1D]", text: "text-[#DF5452]", hover: "hover:bg-[#392223]" }
};

interface BadgeSelectPopoverProps {
    options: BadgeOption[];
    selectedValue: string;
    onChange: (value: string) => void;
    onUpdateOptions: (newOptions: BadgeOption[]) => void;
    onClose: () => void;
    disableCreate?: boolean;
}

export default function BadgeSelectPopover({ options, selectedValue, onChange, onUpdateOptions, onClose, disableCreate }: BadgeSelectPopoverProps) {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingOption, setEditingOption] = useState<BadgeOption | null>(null);
    const [tempLabel, setTempLabel] = useState("");

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

    const filteredOptions = options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()));

    // Exact match check to determine if we show the "Create" button
    const exactMatch = options.find(opt => opt.label.toLowerCase() === searchQuery.toLowerCase());
    const shouldShowCreate = !disableCreate && searchQuery.trim().length > 0 && !exactMatch;

    const handleCreate = () => {
        const newTerm = searchQuery.trim();
        if (!newTerm) return;

        const newOption: BadgeOption = {
            id: `opt-${Date.now()}`,
            value: newTerm,
            label: newTerm,
            color: "default"
        };

        const updated = [...options, newOption];
        onUpdateOptions(updated);
        onChange(newOption.value);
        onClose();
    };

    const handleSelectOption = (value: string) => {
        onChange(value === selectedValue ? "" : value);
        onClose();
    };

    const handleEditStart = (e: React.MouseEvent, opt: BadgeOption) => {
        e.stopPropagation();
        setEditingOption(opt);
        setTempLabel(opt.label);
    };

    const handleSaveEdit = (e?: React.KeyboardEvent<HTMLInputElement>) => {
        if (e && e.key !== "Enter") {
            if (e.key === "Escape") setEditingOption(null);
            return;
        }

        if (!editingOption) return;

        const updatedLabel = tempLabel.trim() || editingOption.label;
        const updatedOptions = options.map(o =>
            o.id === editingOption.id ? { ...o, label: updatedLabel, value: updatedLabel } : o
        );

        onUpdateOptions(updatedOptions);

        // If they had this item selected, update the parent value state as well
        if (selectedValue === editingOption.value && updatedLabel !== editingOption.value) {
            onChange(updatedLabel);
        }

        setEditingOption(null);
    };

    const handleDeleteOption = () => {
        if (!editingOption) return;
        const updatedOptions = options.filter(o => o.id !== editingOption.id);
        onUpdateOptions(updatedOptions);
        if (selectedValue === editingOption.value) {
            onChange("");
        }
        setEditingOption(null);
    };

    const handleChangeColor = (color: BadgeColor) => {
        if (!editingOption) return;
        const updatedOptions = options.map(o =>
            o.id === editingOption.id ? { ...o, color } : o
        );
        onUpdateOptions(updatedOptions);
        setEditingOption({ ...editingOption, color });
    };

    // Render Edit Submenu
    if (editingOption) {
        return (
            <div ref={popoverRef} className="absolute left-[200px] top-6 z-50 flex animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-[260px] flex flex-col text-sm text-gray-200 py-2">

                    {/* Header */}
                    <div className="flex items-center gap-2 px-3 pb-2 border-b border-gray-800">
                        <button onClick={() => setEditingOption(null)} className="p-1 hover:bg-white/10 rounded">
                            <ArrowLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <input
                            autoFocus
                            type="text"
                            value={tempLabel}
                            onChange={(e) => setTempLabel(e.target.value)}
                            onKeyDown={handleSaveEdit}
                            onBlur={() => handleSaveEdit()}
                            className="bg-black/20 border border-blue-500 rounded px-2 py-1 focus:outline-none w-full text-white text-xs"
                        />
                    </div>

                    {/* Delete Action */}
                    <button
                        onClick={handleDeleteOption}
                        className="flex items-center gap-2 px-4 py-2 mt-1 hover:bg-white/5 text-gray-300 w-full text-left transition-colors"
                    >
                        <Trash2 className="w-4 h-4 text-gray-500" />
                        Delete
                    </button>

                    <div className="h-[1px] w-full bg-gray-800 my-1"></div>

                    {/* Color Picker */}
                    <div className="px-4 py-1 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Colors</div>
                    <div className="flex flex-col py-1 overflow-y-auto max-h-[220px] style-scrollbar">
                        {(Object.keys(colorMap) as BadgeColor[]).map((color) => (
                            <button
                                key={color}
                                onClick={() => handleChangeColor(color)}
                                className="flex items-center justify-between px-4 py-1.5 hover:bg-white/5 text-gray-300 w-full text-left transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Color Indicator Box */}
                                    <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${colorMap[color].bg}`}>
                                        <div className={`w-2.5 h-2.5 rounded-full bg-current ${colorMap[color].text}`}></div>
                                    </div>
                                    <span className="capitalize">{color}</span>
                                </div>
                                {editingOption.color === color && <Check className="w-4 h-4 text-gray-400" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Render Main Select Menu
    return (
        <div ref={popoverRef} className="absolute left-[200px] top-6 z-50 flex animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-[0_4px_30px_rgba(0,0,0,0.5)] w-[280px] flex flex-col text-sm text-gray-200 py-2">

                {/* Search Input */}
                <div className="px-3 pb-2 border-b border-gray-800 relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-5 top-2" />
                    <input
                        type="text"
                        placeholder="Search for an option..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border border-none rounded pl-8 pr-3 py-1.5 focus:outline-none text-gray-300 placeholder-gray-500 text-[13px]"
                        autoFocus
                    />
                </div>

                <div className="flex flex-col py-2 max-h-[300px] overflow-y-auto style-scrollbar">
                    {/* Create New Option */}
                    {shouldShowCreate && (
                        <div className="px-2 mb-1">
                            <button
                                onClick={handleCreate}
                                className="w-full text-left px-2 py-1.5 hover:bg-white/5 rounded transition-colors text-gray-300 flex items-center gap-2"
                            >
                                <span>Create</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${colorMap.default.bg} ${colorMap.default.text}`}>
                                    {searchQuery}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Options Header */}
                    {options.length > 0 && <div className="px-4 py-1 text-xs text-gray-500 mb-1">{disableCreate ? "Select an option" : "Select an option or create one"}</div>}

                    {/* List Options */}
                    {filteredOptions.map((opt) => (
                        <div
                            key={opt.id}
                            className="flex items-center justify-between px-2 mx-2 py-1 hover:bg-white/5 rounded transition-colors group cursor-pointer"
                            onClick={() => handleSelectOption(opt.value)}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                {selectedValue === opt.value ? (
                                    <div className="w-4 flex justify-center"><Check className="w-3.5 h-3.5 text-blue-500" /></div>
                                ) : (
                                    <div className="w-4 flex justify-center"><div className="w-1.5 h-1.5 bg-gray-600 rounded-full group-hover:bg-gray-400 transition-colors"></div></div>
                                )}
                                <span className={`px-2 py-0.5 rounded text-xs font-medium truncate ${colorMap[opt.color || "default"].bg} ${colorMap[opt.color || "default"].text}`}>
                                    {opt.label}
                                </span>
                            </div>

                            {/* Edit Button hidden until hover */}
                            <button
                                onClick={(e) => handleEditStart(e, opt)}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-all text-gray-400 hover:text-white"
                            >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
