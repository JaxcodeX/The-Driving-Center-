'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import Link from 'next/link';

interface InventoryCardProps {
    sessionId: string;
    sessionName: string;
    dateRange: string;
    stripeLink: string;
}

export function InventoryCard({ sessionId, sessionName, dateRange, stripeLink }: InventoryCardProps) {
    const [count, setCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCount() {
            try {
                const { data, error } = await supabase.rpc('get_class_enrollment_count', {
                    session_id: sessionId
                });

                if (error) {
                    console.error("Error fetching count:", error);
                    setCount(0); // Fallback
                } else {
                    setCount(data as number);
                }
            } catch (e) {
                console.error("Fetch error:", e);
                setCount(0);
            } finally {
                setLoading(false);
            }
        }

        fetchCount();
    }, [sessionId]);

    const isSoldOut = count !== null && count >= 30;

    return (
        <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${isSoldOut ? 'opacity-85 grayscale filter' : 'border-zinc-200'}`}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" />
                    {sessionName}
                </CardTitle>
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-sm font-medium text-zinc-600">
                    {loading ? 'Checking availability...' : isSoldOut ? 'Sold Out' : `${30 - (count || 0)} spots remaining`}
                </div>
                {/* Progress bar visual could go here */}
            </CardContent>
            <CardFooter>
                {isSoldOut ? (
                    <Button disabled className="w-full bg-zinc-200 text-zinc-500 cursor-not-allowed">
                        Class Full
                    </Button>
                ) : (
                    <Button asChild className="w-full bg-zinc-900 hover:bg-zinc-800">
                        <Link href={stripeLink}>
                            Register Now
                        </Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
