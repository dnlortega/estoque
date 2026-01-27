import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Cpu,
    WifiOff,
    MapPin,
    Smartphone,
    Database,
    Layers,
    Zap,
    ShieldCheck,
    Globe,
    MessageSquare,
    Package,
    Users,
    TrendingUp
} from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';

export default function SobrePage() {
    const features = [
        {
            title: "GESTÃO CENTRALIZADA",
            desc: "Controle total do estoque central com referências, preços e alertas de baixo saldo.",
            icon: Package,
            color: "text-blue-500"
        },
        {
            title: "CONSIGNAÇÃO INTELIGENTE",
            desc: "Sistema de transferência para vendedores com acompanhamento de saldo em posse.",
            icon: Users,
            color: "text-purple-500"
        },
        {
            title: "MODO OFFLINE",
            desc: "Funciona mesmo sem internet. As alterações são sincronizadas automaticamente ao reconectar.",
            icon: WifiOff,
            color: "text-orange-500"
        },
        {
            title: "RASTREAMENTO GPS",
            desc: "Cada venda ou movimentação registra a localização exata de onde foi realizada.",
            icon: MapPin,
            color: "text-red-500"
        },
        {
            title: "INTEGRAÇÃO WHATSAPP",
            desc: "Compartilhe recibos, acertos e listas de estoque diretamente com os vendedores.",
            icon: MessageSquare,
            color: "text-green-500"
        },
        {
            title: "DASHBOARD ANALÍTICO",
            desc: "Visão financeira em tempo real: valor em caixa, valor em consignação e estoque total.",
            icon: TrendingUp,
            color: "text-emerald-500"
        }
    ];

    const techStack = [
        { name: "NEXT.JS 15", category: "FRAMEWORK", desc: "Performance de ponta com Server Components." },
        { name: "PRISMA ORM", category: "DATABASE", desc: "Modelagem de dados robusta e segura." },
        { name: "POSTGRESQL", category: "BANCO DE DADOS", desc: "Armazenamento relacional de alta confiabilidade." },
        { name: "DEXIE.JS", category: "OFFLINE CACHE", desc: "Sincronização inteligente de dados locais." },
        { name: "TAILWIND CSS", category: "STYLING", desc: "Interface moderna, responsiva e ultra-rápida." },
        { name: "FRAMER MOTION", category: "ANIMATIONS", desc: "Experiência de uso fluida e premium." }
    ];

    return (
        <FadeIn className="max-w-4xl mx-auto space-y-12 pb-12 uppercase">
            {/* HERO SECTION */}
            <section className="text-center space-y-4 pt-8">
                <Badge variant="outline" className="px-4 py-1 border-primary text-primary font-black tracking-widest">
                    SOBRE O SISTEMA
                </Badge>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
                    ESTOQUE<span className="text-primary">+</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-sm font-medium leading-relaxed">
                    UMA PLATAFORMA PROFISSIONAL DE GESTÃO DE ESTOQUE E CONSIGNAÇÃO,
                    DESENVOLVIDA PARA QUEM BUSCA CONTROLE TOTAL, MOBILIDADE E SEGURANÇA.
                </p>
            </section>

            {/* CORE FEATURES */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <Zap className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-black tracking-tight">FUNCIONALIDADES CHAVE</h2>
                </div>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f, i) => (
                        <StaggerItem key={i}>
                            <Card className="h-full border-none bg-card/50 backdrop-blur-sm hover:bg-accent/5 transition-colors group">
                                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                    <div className={`p-2 rounded-lg bg-background border shadow-sm group-hover:scale-110 transition-transform`}>
                                        <f.icon className={`h-5 w-5 ${f.color}`} />
                                    </div>
                                    <CardTitle className="text-xs font-black tracking-widest">{f.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-[11px] text-muted-foreground font-medium lowercase first-letter:uppercase">
                                        {f.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </section>

            {/* ARCHITECTURE & STACK */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <Cpu className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-black tracking-tight">ARQUITETURA & TECNOLOGIA</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {techStack.map((t, i) => (
                        <div key={i} className="p-4 border border-primary/10 rounded-xl bg-primary/5 hover:border-primary/30 transition-colors">
                            <span className="text-[8px] font-black opacity-40 block mb-1">{t.category}</span>
                            <h3 className="text-[12px] font-black mb-1">{t.name}</h3>
                            <p className="text-[10px] text-muted-foreground leading-tight lowercase first-letter:uppercase">{t.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECURITY & PHILOSOPHY */}
            <section className="bg-primary text-primary-foreground rounded-2xl p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <ShieldCheck className="h-32 w-32" />
                </div>

                <div className="relative z-10 space-y-4">
                    <h2 className="text-2xl font-black italic">CONFIANÇA E DISPONIBILIDADE</h2>
                    <p className="max-w-xl text-sm font-medium opacity-90 lowercase first-letter:uppercase">
                        O ESTOQUE+ FOI CONSTRUÍDO COM O CONCEITO DE "OFFLINE-FIRST".
                        ENTENDEMOS QUE O TRABALHO DE CAMPO NEM SEMPRE TEM CONEXÃO ESTÁVEL.
                        POR ISSO, CADA DADO É TRATADO COM PRIORIDADE, GARANTINDO QUE SUA OPERAÇÃO NUNCA PARE.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="text-[10px] font-black">NUVEM GLOBAL</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            <span className="text-[10px] font-black">BACKUP AUTOMÁTICO</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            <span className="text-[10px] font-black">PWA READY</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER CALL */}
            <footer className="text-center pt-8 border-t border-primary/10">
                <p className="text-[10px] font-black opacity-30 italic">
                    ESTOQUE+ | VERSÃO 2.0 | 2026 - TODOS OS DIREITOS RESERVADOS
                </p>
            </footer>
        </FadeIn>
    );
}
