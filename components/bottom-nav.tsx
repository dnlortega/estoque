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
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#0B1121] border-t border-white/10 pb-safe">
            <div className="grid h-full grid-cols-5 mx-auto font-medium">
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <Link
                            key={item.url}
                            href={item.url}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 hover:bg-white/5 transition-colors group",
                                isActive ? "text-white" : "text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-6 h-6 transition-all duration-200",
                                    isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-300"
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
