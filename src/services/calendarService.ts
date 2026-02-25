export interface EconomicEvent {
    id: string;
    time: string; // The original time string (usually UTC)
    currency: string;
    impact: 'High' | 'Medium' | 'Low';
    event: string;
    actual?: string;
    forecast?: string;
    previous?: string;
}

export const fetchEconomicCalendar = async (): Promise<EconomicEvent[]> => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_TWELVE_DATA_API_KEY;
        if (!apiKey) {
            console.warn("Twelve Data API key is missing. Using mock calendar data.");
            return getMockCalendarData();
        }

        // Fetch events for the current day / week
        const response = await fetch(`https://api.twelvedata.com/economic_calendar?apikey=${apiKey}`);

        if (!response.ok) {
            throw new Error(`Twelve Data API error: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.status === "error") {
            console.error("Twelve Data API returned an error:", data.message);
            return getMockCalendarData();
        }

        if (!data.economic_calendar || !Array.isArray(data.economic_calendar)) {
            console.warn("Invalid data structure from Twelve Data Calendar API.");
            return [];
        }

        return data.economic_calendar.map((item: any) => ({
            id: item.id || Math.random().toString(36).substring(7),
            time: item.time, // Example format: 2024-05-15 12:30:00
            currency: item.currency,
            impact: item.impact || "Low",
            event: item.event,
            actual: item.actual,
            forecast: item.forecast,
            previous: item.previous
        }));
    } catch (error) {
        console.error("Failed to fetch economic calendar:", error);
        return getMockCalendarData();
    }
};

const getMockCalendarData = (): EconomicEvent[] => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    return [
        { id: '1', time: `${dateStr} 12:30:00`, currency: 'USD', impact: 'High', event: 'Core CPI (MoM)' },
        { id: '2', time: `${dateStr} 12:30:00`, currency: 'USD', impact: 'High', event: 'CPI (YoY)' },
        { id: '3', time: `${dateStr} 14:00:00`, currency: 'EUR', impact: 'High', event: 'ECB Interest Rate Decision' },
        { id: '4', time: `${dateStr} 08:30:00`, currency: 'GBP', impact: 'Medium', event: 'Manufacturing Production (MoM)' },
        { id: '5', time: `${dateStr} 01:30:00`, currency: 'JPY', impact: 'High', event: 'BOJ Core CPI (YoY)' },
        { id: '6', time: `${dateStr} 18:00:00`, currency: 'USD', impact: 'Medium', event: 'FOMC Meeting Minutes' },
    ];
};
