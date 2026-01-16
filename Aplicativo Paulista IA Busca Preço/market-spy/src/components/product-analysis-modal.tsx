"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, TrendingUp, Truck, Tag, BrainCircuit } from "lucide-react"

interface AnalysisResult {
    keywords: string[]
    shippingEstimates: string
    copyAnalysis: string
    competitorStrategy: string
}

interface ProductAnalysisModalProps {
    isOpen: boolean
    onClose: () => void
    productUrl: string
    platform: 'mercadolivre' | 'shopee'
    productTitle: string
}

export function ProductAnalysisModal({ isOpen, onClose, productUrl, platform, productTitle }: ProductAnalysisModalProps) {
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        if (isOpen && productUrl) {
            analyzeProduct()
        } else {
            setAnalysis(null)
            setError("")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, productUrl])

    const analyzeProduct = async () => {
        setLoading(true)
        setError("")
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: productUrl, platform })
            })

            if (!res.ok) throw new Error('Analysis failed')

            const data = await res.json()
            setAnalysis(data.analysis)
        } catch (err) {
            setError("Falha ao analisar o produto. Tente novamente.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-gray-950 border-gray-800 text-gray-100">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-primary">
                        <BrainCircuit className="w-6 h-6" /> Análise de Inteligência Artificial
                    </DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Investigando estratégias do concorrente para: <span className="text-gray-200 italic">{productTitle}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            <p className="text-sm text-gray-400 animate-pulse">Lendo descrição completa do produto...</p>
                            <p className="text-xs text-gray-500">Isso pode levar alguns segundos.</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-red-400">
                            <p>{error}</p>
                            <Button variant="outline" onClick={analyzeProduct} className="mt-4 border-red-500/50 hover:bg-red-950">
                                Tentar Novamente
                            </Button>
                        </div>
                    ) : analysis ? (
                        <ScrollArea className="h-[400px] pr-4">
                            <div className="space-y-6">

                                {/* Keywords Section */}
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400">
                                        <Tag className="w-4 h-4" /> Palavras-Chave Detectadas (SEO)
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.keywords.map((kw, i) => (
                                            <Badge key={i} variant="secondary" className="bg-blue-900/30 text-blue-200 hover:bg-blue-900/50">
                                                {kw}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Strategy Section */}
                                <div className="space-y-3 bg-white/5 p-4 rounded-lg border border-white/10">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-purple-400">
                                        <TrendingUp className="w-4 h-4" /> Estratégia de Venda
                                    </h3>
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {analysis.competitorStrategy || "Não identificada."}
                                    </p>
                                    <div className="mt-2 pt-2 border-t border-white/10">
                                        <span className="text-xs font-semibold text-gray-500 uppercase">Análise de Copywriting</span>
                                        <p className="text-sm text-gray-400 mt-1 italic">"{analysis.copyAnalysis}"</p>
                                    </div>
                                </div>

                                {/* Shipping Section */}
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-green-400">
                                        <Truck className="w-4 h-4" /> Logística e Custos
                                    </h3>
                                    <p className="text-sm text-gray-300 bg-green-900/10 p-3 rounded border border-green-900/30">
                                        {analysis.shippingEstimates}
                                    </p>
                                </div>

                            </div>
                        </ScrollArea>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    )
}
