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
    date?: string;
    pairs?: string;
    session?: string;
    entryWindow?: string;
    direction?: string;
    pl?: number | string;
    followedRules?: string | boolean;
    be?: string | boolean;
    model?: string;
    account?: string;
    positiveTags?: string[];
    negativeTags?: string[];
    rating?: number | string;
    win?: string | boolean;
    preTradeState?: string;
    duringTradeState?: string;
    postTradeState?: string;
    tradeRules?: any;
    setupAnalysisText?: string;
    setupOutcomeText?: string;
    contentBlocks?: EditorBlock[];
    createdAt?: any;
    formFields?: any[]; // Saves the dynamic schema for this entry
    [key: string]: any; // Allow any dynamically added fields
}
