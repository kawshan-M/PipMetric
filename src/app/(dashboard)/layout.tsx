import Topbar from "@/components/Topbar";
import AdBanner from "@/components/AdBanner";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col min-h-screen bg-[#0B0E11] text-white overflow-hidden">
            {/* Horizontal Topbar */}
            <Topbar />

            {/* Main Content Area with Ad Rails */}
            <div className="flex flex-1 pt-16 h-screen w-full mx-auto justify-center">

                {/* Left Ad Skyscraper (Hidden on smaller screens) */}
                <aside className="hidden xl:flex flex-col items-center w-[200px] shrink-0 p-4 border-r border-gray-800/50 bg-[#0B0E11] overflow-y-auto">
                    <div className="sticky top-4">
                        <AdBanner size="skyscraper" />
                        <div className="mt-8">
                            <AdBanner size="skyscraper" />
                        </div>
                    </div>
                </aside>

                {/* Center Content Area */}
                <main className="flex-1 max-w-[1200px] w-full overflow-y-auto p-6 scroll-smooth">
                    {/* Optional leaderboard ad at the very top of content */}
                    <div className="mb-6 flex justify-center hidden md:flex">
                        <AdBanner size="leaderboard" />
                    </div>

                    {children}
                </main>

                {/* Right Ad Skyscraper (Hidden on smaller screens) */}
                <aside className="hidden xl:flex flex-col items-center w-[200px] shrink-0 p-4 border-l border-gray-800/50 bg-[#0B0E11] overflow-y-auto">
                    <div className="sticky top-4">
                        <AdBanner size="skyscraper" />
                        <div className="mt-8">
                            <AdBanner size="skyscraper" />
                        </div>
                    </div>
                </aside>

            </div>
        </div>
    );
}
