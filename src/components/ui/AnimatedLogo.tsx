import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface AnimatedLogoProps {
    className?: string;
}

export function AnimatedLogo({ className }: AnimatedLogoProps) {
    const [startSecond, setStartSecond] = useState(false);

    useEffect(() => {
        // Start second animation after the first one completes (approx 0.8s)
        const timer = setTimeout(() => {
            setStartSecond(true);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={cn("relative w-96 max-w-full", className)}>
            {/* Container for proper aspect ratio sizing (invisible placeholder) */}
            <img
                src="/src/assets/logo-center-final.png"
                alt="Bags Unlimited"
                className="opacity-0 w-full h-auto"
            />

            {/* Top Half of Logo (BAGS) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    clipPath: 'inset(0 0 45% 0)', // Show top 55%
                    mixBlendMode: 'multiply'
                }}
            >
                <div className="absolute inset-0 animate-reveal-width">
                    <img
                        src="/src/assets/logo-center-final.png"
                        alt="Bags Unlimited"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>

            {/* Bottom Half of Logo (UNLIMITED) */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{
                    clipPath: 'inset(55% 0 0 0)', // Show bottom 45%
                    mixBlendMode: 'multiply'
                }}
            >
                <div
                    className={cn(
                        "absolute inset-0 opacity-0",
                        startSecond && "animate-reveal-width opacity-100"
                    )}
                >
                    <img
                        src="/src/assets/logo-center-final.png"
                        alt="Bags Unlimited"
                        className="w-full h-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}
