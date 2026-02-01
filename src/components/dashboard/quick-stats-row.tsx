'use client';

import { CheckCircle2, DollarSign, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function QuickStatsRow() {
    const [showRevenue, setShowRevenue] = useState(false);

    return (
        <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Box 1: Today's Drives */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Drivess</span>
                <span className="text-2xl font-bold text-white mt-1">2<span className="text-slate-600 text-lg">/4</span></span>
            </div>

            {/* Box 2: Pending Certs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center relative">
                {/* Red Dot Indicator */}
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Certs</span>
                <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    <span className="text-2xl font-bold text-white">3</span>
                </div>
            </div>

            {/* Box 3: Revenue (Privacy Toggle) */}
            <div
                className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center cursor-pointer active:bg-slate-800 transition-colors"
                onClick={() => setShowRevenue(!showRevenue)}
            >
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rev (Mo)</span>
                <div className="flex items-center gap-1 mt-1">
                    {showRevenue ? (
                        <span className="text-xl font-bold text-green-400 animate-in fade-in">$4.2k</span>
                    ) : (
                        <div className="flex items-center text-slate-600">
                            <DollarSign className="w-4 h-4" />
                            <EyeOff className="w-5 h-5 ml-1" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
