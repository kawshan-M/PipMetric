import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex h-screen bg-[#0B0E11] text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <Topbar />
                <main className="flex-1 overflow-y-auto pt-16 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
