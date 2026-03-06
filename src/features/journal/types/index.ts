export interface TradeEntry {
    id?: string;
    userId: string;
    date: string;
    pairs: string;
    session: string;
    entryWindow: string;
    direction: "LONG" | "SHORT" | "";
    pl: number | null;
    followedRules: boolean;
    be: boolean; // Break Even
    model: string;
    account: string;
    positiveTags: string[];
    negativeTags: string[];
    rating: number | null; // 1-5
    win: boolean;
    preTradeState: string;
    duringTradeState: string;
    postTradeState: string;
    tradeRules: { rule1: boolean; rule2: boolean };
    setupAnalysisText: string;
    setupOutcomeText: string;
    createdAt?: any; // Firestore Timestamp
}
