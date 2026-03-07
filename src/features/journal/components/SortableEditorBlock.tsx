import React, { useRef, useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Image as ImageIcon, Upload, Link as LinkIcon } from "lucide-react";
import { EditorBlock } from "@/features/journal/types";

interface SortableEditorBlockProps {
    block: EditorBlock;
    onUpdate: (id: string, updates: Partial<EditorBlock>) => void;
    onInsert: (id: string) => void;
    onRemove: (id: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
    autoFocus?: boolean;
}

export default function SortableEditorBlock({
    block,
    onUpdate,
    onInsert,
    onRemove,
    onKeyDown,
    autoFocus
}: SortableEditorBlockProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const inputRef = useRef<HTMLInputElement>(null);
    const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate(block.id, { content: e.target.value });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Prevent default form submission on enter
        if (e.key === "Enter") {
            e.preventDefault();
        }
        onKeyDown(e, block.id);
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className={`group relative flex items-start w-full py-0.5 ${isDragging ? "opacity-50 drop-shadow-lg" : ""}`}
        >
            {/* Drag Handle & Plus Icons - only show when not a heading without user interaction, but headers can also have them */}
            <div className="absolute -left-12 top-0 md:-left-14 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 z-10">
                {block.type !== "heading" && (
                    <button 
                        type="button" 
                        onClick={() => onInsert(block.id)}
                        className="p-0.5 text-gray-500 hover:text-gray-300 rounded transition-colors" 
                        title="Click to add a block below"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                )}
                <div 
                    {...attributes}
                    {...listeners}
                    className="p-0.5 text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing rounded transition-colors" 
                    title="Drag to move"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>

            <div className="w-full">
                {block.type === "heading" && (
                    <h3 className={`text-lg font-semibold ${block.color ? `text-${block.color}-600` : 'text-green-600'} mb-2 mt-4`}>
                        {block.content}
                    </h3>
                )}

                {block.type === "bullet" && (
                    <div className="flex items-start gap-2 text-gray-300 pl-4 w-full">
                        <span className="mt-1 font-bold">•</span>
                        <input 
                            ref={inputRef}
                            type="text" 
                            name={`block-${block.id}`} 
                            value={block.content} 
                            onChange={handleTextChange} 
                            onKeyDown={handleKeyDown}
                            placeholder="Text" 
                            className="w-full bg-transparent focus:outline-none placeholder-gray-600" 
                        />
                    </div>
                )}

                {block.type === "checkbox" && (
                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer w-max pl-4">
                        <input
                            type="checkbox"
                            checked={block.checked || false}
                            onChange={(e) => onUpdate(block.id, { checked: e.target.checked })}
                            className="w-4 h-4 rounded bg-transparent border-gray-600 checked:bg-green-600 appearance-none border cursor-pointer"
                        />
                        <input 
                            ref={inputRef}
                            type="text" 
                            value={block.content} 
                            onChange={handleTextChange} 
                            onKeyDown={handleKeyDown}
                            placeholder="To-do" 
                            className="bg-transparent focus:outline-none placeholder-gray-600" 
                            onClick={(e) => e.preventDefault()} // Stop checkbox toggle when clicking input
                        />
                    </label>
                )}

                {block.type === "image" && (
                    <div className="pl-4 w-full mt-1 mb-2 relative">
                        {!isImageMenuOpen ? (
                            <button 
                                onClick={() => setIsImageMenuOpen(true)}
                                className="flex items-center gap-2 w-full p-2.5 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent"
                            >
                                <ImageIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">Add an image</span>
                            </button>
                        ) : (
                            <div className="flex flex-col w-full bg-[#252525]/50 border border-gray-800 rounded-lg overflow-hidden shadow-xl mt-1">
                                <button 
                                    onClick={() => setIsImageMenuOpen(false)}
                                    className="flex items-center gap-2 w-full p-2.5 bg-[#1E1E1E] border-b border-gray-800 text-gray-400 hover:text-white transition-colors"
                                >
                                    <ImageIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">Add an image</span>
                                </button>
                                
                                <div className="p-4 bg-[#212121]">
                                    <div className="flex gap-4 border-b border-gray-700/50 pb-2 mb-3">
                                        <button className="text-sm text-gray-200 border-b-2 border-white pb-1 -mb-[9px] font-medium">Upload</button>
                                        <button className="text-sm text-gray-500 hover:text-gray-300 pb-1 -mb-[9px] font-medium">Link</button>
                                        <button className="text-sm text-gray-500 hover:text-gray-300 pb-1 -mb-[9px] font-medium">Unsplash</button>
                                        <button className="text-sm text-gray-500 hover:text-gray-300 pb-1 -mb-[9px] font-medium">GIPHY</button>
                                    </div>
                                    <label className="flex justify-center items-center w-full py-2 bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] border border-gray-700/50 rounded-md text-sm font-medium transition-colors cursor-pointer">
                                        Upload file
                                        <input type="file" className="hidden" accept="image/*" />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
