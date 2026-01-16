export interface Product {
    id: string
    title: string
    price: number
    currency: string
    permalink: string
    thumbnail: string
    platform: 'mercadolivre' | 'shopee'
    margin?: {
        fees: number
        shipping: number
        totalCost: number
        estimatedProfit: number
        profitMarginPercent: number
        margin?: {
            fees: number
            shipping: number
            totalCost: number
            estimatedProfit: number
            profitMarginPercent: number
        }
        salesVolume?: string
    }

export interface ScanResult {
    products: Product[]
    summary: {
        totalScanned: number
        averagePrice: number
        bestOpportunity: Product | null
    }
}

export interface ScanRequest {
    keyword: string
    platforms: ('mercadolivre' | 'shopee')[]
    limit: number
}
