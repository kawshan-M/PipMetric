"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-0 w-full z-50 bg-[#0B0E11]/80 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent">
                    PipMetric
                </Link>

                <nav className="hidden md:flex items-center gap-8 font-medium">
                    <Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
                    <Link href="#" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
                    <Link href="#" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">
                        Login
                    </Link>
                    <Link href="/dashboard" className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-[#007BFF]/20">
                        Get Started
                    </Link>
                </div>

                <button
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-[#0B0E11] border-b border-gray-800 p-6 space-y-4">
                    <Link href="/" className="block text-gray-300 hover:text-white font-medium">Home</Link>
                    <Link href="#" className="block text-gray-300 hover:text-white font-medium">About Us</Link>
                    <Link href="#" className="block text-gray-300 hover:text-white font-medium">Contact</Link>
                    <Link href="/dashboard" className="block text-gray-300 hover:text-white font-medium pt-4 border-t border-gray-800">Login</Link>
                </div>
            )}
        </header>
    );
}
