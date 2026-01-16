"use client"

import * as React from "react"
import { ScannerForm } from "@/components/scanner-form"
import { ResultsDashboard } from "@/components/results-dashboard"
import { ScanResult } from "@/types"
import { Radar } from "lucide-react"

export default function Home() {
  const [scanData, setScanData] = React.useState<ScanResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <main className="min-h-screen relative p-6 pt-24 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-16">

        {/* Hero Section */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-semibold tracking-wider text-gray-300 uppercase">Sistema v1.0 Online</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl">
            MARKET<span className="text-primary neon-glow">SPY</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Inteligência competitiva de alta performance.
            <span className="block mt-2 text-gray-500 text-lg">Decodifique o mercado. Maximize seus lucros.</span>
          </p>
        </div>

        {/* Scanner Form */}
        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
          <ScannerForm
            onScanStart={() => {
              setScanData(null)
              setError(null)
            }}
            onScanComplete={setScanData}
            onScanError={setError}
          />
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            <span className="font-semibold block mb-1">Erro de Execução</span>
            {error}
          </div>
        )}

        {/* Results Component */}
        <div className="pb-24">
          <ResultsDashboard data={scanData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <Radar className="w-4 h-4 text-primary" />
            <span>MARKETSPY SYSTEMS INC.</span>
          </div>
          <span>ENGINEERED FOR E-COMMERCE DOMINATION</span>
        </div>
      </footer>
    </main>
  )
}
