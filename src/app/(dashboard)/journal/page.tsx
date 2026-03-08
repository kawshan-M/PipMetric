"use client";

import React, { useEffect } from "react";
import QuickActions from "@/features/journal/components/QuickActions";
import JournalTable from "@/features/journal/components/JournalTable";
import TradeEntryModal from "@/features/journal/components/TradeEntryModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function JournalPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [isTradeModalOpen, setIsTradeModalOpen] = React.useState(false);
    const [entryToEdit, setEntryToEdit] = React.useState<any>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/"); // Redirect to home if not logged in
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex items-center justify-center w-full h-full text-white">Loading...</div>;
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 w-full h-full pb-10">
            <QuickActions onOpenTradeModal={() => {
                setEntryToEdit(null);
                setIsTradeModalOpen(true);
            }} />
            <JournalTable
                onEditEntry={(entry) => {
                    setEntryToEdit(entry);
                    setIsTradeModalOpen(true);
                }}
            />
            <TradeEntryModal
                isOpen={isTradeModalOpen}
                onClose={() => {
                    setIsTradeModalOpen(false);
                    setEntryToEdit(null);
                }}
                entryToEdit={entryToEdit}
            />
        </div>
    );
}
