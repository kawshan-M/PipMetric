import Topbar from "@/components/Topbar";
import Footer from "@/components/public/Footer";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen bg-[#0B0E11] text-white overflow-hidden">
            {/* Horizontal Topbar */}
            <Topbar />

            {/* Main Content Area */}
            <div className="flex flex-1 pt-16 h-screen w-full mx-auto justify-center">

                {/* Center Content Area */}
                <main className="flex-1 max-w-[1400px] w-full overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>

            </div>

            {/* Global Footer */}
            <Footer />
        </div>
    );
}
