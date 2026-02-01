'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const zipSchema = z.object({
    zipCode: z.string().regex(/^\d{5}$/, "Must be a valid 5-digit zip code"),
});

const ALLOWED_ZIPS = ['37830', '37831', '37716'];

export function GeofenceCheck() {
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    const form = useForm<z.infer<typeof zipSchema>>({
        resolver: zodResolver(zipSchema),
        defaultValues: {
            zipCode: "",
        },
    });

    function onSubmit(values: z.infer<typeof zipSchema>) {
        if (ALLOWED_ZIPS.includes(values.zipCode)) {
            setIsAllowed(true);
        } else {
            setIsAllowed(false);
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-200">
            <CardHeader>
                <CardTitle>Private Lessons Availability</CardTitle>
                <CardDescription>Enter your zip code to check if we serve your area.</CardDescription>
            </CardHeader>
            <CardContent>
                {isAllowed === null ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="37830" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full bg-zinc-900 hover:bg-zinc-800">Check Availability</Button>
                        </form>
                    </Form>
                ) : isAllowed ? (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200 text-center">
                            <p className="font-semibold">Good news! We serve your area.</p>
                            <p className="text-sm">Please proceed to schedule your lesson below.</p>
                        </div>
                        {/* Calendly Embed Placeholder */}
                        <div className="border-2 border-dashed border-zinc-200 rounded-lg h-64 flex items-center justify-center text-zinc-400">
                            Calendly Embed will load here
                        </div>
                        <Button variant="ghost" onClick={() => setIsAllowed(null)} className="w-full text-zinc-500">Check another zip</Button>
                    </div>
                ) : (
                    <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200 text-center">
                            <p className="font-semibold">We are currently not serving your immediate area.</p>
                            <p className="text-sm">However, you can request a custom quote for a surcharge.</p>
                        </div>
                        {/* Request Quote Form Placeholder */}
                        <div className="border border-zinc-100 bg-zinc-50 rounded-lg p-4 text-center">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Request Quote via Email</Button>
                        </div>
                        <Button variant="ghost" onClick={() => setIsAllowed(null)} className="w-full text-zinc-500">Check another zip</Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
