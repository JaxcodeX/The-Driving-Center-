import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Car, ShieldCheck } from 'lucide-react';

export function SplitHero() {
    return (
        <div className="flex flex-col md:flex-row h-screen w-full">
            {/* Left: New Drivers (Teen Ed) */}
            <div className="md:w-1/2 bg-zinc-950 text-white relative overflow-hidden flex flex-col justify-center items-center p-10 border-r border-zinc-800">
                {/* Abstract "Road" Motif - CSS Gradient/Shapes */}
                <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-600 via-zinc-900 to-transparent" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />

                <div className="z-10 text-center space-y-6 max-w-md">
                    <div className="mx-auto bg-zinc-900/50 p-4 rounded-full border border-zinc-800 w-20 h-20 flex items-center justify-center mb-4">
                        <Car className="w-10 h-10 text-yellow-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
                        New Drivers
                    </h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Begin your journey with Tennessee&apos;s most trusted teen driver education.
                        Safety isn&apos;t just a skill—it&apos;s a mindset.
                    </p>
                    <div className="pt-4">
                        <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full px-8">
                            <Link href="#teen-registration">
                                View Class Schedule
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right: Traffic School (Court Ordered) */}
            <div className="md:w-1/2 bg-slate-50 text-slate-900 relative flex flex-col justify-center items-center p-10">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60" />

                <div className="z-10 text-center space-y-6 max-w-md">
                    <div className="mx-auto bg-white p-4 rounded-full border border-slate-200 w-20 h-20 flex items-center justify-center mb-4 shadow-sm">
                        <ShieldCheck className="w-10 h-10 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900">
                        Traffic School
                    </h1>
                    <p className="text-slate-600 text-lg leading-relaxed text-balance">
                        Court-ordered compliance made simple.
                        Dismiss your citation with our certified 4-hour defensive driving course.
                    </p>
                    <div className="pt-4">
                        <Button asChild size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 rounded-full px-8">
                            <Link href="#traffic-school">
                                Register for Class
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
