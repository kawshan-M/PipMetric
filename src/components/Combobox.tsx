
"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

interface ComboboxProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function Combobox({ options, value, onChange, placeholder = "Select...", className = "" }: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white flex items-center justify-between focus:outline-none focus:border-[#007BFF] focus:ring-1 focus:ring-[#007BFF] transition-all"
            >
                <span className={value ? "text-white" : "text-gray-600"}>
                    {value || placeholder}
                </span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#0B0E11] border border-gray-800 rounded-xl shadow-xl max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-gray-800 sticky top-0 bg-[#0B0E11]">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-900 text-sm text-white rounded-lg pl-9 pr-3 py-2 outline-none border border-transparent focus:border-[#007BFF]"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-900 ${value === option ? "text-[#007BFF] bg-[#007BFF]/10" : "text-gray-300"
                                        }`}
                                >
                                    {option}
                                    {value === option && <Check size={14} />}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
