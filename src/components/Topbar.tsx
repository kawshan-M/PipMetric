"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Wallet,
    Menu,
    X,
    LayoutDashboard,
    Calculator,
    BrainCircuit,
    BookOpen,
    Calendar,
    Newspaper,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Topbar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Intelligence", href: "/intelligence", icon: BrainCircuit },
        { name: "News", href: "/news", icon: Newspaper },
        { name: "Calendar", href: "/calendar", icon: Calendar },
        { name: "Journal", href: "/journal", icon: BookOpen },
    ];

    const calculators = [
        { name: "Position Size", href: "/calculators/position-size" },
        { name: "Margin", href: "/calculators/margin" },
        { name: "Drawdown", href: "/calculators/drawdown" },
        { name: "Pip Value", href: "/calculators/pip" },
        { name: "Profit/Loss", href: "/calculators/profit" },
        { name: "Compounding", href: "/calculators/compounding" },
        { name: "Converter", href: "/calculators/converter" },
        { name: "Forex Heat Map", href: "/calculators/heatmap" },
        { name: "Market Screener", href: "/calculators/screener" },
    ];

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <header className="fixed top-0 right-0 left-0 h-16 bg-[#0B0E11]/90 backdrop-blur-md border-b border-gray-800 z-50 px-6 flex items-center justify-between">
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center gap-4">
                <button
                    className="p-2 text-gray-400 hover:text-white lg:hidden"
                    onClick={toggleMobileMenu}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent">
                    PipMetric
                </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
                <Link
                    href="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${pathname === "/dashboard" ? "bg-[#007BFF]/10 text-[#007BFF]" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                >
                    <LayoutDashboard size={16} /> Dashboard
                </Link>

                {/* Calculators Dropdown */}
                <div
                    className="relative group"
                    onMouseEnter={() => setCalcDropdownOpen(true)}
                    onMouseLeave={() => setCalcDropdownOpen(false)}
                >
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${pathname.includes("/calculators") ? "bg-[#007BFF]/10 text-[#007BFF]" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                    >
                        <Calculator size={16} /> Calculators <ChevronDown size={14} className={`transition-transform duration-200 ${calcDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                        {calcDropdownOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 mt-1 w-56 bg-[#11161B] border border-gray-800 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                            >
                                {calculators.map(calc => (
                                    <Link
                                        key={calc.href}
                                        href={calc.href}
                                        className={`block px-4 py-2 text-sm transition-colors ${pathname === calc.href ? "text-[#007BFF] bg-[#007BFF]/5 font-medium" : "text-gray-400 hover:text-white hover:bg-gray-800/50"}`}
                                        onClick={() => setCalcDropdownOpen(false)}
                                    >
                                        {calc.name}
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {navigation.slice(1).map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${pathname.includes(item.href) ? "bg-[#007BFF]/10 text-[#007BFF]" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                    >
                        <item.icon size={16} /> {item.name}
                    </Link>
                ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => alert("Login functionality is coming soon! We are working on it.")}
                    className="flex items-center gap-2 bg-[#007BFF] hover:bg-[#0056b3] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-[#007BFF]/20"
                >
                    <span className="hidden sm:inline">Login</span>
                </button>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-16 left-0 right-0 bg-[#0B0E11] border-b border-gray-800 lg:hidden overflow-hidden flex flex-col shadow-2xl"
                    >
                        <div className="p-4 space-y-1 overflow-y-auto max-h-[70vh]">
                            <Link
                                href="/dashboard"
                                onClick={toggleMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === "/dashboard" ? "bg-[#007BFF]/10 text-[#007BFF]" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                            >
                                <LayoutDashboard size={20} /> Dashboard
                            </Link>

                            {/* Mobile Calculators Dropdown (Inline) */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 font-medium">
                                    <Calculator size={20} /> Tools & Calculators
                                </div>
                                <div className="pl-12 space-y-1 border-l border-gray-800 ml-6 pb-2">
                                    {calculators.map(calc => (
                                        <Link
                                            key={calc.href}
                                            href={calc.href}
                                            onClick={toggleMobileMenu}
                                            className={`block px-4 py-2 text-sm rounded-lg transition-colors ${pathname === calc.href ? "text-[#007BFF] bg-[#007BFF]/5 font-medium" : "text-gray-500 hover:text-white hover:bg-gray-900/50"}`}
                                        >
                                            {calc.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {navigation.slice(1).map(item => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={toggleMobileMenu}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.includes(item.href) ? "bg-[#007BFF]/10 text-[#007BFF]" : "text-gray-400 hover:text-white hover:bg-gray-900"}`}
                                >
                                    <item.icon size={20} /> {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
