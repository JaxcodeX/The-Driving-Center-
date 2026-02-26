import { ActiveSessionCard } from "@/components/dashboard/active-session-card";
import { QuickStatsRow } from "@/components/dashboard/quick-stats-row";
import { LogDriveDrawer } from "@/components/dashboard/log-drive-drawer";
import { SessionsGrid } from "@/components/dashboard/sessions-grid";
import { EmergencyButton } from "@/components/dashboard/emergency-button";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { getSessions } from "@/lib/data/sessions";

export default async function DashboardPage() {
    // ── SERVER-SIDE DATA FETCH ──────────────────────────────
    // This runs on the server at request time.
    // The sessions table has a public SELECT RLS policy,
    // so this will work with the anon key.
    const sessions = await getSessions();

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

            {/* Live Sessions from Supabase */}
            <div className="mt-6">
                <SessionsGrid sessions={sessions} />
            </div>

            {/* Bottom Actions - Thumb Zone */}
            <div className="mt-auto space-y-4 pb-6">
                <LogDriveDrawer />
                <EmergencyButton />
            </div>
        </div>
    );
}
