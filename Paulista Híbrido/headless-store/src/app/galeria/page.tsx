'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Hammer, Package, ArrowRight, Star } from 'lucide-react';
import { ProjectGrid, CatalogSection, FaqSection } from '@/components/GalleryComponents';
import { getWhatsAppUrl } from '@/lib/products';

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-white pb-0">
            {/* SEÇÃO 1: HERO */}
            <section className="relative bg-slate-900 text-white overflow-hidden">
                {/* Background Placeholder (Video/GIF) */}
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div
                    className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-20"
                />
                {/* Animated Background Element (Placeholder) */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"
                />

                <div className="relative z-30 container mx-auto px-4 pt-20 pb-16 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                            ASSENTOS <span className="text-amber-400">SOB MEDIDA</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-200 font-light mb-8 max-w-2xl mx-auto">
                            Criados exclusivamente para você. <br />
                            <span className="font-medium text-white">Beleza, conforto e zero "gambiarra".</span>
                        </p>
                    </motion.div>

                    {/* Timeline Visual (Mini) */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 mt-8 inline-block w-full max-w-3xl">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 relative">
                            {/* Line Overlay (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-white/20 -translate-y-1/2 z-0"></div>

                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50">
                                    <span className="text-xl">📱</span>
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-sm uppercase tracking-wider">Você Escolhe</p>
                                    <p className="text-xs text-gray-300">3 minutos</p>
                                </div>
                            </div>

                            <ArrowRight className="md:hidden text-white/50 rotate-90 my-2" />

                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-900/50">
                                    <Hammer className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-sm uppercase tracking-wider">Nós Fabricamos</p>
                                    <p className="text-xs text-gray-300">~10 dias</p>
                                </div>
                            </div>

                            <ArrowRight className="md:hidden text-white/50 rotate-90 my-2" />

                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-900/50">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-sm uppercase tracking-wider">Você Recebe</p>
                                    <p className="text-xs text-gray-300">Entrega Rápida</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEÇÃO 2: GALERIA DE PROJETOS */}
            <section className="py-16 md:py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Galeria de Projetos Reais</h2>
                        <p className="text-gray-500">Veja o que já entregamos para clientes exigentes como você.</p>
                    </div>
                    <ProjectGrid />
                </div>
            </section>

            {/* SEÇÃO 3: CATÁLOGO */}
            <section className="py-16 md:py-20 bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Explore as Possibilidades</h2>
                        <p className="text-gray-500">Cores, materiais e acabamentos para combinar com seu banheiro.</p>
                    </div>
                    <CatalogSection />
                </div>
            </section>

            {/* SEÇÃO 4 & 5: PASSO A PASSO & FAQ */}
            <section className="py-16 md:py-20 bg-slate-50 border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Timeline Detalhada (Simplificada para texto aqui, foco no FAQ) */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Do Pedido à Instalação</h2>
                        <div className="grid md:grid-cols-4 gap-6 text-center">
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl mb-2">📱</div>
                                <h3 className="font-bold text-gray-800">1. Consulta</h3>
                                <p className="text-xs text-gray-500 mt-2">Envie foto do vaso no WhatsApp. Orçamento em 1h.</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl mb-2">🏭</div>
                                <h3 className="font-bold text-gray-800">2. Produção</h3>
                                <p className="text-xs text-gray-500 mt-2">Fabricação dedicada. Fotos do processo no dia 5.</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl mb-2">📦</div>
                                <h3 className="font-bold text-gray-800">3. Envio</h3>
                                <p className="text-xs text-gray-500 mt-2">Embalagem tripla reforçada e seguro total.</p>
                            </div>
                            <div className="p-4 bg-white rounded-xl shadow-sm">
                                <div className="text-3xl mb-2">🏠</div>
                                <h3 className="font-bold text-gray-800">4. Instalação</h3>
                                <p className="text-xs text-gray-500 mt-2">Vídeo exclusivo e suporte por 30 dias.</p>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">Tire suas dúvidas</h2>
                        <FaqSection />
                    </div>
                </div>
            </section>

            {/* SEÇÃO 6: CTA FINAL */}
            <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">PRONTO PARA CRIAR O SEU?</h2>
                    <p className="text-gray-300 mb-8 text-lg">Não aceite o "mais ou menos". Tenha o assento perfeito.</p>

                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 shadow-2xl">
                        <a
                            href={getWhatsAppUrl("Olá! Quero falar com um especialista sobre um assento personalizado (Vim pela Galeria).")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-xl md:text-2xl py-5 rounded-full shadow-lg shadow-amber-500/20 transform hover:scale-[1.02] transition-all mb-4 flex items-center justify-center gap-3"
                        >
                            <span>💬</span> FALAR COM ESPECIALISTA AGORA
                        </a>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-green-400" />
                                Atendimento em até 10 minutos
                            </span>
                            <span className="hidden md:inline">•</span>
                            <span>Seg-Sáb: 9h às 19h</span>
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-2">
                            <div className="flex text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-bold text-white">4.9/5</span>
                            <span className="text-gray-400 text-xs">(87 avaliações reais)</span>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
