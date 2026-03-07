export interface EditorBlock {
    id: string;
    type: "heading" | "bullet" | "checkbox" | "image";
    content: string;
    checked?: boolean;
    color?: string; // e.g. "green", "yellow", "blue", "purple"
}

export interface TradeEntry {
    id?: string;
    userId: string;
    date: string;
    pairs: string;
    session: string;
    entryWindow: string;
    direction: "LONG" | "SHORT" | "";
    pl: number | string;
    followedRules: "Yes" | "No" | "" | boolean;
    be: "Yes" | "No" | "" | boolean; // Break Even
    model: string;
    account: string;
    positiveTags: string[];
    negativeTags: string[];
    rating: number | string; // 1-5
    win: "Yes" | "No" | "" | boolean;
    preTradeState: string;
    duringTradeState: string;
    postTradeState: string;
    tradeRules: { rule1: boolean; rule2: boolean };
    setupAnalysisText: string;
    setupOutcomeText: string;
    contentBlocks?: EditorBlock[]; // Made optional for backward compatibility
    createdAt?: any; // Firestore Timestamp
}
