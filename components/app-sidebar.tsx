'use client';

import * as React from 'react';
import {
    LayoutDashboard,
    Package,
    Users,
    HandCoins,
    History,
    TrendingUp,
    Settings,
} from 'lucide-react';
import Image from 'next/image';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
    {
        title: 'Dashboard',
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

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 p-1">
                        <Image src="/logo.png" alt="Estoque+" width={40} height={40} className="object-contain" />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title.toUpperCase()}
                                    >
                                        <Link href={item.url} className="flex justify-center">
                                            <item.icon />
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
        </Sidebar>
    );
}
