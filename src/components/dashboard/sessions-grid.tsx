import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users } from 'lucide-react';
import type { Session } from '@/lib/data/sessions';

// ============================================================
// HELPERS
// ============================================================

function formatDateRange(start: string, end: string): string {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = s.toLocaleDateString('en-US', opts);
    const endStr = e.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
    return `${startStr} – ${endStr}`;
}

function getSessionStatus(session: Session): {
    label: string;
    color: string;
    bgColor: string;
} {
    const today = new Date();
    const start = new Date(session.start_date + 'T00:00:00');
    const end = new Date(session.end_date + 'T00:00:00');
    const spotsLeft = session.max_seats - session.seats_booked;

    if (today > end) {
        return { label: 'COMPLETED', color: 'text-slate-500', bgColor: 'bg-slate-500/10' };
    }
    if (today >= start && today <= end) {
        return { label: 'IN PROGRESS', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    }
    if (spotsLeft <= 0) {
        return { label: 'FULL', color: 'text-red-400', bgColor: 'bg-red-500/10' };
    }
    if (spotsLeft <= 5) {
        return { label: 'ALMOST FULL', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    }
    return { label: 'OPEN', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
}

// ============================================================
// COMPONENTS
// ============================================================

function SessionRow({ session }: { session: Session }) {
    const spotsLeft = session.max_seats - session.seats_booked;
    const fillPercent = Math.round((session.seats_booked / session.max_seats) * 100);
    const status = getSessionStatus(session);

    return (
        <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-200">
                            {formatDateRange(session.start_date, session.end_date)}
                        </span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${status.color} ${status.bgColor}`}>
                        {status.label}
                    </span>
                </div>

                {/* Seat progress bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs text-slate-400">
                                {session.seats_booked}/{session.max_seats} enrolled
                            </span>
                        </div>
                        <span className="text-xs font-mono text-slate-500">
                            {spotsLeft} left
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{ width: `${fillPercent}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * SessionsGrid — Server Component
 * Renders a list of sessions with live data from Supabase.
 * Receives sessions as props (fetched in the parent Server Component via `getSessions()`).
 */
export function SessionsGrid({ sessions }: { sessions: Session[] }) {
    if (sessions.length === 0) {
        return (
            <div className="text-center py-8 text-slate-500">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No sessions found.</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Class Sessions
                </h2>
                <span className="text-xs text-slate-600">
                    {sessions.length} total
                </span>
            </div>
            {sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
            ))}
        </div>
    );
}
