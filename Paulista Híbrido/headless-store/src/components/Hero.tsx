import { ShieldCheck, Truck, ThumbsUp } from 'lucide-react';

export default function Hero() {
    return (
        <div className="text-center space-y-6 py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                O Assento Perfeito, <span className="text-blue-600">Sem Erro.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Não gaste dinheiro com o modelo errado. Nosso guia técnico identifica exatamente o que você precisa em 30 segundos.
            </p>

            <div className="flex justify-center gap-4 md:gap-8 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Compatibilidade Garantida</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span>Entrega Rápida</span>
                </div>
            </div>
        </div>
    );
}
