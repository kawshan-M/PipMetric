import { GoogleGenerativeAI } from "@google/generative-ai";

export interface SentimentData {
  score: number; // -1 (Bearish) to 1 (Bullish)
  summary: string;
  timestamp: string;
  isLive: boolean; // Indicator for UI
  configMissing?: boolean; // Specific flag for missing API key
}

export interface AssetSentiment {
  symbol: string;
  score: number;
}

export interface AIService {
  getMarketSentiment(): Promise<SentimentData>;
  getAssetSentiments(): Promise<AssetSentiment[]>;
  checkModelAccess(): Promise<void>;
  generateEventInsight(eventName: string, actual: string | null, forecast: string | null): Promise<string>;
}

// Safe environment variable accessor
const getEnvVar = (key: string): string => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || "";
  }
  return "";
};

// --- MOCK DATA FOR FALLBACK ---
const MOCK_MARKET_SENTIMENT: SentimentData = {
  score: 0.45,
  summary: "Global markets are showing cautious optimism. Tech sectors (NAS100) are leading the recovery, while forex markets remain volatile due to central bank policies. Crypto (BTC) is consolidating.",
  timestamp: new Date().toISOString(),
  isLive: false,
};

const MOCK_ASSET_DATA: AssetSentiment[] = [
  // Forex
  { symbol: "EURUSD", score: -0.2 },
  { symbol: "GBPUSD", score: 0.1 },
  { symbol: "USDJPY", score: 0.3 },
  { symbol: "AUDUSD", score: -0.1 },
  // Crypto
  { symbol: "BTC", score: 0.6 },
  { symbol: "ETH", score: 0.5 },
  { symbol: "SOL", score: 0.7 },
  // Indices
  { symbol: "NAS100", score: 0.8 },
  { symbol: "SPX500", score: 0.5 },
  { symbol: "DAX", score: 0.2 },
];

class RealAIService implements AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string;
  private marketauxToken: string;

  constructor() {
    // Trim to avoid whitespace issues
    this.apiKey = getEnvVar("NEXT_PUBLIC_GEMINI_API_KEY").trim();
    this.marketauxToken = getEnvVar("NEXT_PUBLIC_MARKETAUX_API_TOKEN").trim();

    // --- DEBUG LOGGING ---
    console.log("Environment Status:", !!this.apiKey); // Logic requested by user
    console.log("--- DEBUG: AI Service Init (Gemini 2.5 Flash) ---");
    console.log("API Key (first 5 chars):", this.apiKey ? this.apiKey.slice(0, 5) : "MISSING");
    console.log(`MarketAux Token set: ${!!this.marketauxToken}`);

    // Log visible keys to see if loaded at all (informational)
    if (typeof process !== 'undefined' && process.env) {
      console.log("Visible NEXT_PUBLIC Keys:", Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_")));
    }
    // ---------------------

    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    } else {
      console.warn("RealAIService: Missing NEXT_PUBLIC_GEMINI_API_KEY. Defaulting to mock data.");
    }
  }

  // Diagnostic
  async checkModelAccess(): Promise<void> {
    console.log("--- Diagnostic: RealAIService Check ---");
    if (this.genAI) {
      try {
        // Use the verified available model: gemini-2.5-flash
        const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        // Lightweight test
        await model.generateContent("Ping");
        console.log("Diagnostic: Gemini API connection successful (gemini-2.5-flash).");
      } catch (e) {
        console.error("Diagnostic: Gemini API connection failed.", e);
      }
    } else {
      console.warn("Diagnostic: Skipped API check (No Key).");
    }
  }

  // --- Helper: Fetch News ---
  private async fetchNews(query: string): Promise<string[]> {
    if (!this.marketauxToken) return [];

    try {
      // Use 'search' for broader match, limiting to 3 items for speed/token usage
      const url = `https://api.marketaux.com/v1/news/all?search=${encodeURIComponent(query)}&language=en&limit=3&api_token=${this.marketauxToken}`;
      const res = await fetch(url);

      if (!res.ok) {
        console.error(`MarketAux API Error: ${res.status} ${res.statusText}`);
        throw new Error(`MarketAux status ${res.status}`);
      }

      const data = await res.json();
      console.log(`Raw Marketaux Data for '${query}':`, data); // Log raw data as requested

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.data?.map((age: any) => age.title) || [];
    } catch (error) {
      console.warn(`Failed to fetch news for ${query}:`, error);
      return [];
    }
  }

  // --- Helper: Parse JSON from Gemini ---
  private cleanAndParseJSON(text: string): any {
    try {
      // Remove markdown code blocks if present
      const clean = text.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch (e) {
      console.error("JSON Parse Error:", e);
      return null;
    }
  }

  async getMarketSentiment(): Promise<SentimentData> {
    if (!this.genAI) {
      return {
        ...MOCK_MARKET_SENTIMENT,
        timestamp: new Date().toISOString(),
        configMissing: true
      };
    }

    try {
      // 1. Fetch live context (Broad Market)
      const headlines = await this.fetchNews("Global Economy Finance Market");

      if (headlines.length === 0) {
        console.warn("No headlines found, falling back to mock to avoid hallucination.");
        return { ...MOCK_MARKET_SENTIMENT, timestamp: new Date().toISOString() };
      }

      // 2. Ask Gemini
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        Analyze these market headlines for general global sentiment:
        ${headlines.join("\n")}

        Provide a JSON response with:
        - "score": number between -1.0 (Bearish) and 1.0 (Bullish)
        - "summary": A concise 2-sentence market summary based on these headlines.
        
        Output JSON only.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const data = this.cleanAndParseJSON(text);

      if (data && typeof data.score === 'number' && data.summary) {
        return {
          score: data.score,
          summary: data.summary,
          timestamp: new Date().toISOString(),
          isLive: true,
        };
      }

      throw new Error("Invalid format from Gemini");

    } catch (error) {
      console.error("Standard AI Error (Market):", error);
      return { ...MOCK_MARKET_SENTIMENT, timestamp: new Date().toISOString() };
    }
  }

  async getAssetSentiments(): Promise<AssetSentiment[]> {
    if (!this.genAI) return MOCK_ASSET_DATA;

    // Strategy: We will Mock the LIST for now if we can't get bulk analysis, 
    // OR we just return the Mock list but with updated timestamps. 

    const assetsOfInterest = [
      "EURUSD", "GBPUSD", "USDJPY", "AUDUSD",
      "BTC", "ETH", "SOL",
      "NAS100", "SPX500", "DAX"
    ];

    try {
      // Fetch news for TOP 3 categories (Forex, Crypto, Indices)
      const [newsForex, newsCrypto, newsIndices] = await Promise.all([
        this.fetchNews("Forex Market Major Pairs"),
        this.fetchNews("Crypto Market Bitcoin Ethereum"),
        this.fetchNews("Stock Market Indices US Europe")
      ]);

      const allHeadlines = [...newsForex, ...newsCrypto, ...newsIndices].join("\n");
      if (!allHeadlines) return MOCK_ASSET_DATA;

      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
            Based on these headlines:
            ${allHeadlines}
            
            Estimate sentiment scores (-1.0 to 1.0) for these assets:
            ${assetsOfInterest.join(", ")}
            
            Return JSON object: { "assets": [ { "symbol": "...", "score": 0.0 }, ... ] }
            JSON ONLY.
        `;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text();
      const json = this.cleanAndParseJSON(text);

      if (json && Array.isArray(json.assets)) {
        // Merge with our required list to ensure we have all of them
        return assetsOfInterest.map(sym => {
          const found = json.assets.find((a: any) => a.symbol === sym);
          return { symbol: sym, score: found ? found.score : 0 };
        });
      }

    } catch (error) {
      console.error("Standard AI Error (Assets):", error);
    }

    return MOCK_ASSET_DATA;
  }

  async generateEventInsight(eventName: string, actual: string | null, forecast: string | null): Promise<string> {
    if (!this.genAI) {
      return "AI insight unavailable. Please add Gemini API key.";
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `
        You are an expert forex and index trader. 
        An economic event just occurred or is coming up: "${eventName}".
        Actual value: ${actual || "N/A"}. Forecast value: ${forecast || "N/A"}.
        
        Question: How will this event impact NAS100 volatility today?
        Rules: Write exactly ONE short, punchy sentence. No disclaimers. Get straight to the point.
      `;

      const result = await model.generateContent(prompt);
      const text = (await result.response).text().trim();
      return text;
    } catch (error) {
      console.error("Failed to generate event insight:", error);
      return "Analysis failed due to a system error.";
    }
  }
}

export const aiService = new RealAIService();
