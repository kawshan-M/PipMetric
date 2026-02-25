"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-4 z-50 w-full px-6 flex justify-center pointer-events-none">
            <div className="w-full max-w-7xl flex items-center justify-between pointer-events-auto">
                {/* Logo - Far Left */}
                <div className="flex-1">
                    <Link href="/" className="text-2xl font-bold font-sans tracking-tight bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent inline-block">
                        PipMetric
                    </Link>
                </div>

                {/* Floating Pill Nav - Centered */}
                <nav className="hidden md:flex items-center gap-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-10 py-3 shadow-2xl">
                    <Link href="/" className="text-white/60 hover:text-white transition-colors font-medium text-sm tracking-wide uppercase">Home</Link>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors font-medium text-sm tracking-wide uppercase">About Us</Link>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors font-medium text-sm tracking-wide uppercase">Features</Link>
                    <Link href="#" className="text-white/60 hover:text-white transition-colors font-medium text-sm tracking-wide uppercase">Contact</Link>
                </nav>

                {/* Auth Actions - Far Right */}
                <div className="hidden md:flex items-center justify-end gap-6 flex-1">
                    <Link href="/dashboard" className="text-white/60 hover:text-white font-medium transition-colors text-sm tracking-wide uppercase">
                        Login
                    </Link>
                    <Link href="/dashboard" className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,123,255,0.3)] hover:shadow-[0_0_30px_rgba(0,123,255,0.5)]">
                        Get Started
                    </Link>
                </div>

                <div className="flex-1 flex justify-end md:hidden">
                    <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-6 right-6 bg-[#0B0E11]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl pointer-events-auto">
                    <Link href="/" className="block text-white/60 hover:text-white font-medium uppercase tracking-wide text-sm">Home</Link>
                    <Link href="#" className="block text-white/60 hover:text-white font-medium uppercase tracking-wide text-sm">About Us</Link>
                    <Link href="#" className="block text-white/60 hover:text-white font-medium uppercase tracking-wide text-sm">Features</Link>
                    <Link href="#" className="block text-white/60 hover:text-white font-medium uppercase tracking-wide text-sm">Contact</Link>
                    <Link href="/dashboard" className="block text-white/60 hover:text-white font-medium uppercase tracking-wide text-sm pt-4 border-t border-white/10 mb-4">Login</Link>
                    <Link href="/dashboard" className="block text-center bg-[#007BFF] hover:bg-[#0056b3] text-white px-6 py-3 rounded-full font-bold transition-all w-full">
                        Get Started
                    </Link>
                </div>
            )}
        </header>
    );
}
