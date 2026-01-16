"use client"

import * as React from "react"
import { Loader2, Search, Zap, Crosshair } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScanRequest, ScanResult } from "@/types"
import { cn } from "@/lib/utils"

interface ScannerFormProps {
    onScanStart: () => void
    onScanComplete: (data: ScanResult) => void
    onScanError: (error: string) => void
}

export function ScannerForm({ onScanStart, onScanComplete, onScanError }: ScannerFormProps) {
    const [keyword, setKeyword] = React.useState("")
    const [limit, setLimit] = React.useState(10)
    const [platforms, setPlatforms] = React.useState<{ ml: boolean; shopee: boolean }>({
        ml: true,
        shopee: false,
    })
    const [loading, setLoading] = React.useState(false)

    const [statusMessage, setStatusMessage] = React.useState("")
    const [progress, setProgress] = React.useState(0)

    const pollJobStatus = async (jobId: string) => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/scan/status?id=${jobId}`)
                const data = await res.json()

                if (data.error) {
                    throw new Error(data.error)
                }

                if (data.state === 'completed' && data.result) {
                    clearInterval(interval)
                    setLoading(false)
                    onScanComplete(data.result)
                } else if (data.state === 'failed') {
                    clearInterval(interval)
                    setLoading(false)
                    onScanError(`Job falhou: ${data.error || 'Erro desconhecido'}`)
                } else {
                    // Update progress UI
                    const prog = typeof data.progress === 'number' ? data.progress : 0
                    setProgress(prog)
                    setStatusMessage(`Processando... ${prog}% (${data.state})`)
                }
            } catch (err) {
                console.error("Polling error", err)
                // Don't stop immediately on one glitch, but maybe after X fails. keeping simple for now.
            }
        }, 2000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!keyword.trim()) return
        if (!platforms.ml && !platforms.shopee) {
            onScanError("Selecione pelo menos uma plataforma alvo.")
            return
        }

        setLoading(true)
        setProgress(0)
        setStatusMessage("Iniciando varredura...")
        onScanStart()

        try {
            const selectedPlatforms = []
            if (platforms.ml) selectedPlatforms.push("mercadolivre")
            if (platforms.shopee) selectedPlatforms.push("shopee")

            const payload: ScanRequest = {
                keyword,
                limit,
                platforms: selectedPlatforms as any,
            }

            const res = await fetch("/api/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error("Falha ao iniciar varredura.")

            const { jobId } = await res.json()
            if (!jobId) throw new Error("ID do Job não retornado.")

            // Start polling
            pollJobStatus(jobId)

        } catch (error) {
            setLoading(false)
            onScanError(error instanceof Error ? error.message : "Erro desconhecido")
        }
    }

    return (
        <Card className="full-width glass-panel border-0 ring-1 ring-white/10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    <Crosshair className="w-6 h-6 text-primary" />
                    Configuração de Alvo
                </CardTitle>
                <CardDescription className="text-gray-400">
                    Defina os parâmetros para a extração de dados competitivos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <Label htmlFor="keyword" className="text-gray-300">Produto Alvo (Keyword)</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="keyword"
                                    placeholder="Ex: iPhone 15 Pro Max"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    className="pl-9 glass-input h-11 text-lg"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <Label htmlFor="limit" className="text-gray-300">Profundidade (5-50)</Label>
                            <Input
                                id="limit"
                                type="number"
                                min={5}
                                max={50}
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="glass-input h-11"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-gray-300">Fontes de Dados</Label>
                        <div className="flex flex-wrap gap-4">
                            <label className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-black/20 cursor-pointer transition-all hover:bg-white/5 hover:border-primary/50",
                                platforms.ml && "border-primary bg-primary/10 ring-1 ring-primary"
                            )}>
                                <Checkbox
                                    className="hidden" // Hiding default, using container state for visual
                                    id="ml"
                                    checked={platforms.ml}
                                    onChange={(checked) =>
                                        setPlatforms((prev) => ({ ...prev, ml: checked === true }))
                                    }
                                />
                                <div className={`w-4 h-4 rounded-full border ${platforms.ml ? "bg-primary border-primary" : "border-gray-500"}`} />
                                <span className="font-medium text-gray-200">Mercado Livre</span>
                            </label>

                            <label className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-black/20 cursor-pointer transition-all hover:bg-white/5 hover:border-primary/50",
                                platforms.shopee && "border-primary bg-primary/10 ring-1 ring-primary"
                            )}>
                                <Checkbox
                                    className="hidden"
                                    id="shopee"
                                    checked={platforms.shopee}
                                    onChange={(checked) =>
                                        setPlatforms((prev) => ({ ...prev, shopee: checked === true }))
                                    }
                                />
                                <div className={`w-4 h-4 rounded-full border ${platforms.shopee ? "bg-primary border-primary" : "border-gray-500"}`} />
                                <span className="font-medium text-gray-200">Shopee</span>
                            </label>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-lg h-14 bg-primary hover:bg-primary/80 neon-glow transition-all duration-300 font-semibold tracking-wide"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {statusMessage || "Iniciando Protocolo..."}
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-5 w-5 fill-current" />
                                EXECUTAR ANÁLISE DE MERCADO
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
