'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export function ActiveSessionCard() {
    return (
        <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden mt-6 mb-6">
            <CardContent className="p-0">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Next Student</h2>
                            <p className="text-2xl font-bold text-white mt-1">Sarah Connor</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Time</h2>
                            <p className="text-xl font-mono text-blue-400 mt-1">19:00 - 20:30</p>
                        </div>
                    </div>

                    <div className="bg-slate-950/50 rounded-lg p-3 mb-6 border border-slate-800">
                        <p className="text-sm text-slate-400">
                            <span className="text-yellow-500 font-medium">Goal:</span> Highway merging and nighttime lane changes.
                        </p>
                    </div>

                    <Button className="w-full h-16 text-lg font-bold bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)] transition-all active:scale-[0.98]">
                        <Play className="mr-2 h-6 w-6 fill-current" />
                        START DRIVING SESSION
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
