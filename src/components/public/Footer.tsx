import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-[#0B0E11] py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#00ff41] to-[#007BFF] bg-clip-text text-transparent mb-4 inline-block">
                        PipMetric
                    </Link>
                    <p className="text-gray-400 mt-2 max-w-sm">
                        Institutional-grade analytics, position calculators, and AI intelligence for the modern technical trader.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white">Product</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="/calculators" className="hover:text-white transition-colors">Calculators</Link></li>
                        <li><Link href="/intelligence" className="hover:text-white transition-colors">Intelligence</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4 text-white">Company</h4>
                    <ul className="space-y-2 text-gray-400">
                        <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                        <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} PipMetric. All rights reserved.
            </div>
        </footer>
    );
}
