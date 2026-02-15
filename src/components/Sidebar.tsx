
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calculator, 
  BrainCircuit, 
  BookOpen, 
  Settings,
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Calculators", href: "/calculators", icon: Calculator },
    { name: "Intelligence", href: "/intelligence", icon: BrainCircuit },
    { name: "Journal", href: "/journal", icon: BookOpen },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0E11] border-r border-gray-800 flex flex-col z-40 hidden md:flex">
      <div className="p-6 border-b border-gray-800 flex items-center justify-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent">
          PipMetric
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-[#007BFF]/10 text-[#007BFF]" 
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              <item.icon size={20} className={isActive ? "text-[#007BFF]" : "text-gray-400 group-hover:text-white"} />
              <span className="font-medium">{item.name}</span>
            </Link>
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
