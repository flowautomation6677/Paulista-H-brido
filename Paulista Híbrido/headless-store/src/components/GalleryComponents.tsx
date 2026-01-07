'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/products';

// MOCK DATA FOR PROJECTS
export interface Project {
    id: string;
    title: string;
    color: string;
    client: string;
    daysToMake: number;
    imageUrl: string; // Thumb
    fullImageUrl: string; // High Res
    testimonial?: string;
}

export const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Assento em Resina',
        color: 'Verde Musgo',
        client: 'Ana - SP',
        daysToMake: 12,
        imageUrl: '/images/assento-verde-thumb.jpg', // Placeholder
        fullImageUrl: '/images/assento-verde-full.jpg', // Placeholder
        testimonial: 'Ficou exatamente como imaginei! A cor combinou perfeitamente com meu banheiro antigo.'
    },
    {
        id: '2',
        title: 'Assento Clean',
        color: 'Branco Neve',
        client: 'Roberto - RJ',
        daysToMake: 10,
        imageUrl: '/images/assento-branco-thumb.jpg',
        fullImageUrl: '/images/assento-branco-full.jpg',
        testimonial: 'Acabamento impecável. É pesado e não escorrega.'
    },
    {
        id: '3',
        title: 'Assento Madeira',
        color: 'Carvalho',
        client: 'Carla - MG',
        daysToMake: 15,
        imageUrl: '/images/assento-madeira-thumb.jpg',
        fullImageUrl: '/images/assento-madeira-full.jpg',
        testimonial: 'Deu outra vida pro lavabo. Super sofisticado.'
    },
    {
        id: '4',
        title: 'Assento Resina',
        color: 'Preto Total',
        client: 'Marcos - PR',
        daysToMake: 11,
        imageUrl: '/images/assento-preto-thumb.jpg',
        fullImageUrl: '/images/assento-preto-full.jpg',
    },
    {
        id: '5',
        title: 'Assento Resina',
        color: 'Areia',
        client: 'Luciana - BA',
        daysToMake: 13,
        imageUrl: '/images/assento-areia-thumb.jpg',
        fullImageUrl: '/images/assento-areia-full.jpg',
        testimonial: 'Atendimento nota 10. Chegou super bem embalado.'
    },
    {
        id: '6',
        title: 'Assento Glitter',
        color: 'Prata',
        client: 'Beatriz - SP',
        daysToMake: 14,
        imageUrl: '/images/assento-prata-thumb.jpg',
        fullImageUrl: '/images/assento-prata-full.jpg',
    }
];

export function ProjectGrid() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {PROJECTS.map((project) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedProject(project)}
                    >
                        {/* Image Area */}
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            {/* Placeholder for actual image */}
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 bg-gray-50 group-hover:scale-105 transition-transform duration-500">
                                <span className="text-xs">FOTO {project.color}</span>
                            </div>

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="bg-white/90 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                    Ver Detalhes
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 md:p-4">
                            <h3 className="font-bold text-gray-800 text-sm md:text-base leading-tight">{project.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">{project.color}</p>

                            <div className="flex justify-between items-end border-t border-gray-100 pt-2 mt-2">
                                <div>
                                    <p className="text-[10px] text-gray-400">Cliente</p>
                                    <p className="text-[10px] font-medium text-gray-600">{project.client}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-400">Prazo</p>
                                    <p className="text-[10px] font-bold text-green-600">~{project.daysToMake} dias</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* LIGHTBOX */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedProject(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 grid md:grid-cols-2 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-20 bg-white/50 hover:bg-white rounded-full p-2 transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-800" />
                            </button>

                            {/* Left: Image (High Res) */}
                            <div className="bg-gray-100 min-h-[300px] md:min-h-full flex items-center justify-center p-8">
                                <span className="text-gray-400 font-bold text-xl tracking-widest">[FOTO ALTA RESOLUÇÃO]</span>
                            </div>

                            {/* Right: Details */}
                            <div className="p-6 md:p-10 flex flex-col h-full bg-white">
                                <div>
                                    <div className="inline-block bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-md mb-2">
                                        Projeto Realizado
                                    </div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-1">{selectedProject.title}</h2>
                                    <p className="text-lg text-gray-500 mb-6">{selectedProject.color}</p>

                                    {/* Testimonial */}
                                    {selectedProject.testimonial && (
                                        <div className="bg-slate-50 border-l-4 border-amber-400 p-4 mb-8 italic text-gray-600 relative">
                                            <span className="text-amber-400 text-4xl absolute -top-3 left-2 font-serif">“</span>
                                            <p className="indent-4 z-10 relative text-sm md:text-base">
                                                {selectedProject.testimonial}
                                            </p>
                                            <p className="text-right text-xs font-bold mt-2 not-italic text-gray-400">
                                                — {selectedProject.client}
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-white border text-center p-3 rounded-lg">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Material</p>
                                            <p className="font-semibold text-gray-800 text-sm">Resina Poliéster</p>
                                        </div>
                                        <div className="bg-white border text-center p-3 rounded-lg">
                                            <p className="text-xs text-gray-400 uppercase font-bold">Acabamento</p>
                                            <p className="font-semibold text-gray-800 text-sm">Alto Brilho</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-gray-100">
                                    <p className="text-center text-sm text-gray-500 mb-3">Gostou deste estilo?</p>
                                    <a
                                        href={getWhatsAppUrl(`Olá! Vi o projeto "${selectedProject.title}" na cor ${selectedProject.color} e queria um orçamento para um parecido.`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold text-center py-4 rounded-xl shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <span>💬</span>
                                        QUERO UM IGUAL A ESTE
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

// SECTION 3: CATALOG (COLORS & MATERIALS)
export function CatalogSection() {
    return (
        <div className="space-y-12">
            {/* CORES */}
            <div>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900">A. Cores e Acabamentos</h3>
                    <span className="text-xs font-medium text-blue-600">Arraste para ver →</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 px-1 lg:px-0 scrollbar-hide snap-x">
                    {[
                        { name: 'Branco', hex: '#FFFFFF', tag: 'Clássico' },
                        { name: 'Preto', hex: '#000000', tag: 'Moderno' },
                        { name: 'Verde Musgo', hex: '#485846', tag: '🔥 Mais Pedida' },
                        { name: 'Beige', hex: '#EADBC8', tag: 'Neutro' },
                        { name: 'Terracota', hex: '#965A3E', tag: null },
                        { name: 'Azul Petróleo', hex: '#1D4E5F', tag: 'Sofisticado' },
                        { name: 'Cinza', hex: '#808080', tag: null },
                    ].map((color, idx) => (
                        <div key={idx} className="flex-shrink-0 snap-center flex flex-col items-center gap-2 group cursor-pointer w-24 md:w-32">
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-md border-2 border-white group-hover:scale-105 transition-transform relative"
                                style={{ backgroundColor: color.hex }}
                            >
                                {/* Tag */}
                                {color.tag && (
                                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10">
                                        {color.tag}
                                    </span>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-gray-800 text-sm">{color.name}</p>
                                <p className="text-[10px] text-gray-500">+R$ 0,00</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MATERIALS */}
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">B. Materiais Premium</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* RESINA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-gray-100 md:w-1/3 min-h-[150px] relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-xs">[FOTO TEXTURA]</div>
                        </div>
                        <div className="p-6 md:w-2/3 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-black text-lg text-gray-900">RESINA PREMIUM</h4>
                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded">Resistente</span>
                            </div>
                            <ul className="space-y-1 mb-4">
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Durabilidade +10 anos</li>
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Brilho Incomparável</li>
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> 100% Impermeável</li>
                            </ul>
                            <p className="text-gray-500 text-xs">A partir de <span className="text-gray-900 font-bold text-base">R$ 409,90</span></p>
                        </div>
                    </div>

                    {/* MADEIRA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row opacity-80 hover:opacity-100 transition-opacity">
                        <div className="bg-amber-100 md:w-1/3 min-h-[150px] relative">
                            <div className="absolute inset-0 flex items-center justify-center text-amber-800/50 font-bold text-xs">[FOTO VEIOS]</div>
                        </div>
                        <div className="p-6 md:w-2/3 flex flex-col justify-center">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-black text-gray-900">MADEIRA MACIÇA</h4>
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-1 rounded">Nobre</span>
                            </div>
                            <ul className="space-y-1 mb-4">
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cada peça é única</li>
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Toque quente/natural</li>
                                <li className="text-sm text-gray-600 flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Envelhecimento nobre</li>
                            </ul>
                            <p className="text-gray-500 text-xs">A partir de <span className="text-gray-900 font-bold text-base">R$ 589,90</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// FAQ SECTION
export function FaqSection() {
    const FAQS = [
        { q: 'Qual o prazo de entrega?', a: 'O tempo de fabricação artesanal é de 10 a 12 dias úteis. Somando ao transporte, você recebe em média entre 15 a 20 dias após o pedido.' },
        { q: 'E se a cor ficar diferente?', a: 'Nós enviamos uma amostra digital (foto/vídeo) da cor preparada antes de iniciar a moldagem final. Você aprova tudo pelo WhatsApp.' },
        { q: 'Serve em qualquer vaso?', a: 'Sim! Como é sob medida, nós usamos o molde exato da louça do seu vaso. Por isso a foto inicial é tão importante.' },
        { q: 'Qual a diferença do pronto (R$ 189) pro personalizado (R$ 409)?', a: 'O modelo pronto é injetado em larga escala. O personalizado é feito à mão, em resina maciça de poliéster, com polimento automotivo individual. É uma peça de decoração.' }
    ];

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            {FAQS.map((item, i) => (
                <details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-gray-800 group-hover:bg-gray-50 transition-colors">
                        <span className="flex items-center gap-3">
                            <span className="text-green-500 font-bold">?</span>
                            {item.q}
                        </span>
                        <span className="transition group-open:rotate-180">
                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                        </span>
                    </summary>
                    <div className="text-gray-600 text-sm p-4 pt-0 leading-relaxed bg-gray-50/50">
                        {item.a}
                    </div>
                </details>
            ))}
        </div>
    );
}
