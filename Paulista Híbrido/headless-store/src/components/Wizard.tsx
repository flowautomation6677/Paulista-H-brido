'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reportConversion } from '@/lib/googleAds';
import { Camera, ArrowRight, Maximize2, X } from 'lucide-react';
import { getRecommendations, getCheckoutUrl, getWhatsAppUrl } from '@/lib/products';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Placeholder images function (to be replaced by real assets)
const PlaceholderImage = ({ label }: { label: string }) => (
    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-3 text-gray-400 text-xs">
        [FOTO REAL: {label}]
    </div>
);

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type Step = 'SHAPE' | 'RESULT';

export default function Wizard() {
    const [step, setStep] = useState<Step>('SHAPE');
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [showComparison, setShowComparison] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const handleShapeSelect = (shapeId: string) => {
        setSelectedShape(shapeId);
        setStep('RESULT');
    };

    // Use getRecommendations from imports
    const recommendations = selectedShape && selectedShape !== 'unknown' ? getRecommendations(selectedShape) : null;
    const bestChoice = recommendations?.best;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
            {/* STICKY HEADER */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 py-4 px-6 flex items-center justify-between">
                <div className="font-bold text-xl text-blue-900 tracking-tight">Paulista<span className="text-blue-600">.store</span></div>
                <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Passo {step === 'SHAPE' ? '1' : '2'} de 2
                </div>
            </header>

            <main className="flex-grow pb-32 max-w-lg mx-auto w-full">
                <AnimatePresence mode="wait">
                    {step === 'SHAPE' ? (
                        <motion.div
                            key="shape"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6 p-4"
                        >
                            <div className="text-center space-y-2">
                                <h1 className="text-2xl font-bold text-gray-900">Qual o formato do seu vaso?</h1>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Olhe para a louça do vaso <strong>de cima</strong> e sem a tampa antiga.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'oval', label: 'Oval (Formato de Ovo)', shortLabel: 'OVAL', image: '/images/formato-oval.png' },
                                    { id: 'square', label: 'Quadrado / Reto', shortLabel: 'QUADRADO', image: '/images/quadrado-branco.png' },
                                    { id: 'universal', label: 'Redondo (Padrão)', shortLabel: 'REDONDO', image: '/images/redondo-comum.png' },
                                    { id: 'unknown', label: 'Outros Formatos', shortLabel: 'OUTRO' },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleShapeSelect(item.id)}
                                        className="bg-white p-4 rounded-xl border-2 border-transparent shadow-sm hover:border-blue-500 hover:shadow-md transition-all text-left group overflow-hidden"
                                    >
                                        {item.image ? (
                                            <div className="w-full h-32 flex items-center justify-center mb-3">
                                                <img src={item.image} alt={item.label} className="max-h-full max-w-full object-contain" />
                                            </div>
                                        ) : (
                                            <PlaceholderImage label={item.shortLabel} />
                                        )}
                                        <span className="font-bold text-gray-800 block leading-tight">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-0"
                        >
                            {/* SUCCESS BAR - NEUTRAL COLOR */}
                            <div className="bg-slate-100 text-slate-700 px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm border-b border-slate-200">
                                <div className="bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0">✓</div>
                                Modelos compatíveis com VASO {selectedShape?.toUpperCase()}
                            </div>

                            {!bestChoice ? (
                                <div className="text-center space-y-6 pt-12 p-4">
                                    {/* FALLBACK FOR UNKNOWN OR NO PRODUCT */}
                                    <div className="w-24 h-24 bg-yellow-100 rounded-full mx-auto flex items-center justify-center animate-pulse">
                                        <Camera className="w-12 h-12 text-yellow-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Vamos analisar juntos!</h2>
                                    <p className="text-gray-600">Para garantir o modelo certo, envie uma foto do seu vaso para nosso especialista.</p>
                                </div>
                            ) : (
                                <div className="p-4 pt-6 space-y-6">
                                    {/* HERO SECTION - BEST CHOICE */}
                                    <div className="space-y-3">
                                        {/* SOCIAL PROOF BADGE */}
                                        <div className="flex justify-end px-2">
                                            <div className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-yellow-200">
                                                <span>🏆</span> 73% dos clientes escolhem este
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-2xl shadow-xl border-2 border-green-500 overflow-hidden relative ring-4 ring-green-50/50">
                                            {/* IMG SECTION WITH CAROUSEL */}
                                            <div className="bg-gray-50 h-64 md:h-72 relative group"> {/* Increased height */}

                                                {/* Image */}
                                                {bestChoice.images && bestChoice.images.length > 0 ? (
                                                    // Carousel Logic (Simplified for now with dots)
                                                    <div className="w-full h-full relative overflow-hidden">
                                                        {bestChoice.images.map((img, idx) => (
                                                            <div
                                                                key={idx}
                                                                className={clsx(
                                                                    "absolute inset-0 transition-opacity duration-300 flex items-center justify-center p-0", // REMOVED PADDING
                                                                    currentImageIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                                                                )}
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`${bestChoice.name} - Foto ${idx + 1}`}
                                                                    className="w-full h-full object-cover" // Changed to object-cover to fill
                                                                />
                                                            </div>
                                                        ))}

                                                        {/* Expand Hint */}
                                                        <div className="absolute top-3 right-3 z-30 bg-black/40 text-white p-1.5 rounded-lg backdrop-blur-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                            <Maximize2 className="w-4 h-4" />
                                                        </div>

                                                        {/* Carousel Controls */}
                                                        {bestChoice.images.length > 1 && (
                                                            <>
                                                                {/* Dots */}
                                                                <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
                                                                    {bestChoice.images.map((_, idx) => (
                                                                        <button
                                                                            key={idx}
                                                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                                            className={clsx(
                                                                                "w-2 h-2 rounded-full transition-all shadow-sm",
                                                                                currentImageIndex === idx ? "bg-blue-600 w-4" : "bg-gray-300 hover:bg-gray-400"
                                                                            )}
                                                                        />
                                                                    ))}
                                                                </div>

                                                                {/* Arrows (Visible on Hover/Desktop) */}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentImageIndex(prev => prev === 0 ? bestChoice.images!.length - 1 : prev - 1);
                                                                    }}
                                                                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <ArrowRight className="w-5 h-5 rotate-180" />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setCurrentImageIndex(prev => prev === (bestChoice.images!.length - 1) ? 0 : prev + 1);
                                                                    }}
                                                                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-800 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center p-0">
                                                        {bestChoice.imageUrl ? (
                                                            <img src={bestChoice.imageUrl} alt={bestChoice.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-gray-400 font-bold">[SEM FOTO]</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5">
                                                {/* HEADER */}
                                                <div className="mb-4">
                                                    <h3 className="font-extrabold text-2xl text-gray-900 leading-tight">Assento {selectedShape === 'square' ? 'Quadrado' : selectedShape === 'oval' ? 'Oval' : 'Padrão'} Premium</h3>
                                                    <p className="text-sm font-semibold text-green-600 mt-1 flex items-center gap-1">
                                                        <span>✓</span> Com Fechamento Suave (Soft Close)
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                                                        <span className="text-xs text-gray-500 font-medium ml-1">| 4.8 de 5.0 (42 avaliações)</span>
                                                    </div>
                                                </div>

                                                {/* INLINE COMPARISON TABLE (Block 1.D) */}
                                                <div className="bg-slate-50 rounded-lg p-3 mb-5 border border-slate-100 text-xs">
                                                    <div className="grid grid-cols-3 gap-2 text-center items-end">
                                                        <div className="opacity-60">
                                                            <p className="font-bold text-gray-500 mb-1">Básico</p>
                                                            <p className="text-[10px]">R$ 89</p>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                                                                RECOMENDADO
                                                            </div>
                                                            <p className="font-bold text-green-700 mb-1 text-sm">ESTE</p>
                                                            <p className="text-[10px] font-bold">R$ 189</p>
                                                        </div>
                                                        <div className="opacity-60">
                                                            <p className="font-bold text-amber-600 mb-1">Luxo</p>
                                                            <p className="text-[10px]">R$ 409</p>
                                                        </div>
                                                    </div>
                                                    {/* Comparison Rows */}
                                                    <div className="mt-3 space-y-2 border-t border-slate-200 pt-2">
                                                        <div className="grid grid-cols-3 gap-2 text-center items-center">
                                                            <span className="text-red-400">❌ Pá!</span>
                                                            <span className="text-green-600 font-bold">✅ Silêncio</span>
                                                            <span className="text-green-600">✅ Silêncio</span>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2 text-center items-center">
                                                            <span className="text-red-400">⚠️ Fino</span>
                                                            <span className="text-green-600 font-bold">✅ Rígido</span>
                                                            <span className="text-green-600">✅ Resina</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* LUXURY INSERT (Block 2) */}
                                                {recommendations?.luxury && (
                                                    <div className="mb-5 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-white rounded-xl p-3 relative overflow-hidden group hover:border-amber-400 transition-colors cursor-pointer" onClick={() => window.open('/galeria', '_blank')}>
                                                        <div className="flex justify-between items-center relative z-10">
                                                            <div className="flex-1">
                                                                <p className="text-xs font-bold text-amber-600 uppercase mb-0.5">✨ Quer algo exclusivo?</p>
                                                                <h4 className="font-bold text-gray-900 text-sm">Versão Luxo em Resina</h4>
                                                                <p className="text-[10px] text-gray-600 mt-0.5">Escolha a cor perfeita pro seu banho</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-400 font-medium">A partir de</p>
                                                                <p className="font-bold text-amber-600 text-base">R$ 409,90</p>
                                                            </div>
                                                        </div>
                                                        {/* Small hint button */}
                                                        <div className="mt-2 text-center">
                                                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full inline-block">
                                                                VER GALERIA DE CORES 🎨
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* PRICE & CTA (Block 1.E & 1.F) */}
                                                <div className="text-center space-y-4">
                                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                        {bestChoice.originalPrice && (
                                                            <div className="flex justify-center items-center gap-2 mb-1">
                                                                <span className="text-gray-400 line-through text-lg font-medium">R$ {bestChoice.originalPrice.toFixed(2).replace('.', ',')}</span>
                                                                <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded ml-1">-18%</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-center items-baseline gap-1">
                                                            <span className="text-gray-500 text-sm">Por</span>
                                                            <span className="text-4xl font-black text-green-600 tracking-tight">R$ {bestChoice.price.toFixed(2).replace('.', ',')}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">no PIX ou em até 12x no cartão</p>
                                                        <p className="text-sm font-medium text-gray-800 mt-1">ou 3x de R$ {(bestChoice.price / 3).toFixed(2).replace('.', ',')} sem juros</p>
                                                    </div>

                                                    <a
                                                        href={getCheckoutUrl(bestChoice)}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            reportConversion(getCheckoutUrl(bestChoice));
                                                        }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group block w-full py-4 bg-gradient-to-b from-green-500 to-green-600 text-white rounded-xl font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-green-300/50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                                    >
                                                        <span>💬</span>
                                                        COMPRAR PELO WHATSAPP &gt;&gt;
                                                    </a>

                                                    {/* COMPARISON LINK */}
                                                    <button
                                                        onClick={() => setShowComparison(true)}
                                                        className="text-xs text-blue-600 underline hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto"
                                                    >
                                                        <span>🔍</span> Por que este custa mais que o básico?
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DIVIDER */}
                                    <div className="relative flex items-center py-4">
                                        <div className="flex-grow border-t border-gray-300"></div>
                                        <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-widest font-medium text-center">Alternativa</span>
                                        <div className="flex-grow border-t border-gray-300"></div>
                                    </div>

                                    {/* ECONOMY OPTION (Block 3) */}
                                    {/* ECONOMY OPTION (Block 3) */}
                                    {recommendations?.economy && (
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50 relative">
                                            <div className="absolute -top-3 left-4 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded">
                                                ECONÔMICO
                                            </div>
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="max-w-[70%]">
                                                    <h3 className="font-bold text-gray-700 text-sm leading-tight">{recommendations.economy.name}</h3>
                                                    <p className="text-xs text-gray-500 mt-1">Opção de entrada</p>
                                                </div>
                                                <p className="font-bold text-gray-900 text-xl whitespace-nowrap">R$ {recommendations.economy.price.toFixed(2).replace('.', ',')}</p>
                                            </div>

                                            {/* Trade-offs List */}
                                            <ul className="space-y-1.5 mb-4">
                                                {recommendations.economy.features?.map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                                        <span className="text-amber-500">⚠️</span> {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <a
                                                href={getCheckoutUrl(recommendations.economy)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-2.5 border-2 border-gray-300 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-100 hover:text-gray-800 transition-colors text-center"
                                            >
                                                ESCOLHER MESMO ASSIM
                                            </a>
                                            <p className="text-[10px] text-center text-gray-400 mt-2">
                                                💡 Lembre-se: A maioria volta para trocar em menos de 1 ano
                                            </p>
                                        </div>
                                    )}

                                    {/* EXIT LINK - CATALOG BUTTON */}
                                    <div className="text-center py-6 pb-24">
                                        <a
                                            href="https://paulistareparoeassento.com.br/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-6 py-3 bg-white border border-gray-200 text-gray-500 font-medium text-sm rounded-full shadow-sm hover:bg-gray-50 hover:text-gray-700 hover:border-gray-300 transition-all"
                                        >
                                            Ver catálogo completo da loja ↗
                                        </a>
                                    </div>
                                </div>
                            )}



                            {/* COMPARISON MODAL */}
                            <AnimatePresence>
                                {showComparison && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowComparison(false)}>
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                                                <h3 className="font-bold text-lg">Tira-Teima</h3>
                                                <button onClick={() => setShowComparison(false)} className="text-white/80 hover:text-white">✕</button>
                                            </div>
                                            <div className="p-4">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="py-2 text-left font-medium text-gray-500"></th>
                                                            <th className="py-2 text-center font-bold text-gray-400">
                                                                Básico (R$ {recommendations?.economy?.price ? Math.floor(recommendations.economy.price) : '??'})
                                                            </th>
                                                            <th className="py-2 text-center font-black text-blue-600">
                                                                Recomendado (R$ {bestChoice?.price ? Math.floor(bestChoice.price) : '??'})
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-100">
                                                        <tr>
                                                            <td className="py-3 font-medium text-gray-600">Barulho</td>
                                                            <td className="py-3 text-center text-gray-500">Tampa bate (Pá!)</td>
                                                            <td className="py-3 text-center font-bold text-green-600">Desce devagar (Silêncio)</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-3 font-medium text-gray-600">Material</td>
                                                            <td className="py-3 text-center text-gray-500">Plástico Fino</td>
                                                            <td className="py-3 text-center font-bold text-blue-600">Injetado Rígido (Forte)</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="py-3 font-medium text-gray-600">Garantia</td>
                                                            <td className="py-3 text-center text-gray-500">3 meses</td>
                                                            <td className="py-3 text-center font-bold text-blue-600">1 ano</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <button
                                                    onClick={() => setShowComparison(false)}
                                                    className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-xl"
                                                >
                                                    Entendi, quero o Recomendado
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* STICKY FOOTER - PANIC BUTTON */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    {/* SELLER FACE */}
                    <div className="shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-xs">👤</div>
                        </div>
                    </div>

                    <div className="flex-grow">
                        <p className="text-xs text-gray-500 font-medium mb-1 pl-1">Ainda na dúvida do modelo?</p>
                        <a
                            href={getWhatsAppUrl(step === 'SHAPE'
                                ? "Olá! Estou na dúvida sobre o formato do meu vaso e quero enviar uma foto."
                                : `Estou vendo os modelos para vaso ${selectedShape} mas ainda tenho dúvida.`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2 px-4 rounded-lg transition-colors border border-green-200 text-sm"
                        >
                            <Camera className="w-4 h-4" />
                            Falar com Atendente
                        </a>
                    </div>
                </div>
            </div>

            {/* LIGHTBOX MODAL - MOVED OUTSIDE STEPS TO AVOID Z-INDEX/TRANSFORM ISSUES */}
            <AnimatePresence>
                {isLightboxOpen && bestChoice?.images && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-0 md:p-4 touch-none"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <button
                                onClick={() => setIsLightboxOpen(false)}
                                className="absolute top-6 right-6 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <motion.img
                                key={currentImageIndex}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                src={bestChoice.images[currentImageIndex]}
                                alt="Zoom Produto"
                                className="max-w-full max-h-[85vh] object-contain md:rounded-lg select-none"
                                onClick={(e) => e.stopPropagation()}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(e, { offset, velocity }) => {
                                    const swipe = offset.x * velocity.x;
                                    const swipeConfidenceThreshold = 10000;
                                    if (swipe < -swipeConfidenceThreshold) {
                                        setCurrentImageIndex(prev => prev === (bestChoice.images!.length - 1) ? 0 : prev + 1);
                                    } else if (swipe > swipeConfidenceThreshold) {
                                        setCurrentImageIndex(prev => prev === 0 ? bestChoice.images!.length - 1 : prev - 1);
                                    } else if (Math.abs(offset.x) > 100) {
                                        // Fallback for slow drags
                                        if (offset.x < 0) setCurrentImageIndex(prev => prev === (bestChoice.images!.length - 1) ? 0 : prev + 1);
                                        else setCurrentImageIndex(prev => prev === 0 ? bestChoice.images!.length - 1 : prev - 1);
                                    }
                                }}
                            />

                            {/* Mobile Navigation Hints or Arrows */}
                            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 pointer-events-none z-[110]">
                                {bestChoice.images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={clsx(
                                            "w-2.5 h-2.5 rounded-full transition-all shadow-sm",
                                            currentImageIndex === idx ? "bg-white w-6" : "bg-white/30"
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
