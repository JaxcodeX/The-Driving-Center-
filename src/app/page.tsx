import { SplitHero } from "@/components/split-hero";
import { LegalFooter } from "@/components/legal-footer";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col font-sans">
            <SplitHero />
            <LegalFooter />
        </main>
    );
}
