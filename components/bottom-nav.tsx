'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Users,
    HandCoins,
    History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
    const pathname = usePathname();

    const items = [
        {
            title: 'Início',
            url: '/',
            icon: LayoutDashboard,
        },
        {
            title: 'Produtos',
            url: '/produtos',
            icon: Package,
        },
        {
            title: 'Vendedores',
            url: '/vendedores',
            icon: Users,
        },
        {
            title: 'Consignação',
            url: '/consignacao',
            icon: HandCoins,
        },
        {
            title: 'Histórico',
            url: '/historico',
            icon: History,
        },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background/60 backdrop-blur-xl border-t border-primary/10 pb-safe transition-all duration-500">
            <div className="grid h-full grid-cols-5 mx-auto font-medium">
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 transition-all duration-300 group relative",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            {isActive && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                            )}
                            <item.icon
                                className={cn(
                                    "w-6 h-6 transition-all duration-300",
                                    isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]" : "group-hover:scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
