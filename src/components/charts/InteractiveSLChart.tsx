"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, CrosshairMode, IChartApi, ISeriesApi, LineStyle, AreaSeries, LineSeries } from "lightweight-charts";

interface InteractiveSLChartProps {
    symbol: string;
    currentPrice: number;
    stopLossPrice: number | null;
    onStopLossChange: (price: number) => void;
    isLive: boolean;
}

export default function InteractiveSLChart({
    symbol,
    currentPrice,
    stopLossPrice,
    onStopLossChange,
    isLive
}: InteractiveSLChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const priceSeriesRef = useRef<ISeriesApi<"Area"> | null>(null);
    const slLineRef = useRef<any>(null); // Custom primitive or just strict line management

    // For dragging
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize Chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0B0E11' },
                textColor: '#9CA3AF',
            },
            grid: {
                vertLines: { color: '#1F2937' },
                horzLines: { color: '#1F2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                visible: true,
                timeVisible: true,
            },
        });

        // Current Price Series (Area)
        const areaSeries = chart.addSeries(AreaSeries, {
            topColor: 'rgba(0, 123, 255, 0.4)',
            bottomColor: 'rgba(0, 123, 255, 0.05)',
            lineColor: '#007BFF',
            lineWidth: 2,
        });
        priceSeriesRef.current = areaSeries;

        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    // Update Chart Data (Mocking history based on current price if no history API yet)
    useEffect(() => {
        if (!priceSeriesRef.current || !currentPrice) return;

        // Generate mock historical data ending at currentPrice for visualization context
        // In a real scenario, we'd fetch history. Here we just show a line context.
        const data = [];
        const now = Math.floor(Date.now() / 1000);
        let price = currentPrice * 0.95; // Start 5% lower

        for (let i = 100; i >= 0; i--) {
            // Random walk
            price = price + (Math.random() - 0.5) * (currentPrice * 0.01);
            // Force last point to be currentPrice
            if (i === 0) price = currentPrice;

            data.push({ time: (now - i * 60) as any, value: price });
        }

        priceSeriesRef.current.setData(data);
        chartRef.current?.timeScale().fitContent();

    }, [symbol, currentPrice]); // Re-generate on symbol/price change

    // Manage Stop Loss Line
    useEffect(() => {
        if (!chartRef.current || !priceSeriesRef.current) return;

        // Remove previous SL line if any (using creating overlay logic or primitives is complex in lightweight-charts for dragging)
        // Simplification: We will use a separate LineSeries for the SL line.
        // BUT lightweight-charts doesn't support easy dragging of series.
        // To implement dragging, we need to handle mouse events on the chart container and map coordinates to price.

        // Let's create a LineSeries for SL
        if (!slLineRef.current) {
            slLineRef.current = chartRef.current.addSeries(LineSeries, {
                color: '#ff3131',
                lineWidth: 2,
                lineStyle: LineStyle.Dashed,
                crosshairMarkerVisible: false,
                lastValueVisible: true,
                priceLineVisible: true,
            });
        }

        if (stopLossPrice) {
            // To make a horizontal line, we need data points across the visible range?
            // Or just use `createPriceLine` on the main series?
            // `createPriceLine` is easier visually but NOT interactable/draggable easily via API events directly.

            // BETTER APPROACH for "Draggable":
            // 1. Use a standard PriceLine on the main series (visual only).
            // 2. Listen to mouseDown/Move/Up on container.
            // 3. Convert Y-coordinate to Price.
            // 4. Update parent state.

            // Let's remove the extra series and use PriceLine on the main areaSeries
            // Actually, we'll keep the logic simple: mouse click sets SL.

        }

    }, [stopLossPrice]);

    // Dragging Logic
    useEffect(() => {
        const container = chartContainerRef.current;
        if (!container || !chartRef.current || !priceSeriesRef.current) return;

        const handleMouseDown = (e: MouseEvent) => {
            // Logic: Check if near SL line? 
            // Simplier for V1: Clicking anywhere sets the SL to that price level.
            setIsDragging(true);
            updateSLFromEvent(e);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                updateSLFromEvent(e);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        const updateSLFromEvent = (e: MouseEvent) => {
            if (!chartRef.current || !priceSeriesRef.current) return;
            const rect = container.getBoundingClientRect();
            const y = e.clientY - rect.top;

            // Coordinate to Price
            const price = priceSeriesRef.current.coordinateToPrice(y);
            if (price) {
                onStopLossChange(price);
            }
        };

        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onStopLossChange]);

    // Render SL Line visually using createPriceLine
    useEffect(() => {
        if (!priceSeriesRef.current || !stopLossPrice) return;

        // Clear existing lines? Limit 1.
        // lightweight-charts doesn't have "clearPriceLines". We'd need to store the reference object to remove it.
        // Hack: We can't easily clear without ref.

        // Let's store the priceLine object in a ref.
        /* 
           This is tricky in React useEffect lifecycle.
           We'll use a specific ref for the price line object.
        */

    }, [stopLossPrice]);

    // Better implementation for the Price Line rendering
    const priceLineRef = useRef<any>(null);
    useEffect(() => {
        if (!priceSeriesRef.current) return;

        if (priceLineRef.current) {
            priceSeriesRef.current.removePriceLine(priceLineRef.current);
            priceLineRef.current = null;
        }

        if (stopLossPrice) {
            priceLineRef.current = priceSeriesRef.current.createPriceLine({
                price: stopLossPrice,
                color: '#ff3131',
                lineWidth: 2,
                lineStyle: LineStyle.Solid,
                axisLabelVisible: true,
                title: 'SL',
            });
        }
    }, [stopLossPrice]);


    return (
        <div className="relative border border-gray-800 rounded-2xl overflow-hidden">
            <div className="absolute top-4 left-4 z-10 flex flex-col pointer-events-none">
                <span className="text-xl font-bold text-white">{symbol}</span>
                <span className="text-sm text-[#007BFF]">
                    ${currentPrice?.toLocaleString()}
                    {isLive && <span className="ml-2 text-[10px] text-[#00ff41] bg-[#00ff41]/10 px-1 rounded animate-pulse">LIVE</span>}
                </span>
            </div>

            <div
                ref={chartContainerRef}
                className={`w-full h-[300px] cursor-crosshair ${isDragging ? 'cursor-grabbing' : ''}`}
            />

            <div className="absolute bottom-4 left-4 z-10 pointer-events-none bg-black/50 p-2 rounded text-xs text-gray-400">
                Drag to adjust Stop Loss
            </div>
        </div>
    );
}
