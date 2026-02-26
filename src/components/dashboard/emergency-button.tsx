'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export function EmergencyButton() {
    const [emergencyLoading, setEmergencyLoading] = useState(false);

    const handleEmergency = async () => {
        if (!confirm("CONFIRM EMERGENCY: This will alert headquarters and log your coordinates.")) return;

        setEmergencyLoading(true);
        try {
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
        } catch {
            alert("OFFLINE ERROR. CALL 911.");
        } finally {
            setEmergencyLoading(false);
        }
    };

    return (
        <Button
            variant="destructive"
            className="w-full h-12 bg-red-900/50 hover:bg-red-900 text-red-200 border border-red-900 active:scale-[0.98] transition-all"
            onClick={handleEmergency}
            disabled={emergencyLoading}
        >
            <AlertTriangle className="mr-2 h-5 w-5" />
            {emergencyLoading ? "TRANSMITTING..." : "LOG INCIDENT"}
        </Button>
    );
}
