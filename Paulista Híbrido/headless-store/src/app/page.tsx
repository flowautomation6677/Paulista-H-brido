import Hero from '@/components/Hero';
import Wizard from '@/components/Wizard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute top-0 -left-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="container mx-auto px-4 relative z-10 pt-6 pb-20">
        <nav className="flex justify-between items-center py-4 mb-8">
          <div className="font-bold text-xl tracking-tighter text-gray-900">
            Paulista<span className="text-blue-600">.store</span>
          </div>
          <a href="#" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-600 shadow-sm hover:shadow-md transition-all">
            Dúvidas?
          </a>
        </nav>

        <Hero />

        <div id="wizard-section" className="mt-8">
          <Wizard />
        </div>

        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Paulista Híbrido. Tecnologia de Vendas.</p>
        </footer>
      </div>
    </main>
  );
}
