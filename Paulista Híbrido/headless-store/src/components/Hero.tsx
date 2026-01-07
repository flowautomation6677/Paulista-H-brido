'use client';
import { ShieldCheck, Truck, Clock } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/products';

export default function Hero() {
    const scrollToWizard = () => {
        const wizard = document.getElementById('wizard-section');
        if (wizard) {
            wizard.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="text-center space-y-6 py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Encontre o Assento Certo <br className="hidden md:block" />
                <span className="text-green-600">em 30 Segundos</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Tire uma foto da louça ou escolha o formato. <br />
                <span className="font-semibold text-gray-700">A gente garante que vai encaixar.</span>
            </p>

            {/* TRUST ICONS LINE */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-2">
                <div className="flex flex-col items-center gap-1">
                    <Clock className="w-8 h-8 text-blue-600 mb-1" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Leva 30s</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-8 h-8 text-green-600 mb-1" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Garantia de Encaixe</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Truck className="w-8 h-8 text-orange-500 mb-1" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Entrega em 2-3 dias</span>
                </div>
            </div>

            {/* MAIN CTA BUTTON */}
            <div className="pt-4">
                <button
                    onClick={scrollToWizard}
                    className="group bg-gradient-to-r from-green-500 to-green-600 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-green-200/50 hover:scale-105 transition-all duration-200 flex items-center gap-3 mx-auto"
                >
                    DESCOBRIR MEU MODELO
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>

            {/* B2B ENTRY */}
            <div className="flex justify-center pt-2">
                <a
                    href={getWhatsAppUrl("Olá! Tenho interesse em comprar assentos sanitários para [obra/empresa/condomínio] e gostaria de saber sobre descontos para quantidade.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-100 border border-gray-200 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-200 transition-colors cursor-pointer max-w-sm"
                >
                    <span className="text-xl">🏢</span>
                    <div className="text-left">
                        <p className="text-xs font-bold text-gray-700">Compra para empresa/obra?</p>
                        <p className="text-[10px] text-gray-500">Desconto a partir de 10 unidades <span className="text-blue-600 underline">Falar com Comercial</span></p>
                    </div>
                </a>
            </div>
        </div>
    );
}
