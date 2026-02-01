'use client';

import { ActiveSessionCard } from "@/components/dashboard/active-session-card";
import { QuickStatsRow } from "@/components/dashboard/quick-stats-row";
import { LogDriveDrawer } from "@/components/dashboard/log-drive-drawer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [emergencyLoading, setEmergencyLoading] = useState(false);

    const handleEmergency = async () => {
        if (!confirm("CONFIRM EMERGENCY: This will alert headquarters and log your coordinates.")) return;

        setEmergencyLoading(true);
        try {
            // Mock GPS
            const payload = {
                latitude: 36.0104,
                longitude: -84.2696,
                timestamp: new Date().toISOString()
            };

            const res = await fetch('/api/admin/emergency-log', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("EMERGENCY SIGNAL SENT. Backup notified.");
            } else {
                alert("SIGNAL FAILED. CALL 911.");
            }
        } catch (e) {
            alert("OFFLINE ERROR. CALL 911.");
        } finally {
            setEmergencyLoading(false);
        }
    };

    return (
        <div className="p-4 flex flex-col h-full min-h-[calc(100vh-2rem)]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                    INSTRUCTOR <span className="text-slate-500">COCKPIT</span>
                </h1>
                <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white">
                    <LogOut className="w-5 h-5" />
                </Button>
            </div>

            {/* Primary Content */}
            <QuickStatsRow />
            <ActiveSessionCard />

            {/* Bottom Actions - Thumb Zone */}
            <div className="mt-auto space-y-4 pb-6">
                <LogDriveDrawer />

                <Button
                    variant="destructive"
                    className="w-full h-12 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900 active:scale-[0.98] transition-all"
                    onClick={handleEmergency}
                    disabled={emergencyLoading}
                >
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {emergencyLoading ? "TRANSMITTING..." : "LOG INCIDENT"}
                </Button>
            </div>
        </div>
    );
}
