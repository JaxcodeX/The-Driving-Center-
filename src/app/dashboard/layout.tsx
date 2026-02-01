export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-yellow-500/30">
            {/* Mobile-first constraints */}
            <div className="max-w-md mx-auto min-h-screen relative flex flex-col">
                {children}

                {/* Safe area padding for bottom drawer/navigation if needed */}
                <div className="h-24"></div>
            </div>
        </div>
    );
}
