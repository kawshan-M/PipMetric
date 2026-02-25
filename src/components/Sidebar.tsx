
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calculator,
  BrainCircuit,
  BookOpen,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [calcOpen, setCalcOpen] = useState(false);

  // Auto-open calculators accordion if on a calculator route
  useEffect(() => {
    if (pathname.includes("/calculators")) {
      setCalcOpen(true);
    }
  }, [pathname]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      name: "Calculators",
      href: "/calculators",
      icon: Calculator,
      children: [
        { name: "Position Size", href: "/calculators/position-size" },
        { name: "Margin", href: "/calculators/margin" },
        { name: "Drawdown", href: "/calculators/drawdown" },
        { name: "Pip Value", href: "/calculators/pip" },
        { name: "Profit/Loss", href: "/calculators/profit" },
        { name: "Compounding", href: "/calculators/compounding" },
        { name: "Converter", href: "/calculators/converter" },
        { name: "Forex Heat Map", href: "/calculators/heatmap" },
        { name: "Market Screener", href: "/calculators/screener" },
      ]
    },
    { name: "Intelligence", href: "/intelligence", icon: BrainCircuit },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Journal", href: "/journal", icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0E11] border-r border-gray-800 flex flex-col z-40 hidden md:flex overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-gray-800 flex items-center justify-center shrink-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent">
          PipMetric
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = item.href === "/calculators" ? pathname === item.href : pathname.startsWith(item.href);
          const hasChildren = !!item.children;

          return (
            <div key={item.name}>
              {hasChildren ? (
                <button
                  onClick={() => setCalcOpen(!calcOpen)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 group ${pathname.includes(item.href) ? "bg-[#007BFF]/5 text-white" : "text-gray-400 hover:bg-gray-900 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={pathname.includes(item.href) ? "text-[#007BFF]" : "text-gray-400 group-hover:text-white"} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-gray-500 group-hover:text-white transition-colors">
                    {calcOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                    ? "bg-[#007BFF]/10 text-[#007BFF]"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white"
                    }`}
                >
                  <item.icon size={20} className={isActive ? "text-[#007BFF]" : "text-gray-400 group-hover:text-white"} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )}

              {/* Render Children if applicable and Open */}
              {hasChildren && calcOpen && (
                <div className="ml-11 mt-1 space-y-1">
                  {item.children?.map(child => {
                    const isChildActive = pathname === child.href;
                    return (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${isChildActive
                          ? "text-[#007BFF] bg-[#007BFF]/10 font-bold"
                          : "text-gray-500 hover:text-gray-200 hover:bg-gray-900/50"
                          }`}
                      >
                        {child.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl w-full transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}
