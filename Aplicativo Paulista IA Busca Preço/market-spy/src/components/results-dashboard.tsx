"use client"

import { Product, ScanResult } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Package, ExternalLink, ArrowRight, ArrowUpDown, Eye } from "lucide-react"
import { useState } from "react"
import { ProductAnalysisModal } from "./product-analysis-modal"

interface ResultsDashboardProps {
    data: ScanResult | null
}

function ProfitBadge({ profit }: { profit: number }) {
    const isHigh = profit > 50
    const isPositive = profit > 0

    let colorClass = "bg-gray-500/20 text-gray-400 border-gray-500/50"
    if (isHigh) colorClass = "bg-green-500/20 text-green-400 border-green-500/50"
    else if (isPositive) colorClass = "bg-blue-500/20 text-blue-400 border-blue-500/50"
    else colorClass = "bg-red-500/20 text-red-400 border-red-500/50"

    return (
        <span className={`px-2 py-1 rounded-md text-xs font-mono border ${colorClass}`}>
            {isPositive ? "+" : ""}R$ {profit.toFixed(2)}
        </span>
    )
}

type SortField = 'price' | 'cost' | 'profit' | null
type SortDirection = 'asc' | 'desc'

export function ResultsDashboard({ data }: ResultsDashboardProps) {
    const [sortField, setSortField] = useState<SortField>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

    // Analysis Modal State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)

    if (!data) return null

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('desc') // Default to high-to-low for metrics usually
        }
    }

    const handleAnalyze = (product: Product) => {
        setSelectedProduct(product)
        setIsAnalysisModalOpen(true)
    }

    const sortedProducts = [...data.products].sort((a, b) => {
        if (!sortField) return 0

        let valA = 0
        let valB = 0

        switch (sortField) {
            case 'price':
                valA = a.price
                valB = b.price
                break
            case 'cost':
                valA = a.margin?.totalCost || 0
                valB = b.margin?.totalCost || 0
                break
            case 'profit':
                valA = a.margin?.estimatedProfit || 0
                valB = b.margin?.estimatedProfit || 0
                break
        }

        return sortDirection === 'asc' ? valA - valB : valB - valA
    })

    return (
        <div className="space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="glass-panel border-0 bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Volume Analisado</CardTitle>
                        <Package className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">{data.summary.totalScanned}</div>
                        <p className="text-xs text-gray-500 mt-1">SKUs únicos detectados</p>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-0 bg-gradient-to-br from-gray-900 to-gray-950">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Preço Médio de Mercado</CardTitle>
                        <DollarSign className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">
                            R$ {data.summary.averagePrice.toFixed(0)}
                            <span className="text-lg text-gray-500 font-normal">.{(data.summary.averagePrice % 1).toFixed(2).substring(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Baseado em todos os canais</p>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-0 relative overflow-hidden bg-gradient-to-br from-green-950/30 to-gray-950 border-green-500/20">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[50px] rounded-full" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-400">Melhor Oportunidade</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500 animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white">
                            {data.summary.bestOpportunity?.margin?.profitMarginPercent?.toFixed(1)}%
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-green-500/80 uppercase tracking-wider font-semibold">Margem Líquida</span>
                            <span className="text-xs text-gray-500">
                                (Lucro: R$ {data.summary.bestOpportunity?.margin?.estimatedProfit.toFixed(2)})
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Table */}
            <Card className="glass-panel border-t border-white/5 overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-black/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-medium text-gray-200">Relatório Tático de Produtos</CardTitle>
                        <div className="text-xs text-gray-500 font-mono">LIVE_DATA_FEED_ACTIVATED</div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto max-h-[600px]">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-black/40 sticky top-0 backdrop-blur-md z-10">
                                <tr>
                                    <th className="px-6 py-4 font-medium tracking-wider">Produto</th>
                                    <th className="px-6 py-4 font-medium tracking-wider">Canal</th>
                                    <th
                                        className="px-6 py-4 font-medium tracking-wider cursor-pointer hover:text-white transition-colors group"
                                        onClick={() => handleSort('price')}
                                    >
                                        <div className="flex items-center gap-1">
                                            Preço Venda
                                            <ArrowUpDown className={`w-3 h-3 ${sortField === 'price' ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 font-medium tracking-wider text-right cursor-pointer hover:text-white transition-colors group"
                                        onClick={() => handleSort('cost')}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            Custos Est.
                                            <ArrowUpDown className={`w-3 h-3 ${sortField === 'cost' ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 font-medium tracking-wider text-right cursor-pointer hover:text-white transition-colors group"
                                        onClick={() => handleSort('profit')}
                                    >
                                        <div className="flex items-center justify-end gap-1">
                                            Resultado
                                            <ArrowUpDown className={`w-3 h-3 ${sortField === 'profit' ? 'text-primary' : 'text-gray-600 group-hover:text-gray-400'}`} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 font-medium tracking-wider text-center">Espionar</th>
                                    <th className="px-6 py-4 font-medium tracking-wider text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sortedProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-white p-1 rounded-md shrink-0">
                                                    {product.thumbnail ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={product.thumbnail} alt="" className="w-10 h-10 object-contain" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-gray-200" />
                                                    )}
                                                </div>
                                                <a
                                                    href={product.permalink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="font-medium text-gray-300 line-clamp-2 max-w-[280px] hover:text-primary transition-colors hover:underline decoration-primary/50 underline-offset-4"
                                                >
                                                    {product.title}
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${product.platform === 'mercadolivre'
                                                ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                }`}>
                                                {product.platform === 'mercadolivre' ? 'ML' : 'Shopee'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-300">
                                            R$ {product.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                                            - R$ {product.margin?.totalCost.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <ProfitBadge profit={product.margin?.estimatedProfit || 0} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-purple-500/20 hover:text-purple-400"
                                                onClick={() => handleAnalyze(product)}
                                                title="Análise Profunda com IA"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={product.permalink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                                                title="Ver Fonte"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button variant="outline" className="text-gray-400 border-white/10 hover:bg-white/5 hover:text-white group">
                    Carregar Mais Dados <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </div>

            <ProductAnalysisModal
                isOpen={isAnalysisModalOpen}
                onClose={() => setIsAnalysisModalOpen(false)}
                productUrl={selectedProduct?.permalink || ''}
                productTitle={selectedProduct?.title || ''}
                platform={selectedProduct?.platform as 'mercadolivre' | 'shopee'}
            />
        </div>
    )
}
