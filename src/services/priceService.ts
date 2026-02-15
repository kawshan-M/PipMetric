
interface PriceData {
    price: number;
    change24h?: number;
}

const CACHE_DURATION = 30000; // 30 seconds
const priceCache: Record<string, { data: PriceData; timestamp: number }> = {};

export const fetchPrice = async (symbol: string, type: "Forex" | "Crypto" | "Stocks"): Promise<PriceData | null> => {
    const cacheKey = `${type}-${symbol}`;
    const now = Date.now();

    if (priceCache[cacheKey] && now - priceCache[cacheKey].timestamp < CACHE_DURATION) {
        return priceCache[cacheKey].data;
    }

    try {
        let price = 0;
        let change24h = 0;

        if (type === "Crypto") {
            // CoinGecko API
            const coinId = getCoinGeckoId(symbol);
            const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
            const data = await response.json();

            if (data[coinId]) {
                price = data[coinId].usd;
                change24h = data[coinId].usd_24h_change;
            }
        } else {
            // Twelve Data API (Demo key works for major pairs like EUR/USD, AAPL)
            // Note: Demo key has limits and only supports specific pairs.
            // specific pairs: EUR/USD, USD/JPY, AAPL, etc.
            // We will try to use it, but fallback to mock if rate limited or unsupported in demo.

            const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY || "demo";
            const response = await fetch(`https://api.twelvedata.com/price?symbol=${symbol}&apikey=${apiKey}`);
            const data = await response.json();

            if (data.price) {
                price = parseFloat(data.price);
                // Change not available in simple price endpoint of demo, simpler to just get price.
            } else {
                console.warn("TwelveData Error or Rate Limit:", data);
                return null;
            }
        }

        if (price > 0) {
            const result = { price, change24h };
            priceCache[cacheKey] = { data: result, timestamp: now };
            return result;
        }
    } catch (error) {
        console.error("Error fetching price:", error);
    }

    return null;
};

// Helper maps
const getCoinGeckoId = (symbol: string): string => {
    const map: Record<string, string> = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "SOL": "solana",
        "BNB": "binancecoin",
        "XRP": "ripple",
        "ADA": "cardano",
        "DOGE": "dogecoin",
        "AVAX": "avalanche-2",
        "DOT": "polkadot",
        "LINK": "chainlink",
        "MATIC": "matic-network",
        "LTC": "litecoin",
        "UNI": "uniswap"
    };
    return map[symbol] || symbol.toLowerCase();
};
