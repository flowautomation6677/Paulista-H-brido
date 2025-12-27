'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Camera, ShoppingCart, HelpCircle } from 'lucide-react';
import { findProduct, getCheckoutUrl, getWhatsAppUrl } from '@/lib/products';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

type Step = 'SHAPE' | 'CONFIRM' | 'RESULT';

export default function Wizard() {
    const [step, setStep] = useState<Step>('SHAPE');
    const [selectedShape, setSelectedShape] = useState<string | null>(null);

    const handleShapeSelect = (shape: string) => {
        setSelectedShape(shape);
        if (shape === 'unknown') {
            setStep('RESULT');
        } else {
            setStep('CONFIRM');
        }
    };

    const product = selectedShape && selectedShape !== 'unknown' ? findProduct(selectedShape) : null;

    const steps = {
        SHAPE: (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-900 text-center">Qual o formato do seu vaso?</h2>
                <p className="text-gray-500 text-center">Selecione o formato que mais se parece com o seu.</p>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'oval', label: 'Oval Tradicional', color: 'bg-blue-100' },
                        { id: 'square', label: 'Quadrado / Retangular', color: 'bg-purple-100' },
                        { id: 'universal', label: 'Universal / Padrão', color: 'bg-green-100' },
                        { id: 'unknown', label: 'Não tenho certeza', icon: <HelpCircle className="w-8 h-8 text-gray-600" />, color: 'bg-gray-100' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleShapeSelect(item.id)}
                            className={cn(
                                "p-6 rounded-xl border-2 border-transparent transition-all hover:border-blue-500 flex flex-col items-center justify-center gap-3 text-center h-40",
                                item.color
                            )}
                        >
                            {item.icon ? item.icon : <div className="w-12 h-12 rounded-full bg-white/50" />}
                            <span className="font-semibold text-gray-700">{item.label}</span>
                        </button>
                    ))}
                </div>
            </motion.div>
        ),
        CONFIRM: (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-900">Confirmar seleção</h2>
                <p className="text-gray-600">Você selecionou: <span className="font-bold text-blue-600 uppercase">{selectedShape}</span></p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setStep('RESULT')}
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        Sim, ver modelos compatíveis <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setStep('SHAPE')}
                        className="text-gray-500 hover:text-gray-700 underline"
                    >
                        Voltar e escolher outro
                    </button>
                </div>
            </motion.div>
        ),
        RESULT: (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
            >
                {selectedShape === 'unknown' || !product ? (
                    <>
                        <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto flex items-center justify-center">
                            <Camera className="w-10 h-10 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Vamos analisar juntos!</h2>
                        <p className="text-gray-600">Para evitar erros, envie uma foto do seu vaso para nosso especialista.</p>
                        <a
                            href={getWhatsAppUrl("Olá! Não sei o modelo do meu vaso e preciso de ajuda. Tenho uma foto.")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                        >
                            Enviar Foto no WhatsApp
                        </a>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                            <Check className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Encontramos o modelo ideal!</h2>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-blue-600 font-bold text-xl mt-1">R$ {product.price.toFixed(2)}</p>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={getCheckoutUrl(product.id)}
                                className="block w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Comprar Agora
                                </div>
                            </a>
                            <p className="text-xs text-gray-400">Checkout seguro via Nuvemshop</p>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ou</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>

                            <a
                                href={getWhatsAppUrl(`Tenho dúvida sobre o modelo ${product.name} (${selectedShape}).`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Tenho uma dúvida técnica
                            </a>
                        </div>
                    </>
                )}
            </motion.div>
        )
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-8 min-h-[500px] flex flex-col justify-center border border-gray-100">
            <AnimatePresence mode="wait">
                <div key={step}>
                    {steps[step]}
                </div>
            </AnimatePresence>
        </div>
    );
}
