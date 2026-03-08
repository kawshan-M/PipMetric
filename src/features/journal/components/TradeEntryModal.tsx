"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Focus, MapPin, Target, DollarSign, TextSelect, MessageSquare, Award, CheckCircle, Tag, Camera, GripVertical, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { TradeEntry, EditorBlock } from "@/features/journal/types";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DatePickerPopover from "./DatePickerPopover";
import PropertyMenuPopover from "./PropertyMenuPopover";
import BadgeSelectPopover, { BadgeOption, colorMap } from "./BadgeSelectPopover";
import MultiBadgeSelectPopover from "./MultiBadgeSelectPopover";
import SortableEditorBlock from "./SortableEditorBlock";

interface TradeEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    entryToEdit?: TradeEntry | null;
}

const initialFormState: Omit<TradeEntry, "userId" | "id"> = {
    date: "",
    pairs: "",
    session: "",
    entryWindow: "",
    direction: "",
    pl: "",
    followedRules: "",
    be: "",
    model: "",
    account: "",
    positiveTags: [],
    negativeTags: [],
    rating: "",
    win: "",
    preTradeState: "",
    duringTradeState: "",
    postTradeState: "",
    tradeRules: { rule1: false, rule2: false },
    setupAnalysisText: "",
    setupOutcomeText: "",
    contentBlocks: [],
};

const defaultBlocks: EditorBlock[] = [
    { id: "blk-h1", type: "heading", content: "Mental State & Emotions", color: "green" },
    { id: "blk-b1", type: "bullet", content: "Pre Trade State: " },
    { id: "blk-b2", type: "bullet", content: "During Trade State: " },
    { id: "blk-b3", type: "bullet", content: "Post Trade State: " },
    { id: "blk-h2", type: "heading", content: "Trade Rules", color: "green" },
    { id: "blk-c1", type: "checkbox", content: "Rule 1", checked: false },
    { id: "blk-c2", type: "checkbox", content: "Rule 2", checked: false },
    { id: "blk-h3", type: "heading", content: "Setup Analysis", color: "green" },
    { id: "blk-b4", type: "bullet", content: "" },
    { id: "blk-i1", type: "image", content: "" },
    { id: "blk-h4", type: "heading", content: "Setup Outcome", color: "green" },
    { id: "blk-b5", type: "bullet", content: "" },
    { id: "blk-i2", type: "image", content: "" }
];

// Define the fields configuration
type FieldConfig = {
    id: string;
    label: string;
    icon: React.ReactNode;
    name: string;
    type: "text" | "date" | "number" | "select" | "checkbox" | "tags" | "badge-select" | "multi-badge-select";
    visibility?: "always" | "hide-empty" | "always-hide";
    isPositiveTags?: boolean;
    min?: number;
    max?: number;
    step?: string;
    options?: { value: string, label: string }[] | BadgeOption[];
    disableCreate?: boolean;
};

const defaultFields: FieldConfig[] = [
    { id: "f-date", name: "date", label: "Date", icon: <Calendar className="w-4 h-4" />, type: "date", visibility: "always" },
    { id: "f-pairs", name: "pairs", label: "Pairs", icon: <Focus className="w-4 h-4" />, type: "badge-select", options: [], visibility: "always" },
    {
        id: "f-session", name: "session", label: "Session", icon: <MapPin className="w-4 h-4" />, type: "badge-select", options: [
            { id: "opt-asian", value: "Asian", label: "Asian", color: "yellow" },
            { id: "opt-london", value: "London", label: "London", color: "green" },
            { id: "opt-new-york", value: "New York", label: "New York", color: "blue" }
        ], visibility: "always", disableCreate: true
    },
    {
        id: "f-entryWindow", name: "entryWindow", label: "Entry Window", icon: <Calendar className="w-4 h-4" />, type: "badge-select", options: [
            { id: "ew-1-2am", value: "1-2am", label: "1-2am", color: "green" },
            { id: "ew-2-3am", value: "2-3am", label: "2-3am", color: "green" },
            { id: "ew-3-4am", value: "3-4am", label: "3-4am", color: "green" },
            { id: "ew-4-5am", value: "4-5am", label: "4-5am", color: "green" },
            { id: "ew-5-6am", value: "5-6am", label: "5-6am", color: "green" },
            { id: "ew-6-7am", value: "6-7am", label: "6-7am", color: "green" },
            { id: "ew-7-8am", value: "7-8am", label: "7-8am", color: "blue" },
            { id: "ew-8-9am", value: "8-9am", label: "8-9am", color: "blue" },
            { id: "ew-9-10am", value: "9-10am", label: "9-10am", color: "blue" },
            { id: "ew-10-11am", value: "10-11am", label: "10-11am", color: "blue" },
            { id: "ew-11-12pm", value: "11-12pm", label: "11-12pm", color: "blue" },
            { id: "ew-12-1pm", value: "12-1pm", label: "12-1pm", color: "blue" },
            { id: "ew-1-2pm", value: "1-2pm", label: "1-2pm", color: "blue" },
            { id: "ew-2-3pm", value: "2-3pm", label: "2-3pm", color: "blue" },
            { id: "ew-3-4pm", value: "3-4pm", label: "3-4pm", color: "blue" }
        ], visibility: "always"
    },
    {
        id: "f-direction", name: "direction", label: "Direction", icon: <Target className="w-4 h-4" />, type: "badge-select", options: [
            { id: "dir-long", value: "LONG", label: "LONG", color: "green" },
            { id: "dir-short", value: "SHORT", label: "SHORT", color: "red" }
        ], visibility: "always", disableCreate: true
    },
    { id: "f-pl", name: "pl", label: "Profit/Loss", icon: <DollarSign className="w-4 h-4" />, type: "number", step: "0.1", visibility: "always" },
    {
        id: "f-followedRules", name: "followedRules", label: "Followed rules", icon: <CheckCircle className="w-4 h-4" />, type: "badge-select", options: [
            { id: "fr-yes", value: "Yes", label: "Yes", color: "green" },
            { id: "fr-no", value: "No", label: "No", color: "red" }
        ], visibility: "always", disableCreate: true
    },
    {
        id: "f-be", name: "be", label: "BE", icon: <CheckCircle className="w-4 h-4" />, type: "badge-select", options: [
            { id: "be-yes", value: "Yes", label: "Yes", color: "green" },
            { id: "be-no", value: "No", label: "No", color: "red" }
        ], visibility: "always", disableCreate: true
    },
    {
        id: "f-model", name: "model", label: "Model", icon: <TextSelect className="w-4 h-4" />, type: "badge-select", options: [
            { id: "mod-2", value: "Model 2", label: "Model 2", color: "gray" },
            { id: "mod-1", value: "Model 1", label: "Model 1", color: "red" }
        ], visibility: "always"
    },
    {
        id: "f-account", name: "account", label: "Account", icon: <MessageSquare className="w-4 h-4" />, type: "badge-select", options: [
            { id: "acc-1", value: "Account1", label: "Account1", color: "default" },
            { id: "acc-2", value: "Account2", label: "Account2", color: "purple" },
            { id: "acc-3", value: "Account3", label: "Account3", color: "pink" }
        ], visibility: "always"
    },
    {
        id: "f-positiveTags", name: "positiveTags", label: "Positive tags", icon: <Tag className="w-4 h-4" />, type: "multi-badge-select", isPositiveTags: true, options: [
            { id: "pt-1", value: "well-managed", label: "well-managed", color: "green" },
            { id: "pt-2", value: "perfect-entry", label: "perfect-entry", color: "green" }
        ], visibility: "always"
    },
    {
        id: "f-negativeTags", name: "negativeTags", label: "Negative tags", icon: <Tag className="w-4 h-4" />, type: "multi-badge-select", isPositiveTags: false, options: [
            { id: "nt-1", value: "early-exit", label: "early-exit", color: "red" },
            { id: "nt-2", value: "sl-placement", label: "sl-placement", color: "red" },
            { id: "nt-3", value: "impulsive", label: "impulsive", color: "red" },
            { id: "nt-4", value: "revenge-trading", label: "revenge-trading", color: "red" }
        ], visibility: "always"
    },
    { id: "f-rating", name: "rating", label: "Rating(1-5)", icon: <Award className="w-4 h-4" />, type: "number", min: 1, max: 5, visibility: "always" },
    {
        id: "f-win", name: "win", label: "WIN", icon: <CheckCircle className="w-4 h-4" />, type: "badge-select", options: [
            { id: "win-yes", value: "Yes", label: "Yes", color: "green" },
            { id: "win-no", value: "No", label: "No", color: "red" }
        ], visibility: "always", disableCreate: true
    },
];


function SortableField({
    field,
    formData,
    handleChange,
    handleTagsChange,
    onRename,
    onVisibilityChange,
    onDuplicate,
    onDelete,
    onUpdateFieldOptions
}: {
    field: FieldConfig,
    formData: any,
    handleChange: any,
    handleTagsChange: any,
    onRename: (id: string, newLabel: string) => void,
    onVisibilityChange: (id: string, visibility: "always" | "hide-empty" | "always-hide") => void,
    onDuplicate: (id: string) => void,
    onDelete: (id: string) => void,
    onUpdateFieldOptions: (id: string, newOptions: any[]) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: field.id });

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isBadgeSelectOpen, setIsBadgeSelectOpen] = useState(false);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging || isDatePickerOpen || isMenuOpen || isBadgeSelectOpen ? 10 : 1,
    };

    const handleDateChange = (data: { startDate: string, endDate?: string, includeTime: boolean, startTime?: string, endTime?: string, timeFormat?: string, timezone?: string }) => {
        let dateString = data.startDate;

        let formatData = "";
        if (data.timeFormat && data.timezone) {
            formatData = `|${data.timeFormat}|${data.timezone}`;
        }

        if (data.includeTime && data.startTime) {
            dateString += ` ${data.startTime}`;
        }
        if (data.endDate) {
            dateString += ` → ${data.endDate}`;
            if (data.includeTime && data.endTime) {
                dateString += ` ${data.endTime}`;
            }
        }

        handleChange({
            target: { name: field.name, value: dateString + formatData, type: "text" }
        });
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return "Empty";

        // Extract formatting metadata if it exists
        let cleanDateStr = dateStr;
        let tFormat = "12 hour";
        let tz = "";

        if (dateStr.includes("|")) {
            const parts = dateStr.split("|");
            cleanDateStr = parts[0];
            tFormat = parts[1] || "12 hour";
            tz = parts[2] || "";
        }

        const formatSingle = (str: string, short: boolean) => {
            const hasTime = str.includes(" ");
            const datePart = str.split(" ")[0];
            const timePart = hasTime ? str.split(" ")[1] : null;

            const dateObj = new Date(datePart);
            let result = dateObj.toLocaleString('en-US', {
                month: short ? 'short' : 'long',
                day: 'numeric',
                year: 'numeric'
            });

            if (timePart && tFormat !== "Hidden") {
                const [hours, minutes] = timePart.split(":");
                let h = parseInt(hours, 10);

                if (tFormat === "24 hour") {
                    result += ` ${hours}:${minutes}`;
                } else {
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12;
                    h = h ? h : 12;
                    result += ` ${h}:${minutes} ${ampm}`;
                }
            }
            return result;
        };

        const parts = cleanDateStr.split(" → ");
        let finalDisplay = "";

        if (parts.length === 1) {
            finalDisplay = formatSingle(parts[0], false);
        } else {
            finalDisplay = `${formatSingle(parts[0], true)} → ${formatSingle(parts[1], true)}`;
        }

        if (tz && tFormat !== "Hidden" && cleanDateStr.includes(" ")) {
            finalDisplay += ` ${tz}`;
        }

        return finalDisplay;
    };

    return (
        <div ref={setNodeRef} style={style} className={`flex items-center gap-6 py-1 border-b border-transparent hover:border-gray-800/40 transition-colors group relative ${isDragging ? 'opacity-50 drop-shadow-lg' : ''}`}>

            <div className="flex items-center gap-2 text-gray-400 min-w-[170px] relative">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="p-1 -ml-2 cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical className="w-4 h-4" />
                </div>

                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-white/5 py-1 px-2 -ml-2 rounded transition-colors"
                    onClick={() => setIsMenuOpen(true)}
                >
                    {field.icon}
                    <span>{field.label}</span>
                </div>

                {/* Property Context Menu Popover */}
                {isMenuOpen && (
                    <PropertyMenuPopover
                        fieldId={field.id}
                        label={field.label}
                        visibility={field.visibility || "always"}
                        onRename={(newLabel) => onRename(field.id, newLabel)}
                        onVisibilityChange={(viz) => onVisibilityChange(field.id, viz)}
                        onDuplicate={() => onDuplicate(field.id)}
                        onDelete={() => onDelete(field.id)}
                        onClose={() => setIsMenuOpen(false)}
                    />
                )}
            </div>

            <div className="flex-1">
                {field.type === "text" && (
                    <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} placeholder="Empty" className="w-full bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:text-white py-1 min-h-[28px]" />
                )}
                {field.type === "date" && (
                    <div className="relative w-full">
                        <div
                            onClick={() => setIsDatePickerOpen(true)}
                            className="w-full bg-transparent text-gray-300 font-medium cursor-pointer py-1 min-h-[28px] flex items-center"
                        >
                            {formatDateDisplay(formData[field.name])}
                        </div>
                        {isDatePickerOpen && (
                            <DatePickerPopover
                                value={formData[field.name]}
                                onChange={handleDateChange}
                                onClose={() => setIsDatePickerOpen(false)}
                            />
                        )}
                    </div>
                )}
                {field.type === "number" && (
                    <input type="number" step={field.step} min={field.min} max={field.max} name={field.name} value={formData[field.name] === null ? "" : formData[field.name]} onChange={handleChange} placeholder="Empty" className="w-full bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:text-white py-1 min-h-[28px] hide-spinners" />
                )}
                {field.type === "select" && (
                    <select name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full bg-transparent text-gray-400 focus:outline-none focus:text-white appearance-none cursor-pointer py-1 min-h-[28px]">
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                )}
                {field.type === "checkbox" && (
                    <input type="checkbox" name={field.name} checked={formData[field.name]} onChange={handleChange} className={`w-4 h-4 rounded bg-transparent border-gray-600 appearance-none border cursor-pointer ${field.name === 'win' ? 'checked:bg-green-500' : 'checked:bg-blue-500'}`} />
                )}
                {field.type === "tags" && (
                    <input type="text" value={formData[field.name].join(", ")} onChange={(e) => handleTagsChange(e, field.isPositiveTags!)} placeholder="Comma separated..." className="w-full bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:text-white" />
                )}
                {field.type === "badge-select" && (
                    <div className="relative w-full">
                        <div
                            onClick={() => setIsBadgeSelectOpen(true)}
                            className="w-full bg-transparent font-medium cursor-pointer py-1 min-h-[28px] flex items-center"
                        >
                            {formData[field.name] ? (() => {
                                const selectedOpt = (field.options as BadgeOption[])?.find(o => o.value === formData[field.name]);
                                if (selectedOpt) {
                                    return (
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium truncate ${colorMap[selectedOpt.color || "default"].bg} ${colorMap[selectedOpt.color || "default"].text}`}>
                                            {selectedOpt.label}
                                        </span>
                                    );
                                }
                                return <span className="text-gray-400">Empty</span>;
                            })() : <span className="text-gray-600">Empty</span>}
                        </div>
                        {isBadgeSelectOpen && (
                            <BadgeSelectPopover
                                options={(field.options as BadgeOption[]) || []}
                                selectedValue={formData[field.name] || ""}
                                onChange={(value) => handleChange({ target: { name: field.name, value, type: "text" } })}
                                onUpdateOptions={(newOptions) => onUpdateFieldOptions(field.id, newOptions)}
                                onClose={() => setIsBadgeSelectOpen(false)}
                                disableCreate={field.disableCreate}
                            />
                        )}
                    </div>
                )}
                {field.type === "multi-badge-select" && (
                    <div className="relative w-full">
                        <div
                            onClick={() => setIsBadgeSelectOpen(true)}
                            className="w-full bg-transparent font-medium cursor-pointer py-1 min-h-[28px] flex items-center gap-1 flex-wrap"
                        >
                            {formData[field.name] && formData[field.name].length > 0 ? (
                                formData[field.name].map((val: string) => {
                                    const selectedOpt = (field.options as BadgeOption[])?.find(o => o.value === val);
                                    if (selectedOpt) {
                                        return (
                                            <span key={val} className={`px-2 py-0.5 rounded text-xs font-medium truncate ${colorMap[selectedOpt.color || "default"].bg} ${colorMap[selectedOpt.color || "default"].text}`}>
                                                {selectedOpt.label}
                                            </span>
                                        );
                                    }
                                    return null;
                                })
                            ) : <span className="text-gray-600">Empty</span>}
                        </div>
                        {isBadgeSelectOpen && (
                            <MultiBadgeSelectPopover
                                options={(field.options as BadgeOption[]) || []}
                                selectedValues={formData[field.name] || []}
                                onChange={(values) => handleChange({ target: { name: field.name, value: values, type: "multi-badge" } } as any)}
                                onUpdateOptions={(newOptions) => onUpdateFieldOptions(field.id, newOptions)}
                                onClose={() => setIsBadgeSelectOpen(false)}
                                disableCreate={field.disableCreate}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

const BlockWrapper = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`group relative flex items-start ${className}`}>
            <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-10">
                <button type="button" className="p-0.5 text-gray-500 hover:text-gray-300 rounded transition-colors" title="Click to add a block below">
                    <Plus className="w-4 h-4" />
                </button>
                <div className="p-0.5 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing rounded transition-colors" title="Drag to move">
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>
            <div className="w-full">{children}</div>
        </div>
    );
};

export default function TradeEntryModal({ isOpen, onClose, entryToEdit }: TradeEntryModalProps) {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialFormState);
    const [fields, setFields] = useState(defaultFields);
    const [blocks, setBlocks] = useState<EditorBlock[]>(defaultBlocks);
    const [showHidden, setShowHidden] = useState(false);
    const [focusBlockId, setFocusBlockId] = useState<string | null>(null);

    // Hydrate form if editing an existing entry
    useEffect(() => {
        if (isOpen && entryToEdit) {
            // Map the saved iconName back to the actual lucide-react component
            const iconMap: Record<string, React.ReactNode> = {
                "Calendar": <Calendar className="w-4 h-4" />,
                "Focus": <Focus className="w-4 h-4" />,
                "MapPin": <MapPin className="w-4 h-4" />,
                "Target": <Target className="w-4 h-4" />,
                "DollarSign": <DollarSign className="w-4 h-4" />,
                "CheckCircle": <CheckCircle className="w-4 h-4" />,
                "TextSelect": <TextSelect className="w-4 h-4" />,
                "MessageSquare": <MessageSquare className="w-4 h-4" />,
                "Tag": <Tag className="w-4 h-4" />,
                "Award": <Award className="w-4 h-4" />,
                "FileText": <Calendar className="w-4 h-4" /> // Fallback
            };

            if (entryToEdit.formFields) {
                const restoredFields = entryToEdit.formFields.map((f: any) => ({
                    ...f,
                    icon: iconMap[f.iconName] || <Calendar className="w-4 h-4" />
                }));
                // Make sure any newly added default fields are also included if they didn't exist when the trade was saved
                // For simplicity we just use exactly what was saved for layout consistency
                setFields(restoredFields as FieldConfig[]);
            }

            if (entryToEdit.contentBlocks) {
                setBlocks(entryToEdit.contentBlocks);
            }

            // Exclude non-form properties
            const { id, userId, createdAt, formFields, contentBlocks, ...restOfData } = entryToEdit;
            setFormData({ ...initialFormState, ...restOfData } as any);

        } else if (isOpen && !entryToEdit) {
            // Reset to default when opening fresh
            setFormData(initialFormState);
            setFields(defaultFields);
            setBlocks(defaultBlocks);
        }
    }, [isOpen, entryToEdit]);

    // Initialize drag sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires minimum 5px movement to start drag (allows clicking inputs)
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setFields((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleBlockDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Form handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | any) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === "number") {
            setFormData(prev => ({ ...prev, [name]: value === "" ? null : Number(value) }));
        } else if (type === "multi-badge") {
            setFormData(prev => ({ ...prev, [name]: value }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>, isPositive: boolean) => {
        const tags = e.target.value.split(",").map(t => t.trim()).filter(t => t !== "");
        if (isPositive) {
            setFormData(prev => ({ ...prev, positiveTags: tags }));
        } else {
            setFormData(prev => ({ ...prev, negativeTags: tags }));
        }
    };

    const handleRename = (id: string, newLabel: string) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, label: newLabel } : f));
    };

    const handleVisibilityChange = (id: string, visibility: "always" | "hide-empty" | "always-hide") => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, visibility } : f));
    };

    const handleDuplicate = (id: string) => {
        setFields(prev => {
            const index = prev.findIndex(f => f.id === id);
            if (index === -1) return prev;
            const fieldToClone = prev[index];
            const newField = { ...fieldToClone, id: `f-${Date.now()}`, name: `${fieldToClone.name}_copy_${Date.now()}` };

            const newFields = [...prev];
            newFields.splice(index + 1, 0, newField);
            return newFields;
        });
    };

    const handleDelete = (id: string) => {
        const fieldToDelete = fields.find(f => f.id === id);
        if (!fieldToDelete) return;

        setFields(prev => prev.filter(f => f.id !== id));
        // Remove from formData as well to keep state clean
        setFormData(prev => {
            const newData = { ...prev };
            delete newData[fieldToDelete.name as keyof typeof newData];
            return newData;
        });
    };

    const handleUpdateFieldOptions = (id: string, newOptions: any[]) => {
        setFields(prev => prev.map(f => f.id === id ? { ...f, options: newOptions } : f));
    };

    const handleUpdateBlock = (id: string, updates: Partial<EditorBlock>) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const handleInsertBlock = (afterId: string, type: EditorBlock["type"] = "bullet") => {
        const newId = `blk-${Date.now()}`;
        const newBlock: EditorBlock = { id: newId, type, content: "" };

        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === afterId);
            if (index === -1) return [...prev, newBlock];
            const newBlocks = [...prev];
            newBlocks.splice(index + 1, 0, newBlock);
            return newBlocks;
        });
        setFocusBlockId(newId);
    };

    const handleRemoveBlock = (id: string) => {
        setBlocks(prev => {
            const index = prev.findIndex(b => b.id === id);
            if (index > 0) {
                // Focus previous block if possible
                setFocusBlockId(prev[index - 1].id);
            }
            return prev.filter(b => b.id !== id);
        });
    };

    const handleBlockKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // Automatically insert new generic block below when hitting enter
            const currentBlock = blocks.find(b => b.id === id);
            // Typically if in a checkbox, we want another checkbox
            const newType = currentBlock?.type === "checkbox" ? "checkbox" : "bullet";
            handleInsertBlock(id, newType);
        } else if (e.key === "Backspace") {
            const currentBlock = blocks.find(b => b.id === id);
            if (currentBlock && currentBlock.content === "") {
                e.preventDefault();
                handleRemoveBlock(id);
            }
        }
    };

    const handleSubmit = async () => {
        if (!user) return alert("You must be logged in to save entries.");

        setIsSubmitting(true);
        try {
            // Clean fields to remove React elements
            const cleanedFields = fields.map(f => {
                const { icon, ...rest } = f;

                // Keep track of the original icon for rendering later
                let iconName = "FileText"; // default
                if (f.id === "f-date") iconName = "Calendar";
                else if (f.id === "f-pairs") iconName = "Focus";
                else if (f.id === "f-session") iconName = "MapPin";
                else if (f.id === "f-entryWindow") iconName = "Calendar";
                else if (f.id === "f-direction") iconName = "Target";
                else if (f.id === "f-pl") iconName = "DollarSign";
                else if (f.id === "f-followedRules") iconName = "CheckCircle";
                else if (f.id === "f-be") iconName = "CheckCircle";
                else if (f.id === "f-model") iconName = "TextSelect";
                else if (f.id === "f-account") iconName = "MessageSquare";
                else if (f.id === "f-positiveTags") iconName = "Tag";
                else if (f.id === "f-negativeTags") iconName = "Tag";
                else if (f.id === "f-rating") iconName = "Award";
                else if (f.id === "f-win") iconName = "CheckCircle";

                return { ...rest, iconName };
            });

            const entryData: TradeEntry = {
                ...formData,
                contentBlocks: blocks,
                formFields: cleanedFields,
                userId: user.uid,
                updatedAt: serverTimestamp(),
                createdAt: entryToEdit?.createdAt || serverTimestamp(),
            };

            if (entryToEdit && entryToEdit.id) {
                // Update existing
                const docRef = doc(db, "users", user.uid, "journal_entries", entryToEdit.id);
                await updateDoc(docRef, entryData as any);
            } else {
                // Create new
                const entriesRef = collection(db, "users", user.uid, "journal_entries");
                await addDoc(entriesRef, entryData);
            }

            // Trigger close & reset
            setFormData(initialFormState);
            onClose();
        } catch (error) {
            console.error("Error saving trade entry:", error);
            alert("Failed to save entry. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const visibleFields = fields.filter((f) => {
        if (showHidden) return true;

        if (f.visibility === "always-hide") return false;

        if (f.visibility === "hide-empty") {
            const val = formData[f.name as keyof typeof formData];
            // Check for empty strings, nulls, or empty tags arrays
            if (val === "" || val === null) return false;
            if (Array.isArray(val) && val.length === 0) return false;
        }

        return true;
    });

    const hiddenCount = fields.length - visibleFields.length;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Centered Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl max-h-[90vh] bg-[#1E1E1E] shadow-2xl z-50 overflow-y-auto rounded-xl border border-gray-800/80 animate-in fade-in zoom-in-95 duration-200 hide-scrollbar">
                <div className="p-6 md:p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Target className="w-6 h-6 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">
                                {entryToEdit ? "Edit Trade Entry" : "Trade Entry"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Details */}
                    <div className="flex flex-col gap-6 text-sm">

                        {/* 1. Core Properties (Draggable) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={visibleFields.map(f => f.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {visibleFields.map((field) => (
                                        <SortableField
                                            key={field.id}
                                            field={field}
                                            formData={formData}
                                            handleChange={handleChange}
                                            handleTagsChange={handleTagsChange}
                                            onRename={handleRename}
                                            onVisibilityChange={handleVisibilityChange}
                                            onDuplicate={handleDuplicate}
                                            onDelete={handleDelete}
                                            onUpdateFieldOptions={handleUpdateFieldOptions}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {hiddenCount > 0 && (
                            <div className="flex justify-start px-2 mt-2">
                                <button
                                    onClick={() => setShowHidden(!showHidden)}
                                    className="text-gray-500 hover:text-gray-300 transition-colors text-xs font-medium flex items-center"
                                >
                                    {showHidden ? "Hide empty properties" : `${hiddenCount} hidden propert${hiddenCount > 1 ? 'ies' : 'y'}`}
                                </button>
                            </div>
                        )}

                        <div className="h-[1px] w-full bg-gray-800/80 my-4"></div>

                        {/* Dynamic Blocks Section */}
                        <div className="flex flex-col gap-1 w-[90%] md:w-[85%] mx-auto mt-2">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleBlockDragEnd}
                            >
                                <SortableContext
                                    items={blocks.map(b => b.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {blocks.map((block) => (
                                        <SortableEditorBlock
                                            key={block.id}
                                            block={block}
                                            onUpdate={handleUpdateBlock}
                                            onInsert={handleInsertBlock}
                                            onRemove={handleRemoveBlock}
                                            onKeyDown={handleBlockKeyDown}
                                            autoFocus={focusBlockId === block.id}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {/* Save Button */}
                        <div className="mt-8 pt-6 border-t border-gray-800/80 flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Entry"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

