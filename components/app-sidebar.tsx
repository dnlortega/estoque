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
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Package className="h-5 w-5" />
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="uppercase font-bold text-[10px]">MENU PRINCIPAL</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                        tooltip={item.title.toUpperCase()}
                                    >
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span className="uppercase font-bold text-xs tracking-wide">{item.title}</span>
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
