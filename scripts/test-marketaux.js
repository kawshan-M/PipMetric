const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = require('dotenv').config({ path: envPath });

const API_TOKEN = process.env.NEXT_PUBLIC_MARKETAUX_API_TOKEN;

console.log("Token present:", !!API_TOKEN);
// console.log("Token:", API_TOKEN); // Uncomment to see token if needed

const symbols = ["EURUSD", "BTC", "NDX", "SPX"];
const searchTerms = ["S&P 500", "Nasdaq", "Bitcoin", "EURUSD"];

async function testFetch(query, type = 'symbols') {
    console.log(`\n--- Testing ${type}: ${query} ---`);
    const url = type === 'symbols'
        ? `https://api.marketaux.com/v1/news/all?symbols=${query}&filter_entities=true&limit=3&api_token=${API_TOKEN}`
        : `https://api.marketaux.com/v1/news/all?search=${encodeURIComponent(query)}&filter_entities=true&limit=3&api_token=${API_TOKEN}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`Error: ${res.status} ${res.statusText}`);
            const text = await res.text();
            console.error("Body:", text);
            return;
        }
        const data = await res.json();
        console.log(`Found ${data.meta.found} articles.`);
        if (data.data && data.data.length > 0) {
            console.log("Top headline:", data.data[0].title);
        } else {
            console.log("No articles found in 'data' array.");
        }
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

async function run() {
    console.log("Testing Symbols...");
    for (const sym of symbols) {
        await testFetch(sym, 'symbols');
    }

    console.log("\nTesting Search Terms...");
    for (const term of searchTerms) {
        await testFetch(term, 'search');
    }
}

run();
