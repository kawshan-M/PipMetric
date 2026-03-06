"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, HelpCircle, Check, ChevronRight as ChevronRightIcon } from "lucide-react";

interface DatePickerPopoverProps {
    value?: string;
    onChange: (data: { startDate: string, endDate?: string, includeTime: boolean, startTime?: string, endTime?: string, timeFormat?: string, timezone?: string }) => void;
    onClose: () => void;
}

const TimeInputField = ({ value, onChange, timeFormat }: { value: string, onChange: (v: string) => void, timeFormat: string }) => {
    const formatTimeForDisplay = (time24: string, format: string) => {
        if (!time24) return "";
        const [h, m] = time24.split(":");
        let hours = parseInt(h, 10);
        if (format === "12 hour") {
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours ? hours : 12;
            return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
        }
        return time24;
    };

    const [localText, setLocalText] = useState(formatTimeForDisplay(value, timeFormat));

    useEffect(() => {
        setLocalText(formatTimeForDisplay(value, timeFormat));
    }, [value, timeFormat]);

    const handleBlur = () => {
        const text = localText.trim();
        const match = text.match(/^(\d{1,2}):?(\d{2})?\s*(AM|PM|am|pm)?$/);
        if (match) {
            let h = parseInt(match[1], 10);
            let m = match[2] ? parseInt(match[2], 10) : 0;
            const ampm = match[3] ? match[3].toUpperCase() : null;

            if (ampm) {
                if (h === 12 && ampm === "AM") h = 0;
                else if (h < 12 && ampm === "PM") h += 12;
            } else if (timeFormat === "12 hour") {
                const oldIsPM = value && parseInt(value.split(":")[0], 10) >= 12;
                if (h >= 1 && h <= 11 && oldIsPM) h += 12;
                else if (h === 12 && !oldIsPM) h = 0;
            }

            if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
                const new24 = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                onChange(new24);
                setLocalText(formatTimeForDisplay(new24, timeFormat));
                return;
            }
        }
        setLocalText(formatTimeForDisplay(value, timeFormat));
    };

    return (
        <input
            type="text"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
            className="bg-transparent text-sm outline-none w-full text-center placeholder-gray-600"
            placeholder={timeFormat === "12 hour" ? "12:00 PM" : "00:00"}
        />
    );
};

export default function DatePickerPopover({ value, onChange, onClose }: DatePickerPopoverProps) {
    // Current date parsing - support custom range format "Start → End"
    const initialStartStr = value?.split(" → ")[0] || "";
    const initialEndStr = value?.split(" → ")[1] || "";

    const parseDatePart = (str: string) => str ? new Date(str.split(" ")[0]) : new Date();
    const parseTimePart = (str: string) => str.includes(" ") ? str.split(" ")[1] : "12:00";

    const initialStartDate = parseDatePart(initialStartStr);
    const initialEndDate = initialEndStr ? parseDatePart(initialEndStr) : null;

    // UI State
    const [viewDate, setViewDate] = useState(initialStartDate);
    const [selectedDate, setSelectedDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

    const [hasEndDate, setHasEndDate] = useState(!!initialEndDate);
    const [focusedInput, setFocusedInput] = useState<"start" | "end">("start");

    const [includeTime, setIncludeTime] = useState(initialStartStr.includes(" "));
    const [startTime, setStartTime] = useState(parseTimePart(initialStartStr));
    const [endTime, setEndTime] = useState(initialEndStr ? parseTimePart(initialEndStr) : "12:00");
    const [dateFormat, setDateFormat] = useState("Full date");
    const [timeFormat, setTimeFormat] = useState("12 hour");
    const [timezone, setTimezone] = useState("GMT+5:30");
    const [tzSearch, setTzSearch] = useState("");

    // Dropdown states
    const [activeMenu, setActiveMenu] = useState<"main" | "timezone" | "dateFormat" | "timeFormat">("main");

    const popoverRef = useRef<HTMLDivElement>(null);

    // Month rendering logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const generateCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        // Fill empty days
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Fill month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }
        return days;
    };

    const days = generateCalendar();

    const handlePrevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    const handleSetNow = () => {
        const now = new Date();
        const nowTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        setViewDate(now);

        if (focusedInput === "start") {
            setSelectedDate(now);
            setStartTime(nowTime);
            triggerChange(now, endDate, hasEndDate, includeTime, nowTime, endTime);
        } else {
            setEndDate(now);
            setEndTime(nowTime);
            triggerChange(selectedDate, now, hasEndDate, includeTime, startTime, nowTime);
        }
    };

    const triggerChange = (
        start: Date | null,
        end: Date | null,
        showEnd: boolean,
        showTime: boolean,
        sTime: string,
        eTime: string,
        tFormat: string = timeFormat,
        tz: string = timezone
    ) => {
        const formatLocal = (d: Date | null) => {
            if (!d) return undefined;
            const offset = d.getTimezoneOffset();
            const localDate = new Date(d.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        onChange({
            startDate: formatLocal(start) || "",
            endDate: showEnd ? formatLocal(end) : undefined,
            includeTime: showTime,
            startTime: showTime ? sTime : undefined,
            endTime: showTime && showEnd ? eTime : undefined,
            timeFormat: tFormat,
            timezone: tz
        });
    };

    const handleDateSelect = (date: Date) => {
        if (focusedInput === "start") {
            const newStart = date;
            let newEnd = endDate;

            // Auto-adjust end date if necessary
            if (hasEndDate && date > (endDate || date)) {
                newEnd = date;
            }

            setSelectedDate(newStart);
            setEndDate(newEnd);
            triggerChange(newStart, newEnd, hasEndDate, includeTime, startTime, endTime);

            if (hasEndDate) {
                setFocusedInput("end");
            }
        } else {
            setEndDate(date);
            triggerChange(selectedDate, date, hasEndDate, includeTime, startTime, endTime);
        }
    };

    const toggleEndDate = () => {
        const newHasEnd = !hasEndDate;
        setHasEndDate(newHasEnd);
        if (newHasEnd && !endDate) {
            setEndDate(selectedDate);
            setFocusedInput("end");
            triggerChange(selectedDate, selectedDate, true, includeTime, startTime, endTime);
        } else if (!newHasEnd) {
            setFocusedInput("start");
            triggerChange(selectedDate, null, false, includeTime, startTime, endTime);
        }
    };

    const toggleIncludeTime = () => {
        const newIncludeTime = !includeTime;
        setIncludeTime(newIncludeTime);
        if (!newIncludeTime && (activeMenu === "timeFormat" || activeMenu === "timezone")) {
            setActiveMenu("main");
        }
        triggerChange(selectedDate, endDate, hasEndDate, newIncludeTime, startTime, endTime);
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Format header date
    const formatDateObj = (d: Date | null) => {
        if (!d) return "";
        const y = d.getFullYear();
        const m = d.getMonth();
        const day = d.getDate();
        const monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        switch (dateFormat) {
            case "Short date":
                return `${m + 1}/${day}/${y}`;
            case "Month/Day/Year":
                return `${monthsLong[m]} ${day}, ${y}`;
            case "Day/Month/Year":
                return `${day} ${monthsLong[m]} ${y}`;
            case "Year/Month/Day":
                return `${y}/${m + 1}/${day}`;
            case "Relative":
                const now = new Date();
                const diffTime = Math.abs(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() - new Date(y, m, day).getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 0) return "Today";
                if (diffDays === 1 && d < now) return "Yesterday";
                if (diffDays === 1 && d > now) return "Tomorrow";
                return `${monthsShort[m]} ${day}, ${y}`;
            case "Full date":
            default:
                return `${monthsShort[m]} ${day}, ${y}`;
        }
    };

    const timezones = [
        "(GMT-12:00) International Date Line West", "(GMT-11:00) Midway Island, Samoa", "(GMT-10:00) Hawaii",
        "(GMT-09:00) Alaska", "(GMT-08:00) Pacific Time (US & Canada)", "(GMT-08:00) Tijuana, Baja California",
        "(GMT-07:00) Arizona", "(GMT-07:00) Chihuahua, La Paz, Mazatlan", "(GMT-07:00) Mountain Time (US & Canada)",
        "(GMT-06:00) Central America", "(GMT-06:00) Central Time (US & Canada)", "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
        "(GMT-06:00) Saskatchewan", "(GMT-05:00) Bogota, Lima, Quito, Rio Branco", "(GMT-05:00) Eastern Time (US & Canada)",
        "(GMT-05:00) Indiana (East)", "(GMT-04:00) Atlantic Time (Canada)", "(GMT-04:00) Caracas, La Paz",
        "(GMT-04:00) Manaus", "(GMT-04:00) Santiago", "(GMT-03:30) Newfoundland", "(GMT-03:00) Brasilia",
        "(GMT-03:00) Buenos Aires, Georgetown", "(GMT-03:00) Greenland", "(GMT-03:00) Montevideo",
        "(GMT-02:00) Mid-Atlantic", "(GMT-01:00) Cape Verde Is.", "(GMT-01:00) Azores",
        "(GMT+00:00) Casablanca, Monrovia, Reykjavik", "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
        "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
        "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
        "(GMT+01:00) West Central Africa", "(GMT+02:00) Amman", "(GMT+02:00) Athens, Bucharest, Istanbul",
        "(GMT+02:00) Beirut", "(GMT+02:00) Cairo", "(GMT+02:00) Harare, Pretoria",
        "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "(GMT+02:00) Jerusalem", "(GMT+02:00) Minsk",
        "(GMT+02:00) Windhoek", "(GMT+03:00) Kuwait, Riyadh, Baghdad", "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
        "(GMT+03:00) Nairobi", "(GMT+03:00) Tbilisi", "(GMT+03:30) Tehran", "(GMT+04:00) Abu Dhabi, Muscat",
        "(GMT+04:00) Baku", "(GMT+04:00) Yerevan", "(GMT+04:30) Kabul", "(GMT+05:00) Yekaterinburg",
        "(GMT+05:00) Islamabad, Karachi, Tashkent", "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
        "(GMT+05:30) Sri Jayawardenepura", "(GMT+05:45) Kathmandu", "(GMT+06:00) Almaty, Novosibirsk",
        "(GMT+06:00) Astana, Dhaka", "(GMT+06:30) Yangon (Rangoon)", "(GMT+07:00) Bangkok, Hanoi, Jakarta",
        "(GMT+07:00) Krasnoyarsk", "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "(GMT+08:00) Irkutsk, Ulaan Bataar",
        "(GMT+08:00) Kuala Lumpur, Singapore", "(GMT+08:00) Perth", "(GMT+08:00) Taipei",
        "(GMT+09:00) Osaka, Sapporo, Tokyo", "(GMT+09:00) Seoul", "(GMT+09:00) Yakutsk",
        "(GMT+09:30) Adelaide", "(GMT+09:30) Darwin", "(GMT+10:00) Brisbane",
        "(GMT+10:00) Canberra, Melbourne, Sydney", "(GMT+10:00) Guam, Port Moresby", "(GMT+10:00) Hobart",
        "(GMT+10:00) Vladivostok", "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "(GMT+12:00) Auckland, Wellington",
        "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", "(GMT+13:00) Nuku'alofa"
    ];

    const filteredTimezones = timezones.filter(tz =>
        tz.toLowerCase().includes(tzSearch.toLowerCase())
    );

    return (
        <div
            ref={popoverRef}
            className="absolute top-full left-0 mt-2 flex z-50 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Main Popover Body */}
            <div className="bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-2xl w-[260px] flex flex-col text-sm text-gray-200 overflow-hidden">

                {/* Header Inputs */}
                <div className="p-3 border-b border-gray-800 space-y-2">
                    <div className="flex items-center gap-2">
                        <div
                            onClick={() => setFocusedInput("start")}
                            className={`flex-1 px-3 py-1.5 bg-transparent border rounded text-blue-400 flex justify-between items-center cursor-pointer transition-colors ${focusedInput === "start" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-700 hover:border-gray-600"}`}
                        >
                            <span>{formatDateObj(selectedDate) || "Empty"}</span>
                        </div>
                        {includeTime && (
                            <div className="w-[110px] px-2 py-1.5 bg-transparent border border-gray-700 rounded text-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 flex justify-center items-center">
                                <TimeInputField
                                    value={startTime}
                                    timeFormat={timeFormat}
                                    onChange={(newVal) => {
                                        setStartTime(newVal);
                                        triggerChange(selectedDate, endDate, hasEndDate, includeTime, newVal, endTime);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {hasEndDate && (
                        <div className="flex items-center gap-2">
                            <div
                                onClick={() => setFocusedInput("end")}
                                className={`flex-1 px-3 py-1.5 bg-transparent border rounded text-blue-400 flex justify-between items-center cursor-pointer transition-colors ${focusedInput === "end" ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-700 hover:border-gray-600"}`}
                            >
                                <span>{formatDateObj(endDate) || "Empty"}</span>
                            </div>
                            {includeTime && (
                                <div className="w-[110px] px-2 py-1.5 bg-transparent border border-gray-700 rounded text-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 flex justify-center items-center">
                                    <TimeInputField
                                        value={endTime}
                                        timeFormat={timeFormat}
                                        onChange={(newVal) => {
                                            setEndTime(newVal);
                                            triggerChange(selectedDate, endDate, hasEndDate, includeTime, startTime, newVal);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Calendar View */}
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex font-semibold text-gray-100 items-center gap-1">
                            <select
                                value={viewDate.getMonth()}
                                onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), Number(e.target.value), 1))}
                                className="bg-transparent appearance-none cursor-pointer outline-none hover:text-white transition-colors"
                            >
                                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                                    <option key={m} value={i} className="bg-[#1E1E1E]">{m}</option>
                                ))}
                            </select>
                            <select
                                value={viewDate.getFullYear()}
                                onChange={(e) => setViewDate(new Date(Number(e.target.value), viewDate.getMonth(), 1))}
                                className="bg-transparent appearance-none cursor-pointer outline-none hover:text-white transition-colors"
                            >
                                {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i).map(year => (
                                    <option key={year} value={year} className="bg-[#1E1E1E]">{year}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <button onClick={handleSetNow} className="px-2 hover:text-white transition-colors text-xs font-medium mr-1">
                                Now
                            </button>
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded transition-colors">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded transition-colors">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400/80">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                        {days.map((date, i) => {
                            if (!date) return <div key={`empty-${i}`} className="w-8 h-8"></div>;

                            // Determine styles based on selection and range
                            let isSelected = false;
                            let inRange = false;

                            const dTime = date.getTime();
                            const sTime = selectedDate?.getTime();
                            const eTime = endDate?.getTime();

                            if (sTime === dTime || (hasEndDate && eTime === dTime)) {
                                isSelected = true;
                            }

                            if (hasEndDate && sTime && eTime && dTime > sTime && dTime < eTime) {
                                inRange = true;
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleDateSelect(date)}
                                    className={`w-8 h-8 flex items-center justify-center transition-colors 
                                        ${isSelected ? 'bg-blue-600 text-white font-medium shadow-sm rounded-md' :
                                            inRange ? 'bg-blue-900/40 text-blue-200 rounded-sm' :
                                                'hover:bg-white/10 text-gray-300 rounded-md'}`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Options List */}
                <div className="flex flex-col py-2">

                    {/* Switch Toggle: End Date */}
                    <label className="flex items-center justify-between px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors group">
                        <span className="text-gray-300">End date</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${hasEndDate ? 'bg-blue-500' : 'bg-gray-700'}`}>
                            <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform ${hasEndDate ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                        </div>
                        <input type="checkbox" className="hidden" checked={hasEndDate} onChange={toggleEndDate} />
                    </label>

                    {/* Switch Toggle: Include time */}
                    <label className="flex items-center justify-between px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors group">
                        <span className="text-gray-300">Include time</span>
                        <div className={`w-8 h-4 rounded-full relative transition-colors ${includeTime ? 'bg-blue-500' : 'bg-gray-700'}`}>
                            <div className={`absolute top-0.5 bottom-0.5 w-3 bg-white rounded-full transition-transform ${includeTime ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                        </div>
                        <input type="checkbox" className="hidden" checked={includeTime} onChange={toggleIncludeTime} />
                    </label>

                    <button className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-left transition-colors" onClick={() => setActiveMenu(activeMenu === "dateFormat" ? "main" : "dateFormat")}>
                        <span className="text-gray-300">Date format</span>
                        <div className="flex items-center text-gray-500">
                            <span>{dateFormat}</span>
                            <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                        </div>
                    </button>

                    {includeTime && (
                        <>
                            <button className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-left transition-colors" onClick={() => setActiveMenu(activeMenu === "timeFormat" ? "main" : "timeFormat")}>
                                <span className="text-gray-300">Time format</span>
                                <div className="flex items-center text-gray-500">
                                    <span>{timeFormat}</span>
                                    <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                                </div>
                            </button>

                            <button className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-left transition-colors" onClick={() => setActiveMenu(activeMenu === "timezone" ? "main" : "timezone")}>
                                <span className="text-gray-300">Timezone</span>
                                <div className="flex items-center text-gray-500">
                                    <span className="truncate max-w-[80px]">GMT+5:30</span>
                                    <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
                                </div>
                            </button>
                        </>
                    )}


                    <div className="h-[1px] w-full bg-gray-800/80 my-1"></div>

                    <button
                        onClick={() => {
                            setSelectedDate(null);
                            onChange({ startDate: "", includeTime: false });
                            onClose();
                        }}
                        className="flex items-center justify-between px-4 py-2 hover:bg-white/5 text-left transition-colors"
                    >
                        <span className="text-red-400">Clear</span>
                    </button>
                </div>

            </div>

            {/* Sub-menus floating next to the main menu */}



            {activeMenu === "dateFormat" && (
                <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-2xl w-[220px] shadow-[0_0_40px_rgba(0,0,0,0.5)] absolute left-[265px] top-[140px] flex flex-col text-sm text-gray-300 animate-in fade-in slide-in-from-left-2 duration-200 h-max py-2">
                    {[
                        "Full date",
                        "Short date",
                        "Month/Day/Year",
                        "Day/Month/Year",
                        "Year/Month/Day",
                        "Relative"
                    ].map(opt => (
                        <button
                            key={opt}
                            onClick={() => setDateFormat(opt)}
                            className="w-full text-left px-4 py-1.5 hover:bg-white/5 flex justify-between items-center transition-colors"
                        >
                            <span>{opt}</span>
                            {opt === dateFormat && <Check className="w-4 h-4 text-white" />}
                        </button>
                    ))}
                </div>
            )}

            {activeMenu === "timeFormat" && (
                <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-2xl w-[220px] shadow-[0_0_40px_rgba(0,0,0,0.5)] absolute left-[265px] top-[175px] flex flex-col text-sm text-gray-300 animate-in fade-in slide-in-from-left-2 duration-200 h-max py-2">
                    {[
                        "Hidden",
                        "12 hour",
                        "24 hour"
                    ].map(opt => (
                        <button
                            key={opt}
                            onClick={() => {
                                setTimeFormat(opt);
                                triggerChange(selectedDate, endDate, hasEndDate, includeTime, startTime, endTime, opt, timezone);
                            }}
                            className="w-full text-left px-4 py-1.5 hover:bg-white/5 flex justify-between items-center transition-colors"
                        >
                            <span>{opt}</span>
                            {opt === timeFormat && <Check className="w-4 h-4 text-white" />}
                        </button>
                    ))}
                </div>
            )}

            {activeMenu === "timezone" && (
                <div className="bg-[#1E1E1E] border border-gray-700/80 rounded-lg shadow-2xl w-[300px] shadow-[0_0_40px_rgba(0,0,0,0.5)] absolute left-[265px] top-[100px] flex flex-col text-sm text-gray-300 animate-in fade-in slide-in-from-left-2 duration-200 h-[300px] py-2">
                    <div className="px-3 pb-2 border-b border-gray-700/80 mb-2">
                        <input
                            type="text"
                            placeholder="Type a timezone or city..."
                            value={tzSearch}
                            onChange={(e) => setTzSearch(e.target.value)}
                            className="w-full bg-black/20 border border-gray-700 rounded px-3 py-1.5 focus:outline-none focus:border-blue-500 text-white"
                        />
                    </div>
                    <div className="overflow-y-auto flex-1 hide-scrollbar">
                        {[
                            "(GMT-12:00) International Date Line West",
                            "(GMT-11:00) Midway Island, Samoa",
                            "(GMT-10:00) Hawaii",
                            "(GMT-09:00) Alaska",
                            "(GMT-08:00) Pacific Time (US & Canada)",
                            "(GMT-08:00) Tijuana, Baja California",
                            "(GMT-07:00) Arizona",
                            "(GMT-07:00) Chihuahua, La Paz, Mazatlan",
                            "(GMT-07:00) Mountain Time (US & Canada)",
                            "(GMT-06:00) Central America",
                            "(GMT-06:00) Central Time (US & Canada)",
                            "(GMT-06:00) Guadalajara, Mexico City, Monterrey",
                            "(GMT-06:00) Saskatchewan",
                            "(GMT-05:00) Bogota, Lima, Quito, Rio Branco",
                            "(GMT-05:00) Eastern Time (US & Canada)",
                            "(GMT-05:00) Indiana (East)",
                            "(GMT-04:00) Atlantic Time (Canada)",
                            "(GMT-04:00) Caracas, La Paz",
                            "(GMT-04:00) Manaus",
                            "(GMT-04:00) Santiago",
                            "(GMT-03:30) Newfoundland",
                            "(GMT-03:00) Brasilia",
                            "(GMT-03:00) Buenos Aires, Georgetown",
                            "(GMT-03:00) Greenland",
                            "(GMT-03:00) Montevideo",
                            "(GMT-02:00) Mid-Atlantic",
                            "(GMT-01:00) Cape Verde Is.",
                            "(GMT-01:00) Azores",
                            "(GMT+00:00) Casablanca, Monrovia, Reykjavik",
                            "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London",
                            "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna",
                            "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague",
                            "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris",
                            "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb",
                            "(GMT+01:00) West Central Africa",
                            "(GMT+02:00) Amman",
                            "(GMT+02:00) Athens, Bucharest, Istanbul",
                            "(GMT+02:00) Beirut",
                            "(GMT+02:00) Cairo",
                            "(GMT+02:00) Harare, Pretoria",
                            "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius",
                            "(GMT+02:00) Jerusalem",
                            "(GMT+02:00) Minsk",
                            "(GMT+02:00) Windhoek",
                            "(GMT+03:00) Kuwait, Riyadh, Baghdad",
                            "(GMT+03:00) Moscow, St. Petersburg, Volgograd",
                            "(GMT+03:00) Nairobi",
                            "(GMT+03:00) Tbilisi",
                            "(GMT+03:30) Tehran",
                            "(GMT+04:00) Abu Dhabi, Muscat",
                            "(GMT+04:00) Baku",
                            "(GMT+04:00) Yerevan",
                            "(GMT+04:30) Kabul",
                            "(GMT+05:00) Yekaterinburg",
                            "(GMT+05:00) Islamabad, Karachi, Tashkent",
                            "(GMT+05:30) Sri Jayawardenepura",
                            "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi",
                            "(GMT+05:45) Kathmandu",
                            "(GMT+06:00) Almaty, Novosibirsk",
                            "(GMT+06:00) Astana, Dhaka",
                            "(GMT+06:30) Yangon (Rangoon)",
                            "(GMT+07:00) Bangkok, Hanoi, Jakarta",
                            "(GMT+07:00) Krasnoyarsk",
                            "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi",
                            "(GMT+08:00) Kuala Lumpur, Singapore",
                            "(GMT+08:00) Irkutsk, Ulaan Bataar",
                            "(GMT+08:00) Perth",
                            "(GMT+08:00) Taipei",
                            "(GMT+09:00) Osaka, Sapporo, Tokyo",
                            "(GMT+09:00) Seoul",
                            "(GMT+09:00) Yakutsk",
                            "(GMT+09:30) Adelaide",
                            "(GMT+09:30) Darwin",
                            "(GMT+10:00) Brisbane",
                            "(GMT+10:00) Canberra, Melbourne, Sydney",
                            "(GMT+10:00) Hobart",
                            "(GMT+10:00) Guam, Port Moresby",
                            "(GMT+10:00) Vladivostok",
                            "(GMT+11:00) Magadan, Solomon Is., New Caledonia",
                            "(GMT+12:00) Auckland, Wellington",
                            "(GMT+12:00) Fiji, Kamchatka, Marshall Is.",
                            "(GMT+13:00) Nuku'alofa"
                        ]
                            .filter(opt => opt.toLowerCase().includes(tzSearch.toLowerCase()))
                            .map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => {
                                        const shortTz = opt.split(")")[0] + ")";
                                        setTimezone(shortTz);
                                        triggerChange(selectedDate, endDate, hasEndDate, includeTime, startTime, endTime, timeFormat, shortTz);
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-white/5 flex justify-between items-center transition-colors text-xs"
                                >
                                    <span className="truncate pr-2">{opt}</span>
                                    {timezone === (opt.split(")")[0] + ")") && <Check className="w-4 h-4 text-white flex-shrink-0" />}
                                </button>
                            ))}
                    </div>
                </div>
            )}

        </div>
    );
}
