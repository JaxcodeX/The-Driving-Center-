'use client';

import { useEffect, useState } from 'react';

export function LegalFooter() {
    const [year, setYear] = useState('');

    useEffect(() => {
        setYear(new Date().getFullYear().toString());
    }, []);

    return (
        <footer className="w-full bg-zinc-950 text-zinc-600 border-t border-zinc-900 py-8 px-6 text-sm">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                    <p>&copy; {year} The Driving Center. All rights reserved.</p>
                    <p className="mt-1">
                        <span className="font-medium text-zinc-500">State License #:</span>{' '}
                        <span className="text-zinc-400">Loading...</span>
                    </p>
                </div>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-400 transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
