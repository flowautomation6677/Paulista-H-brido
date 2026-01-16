import { NextResponse } from 'next/server'
import { ScraperService } from '@/services/scraper'
import { Product, ScanResult } from '@/types'

export async function POST(req: Request) {
    try {
        const { keyword, limit, platforms } = await req.json()

        if (!keyword || !platforms || platforms.length === 0) {
            return NextResponse.json(
                { error: 'Keyword and at least one platform are required' },
                { status: 400 }
            )
        }

        const safeLimit = Math.min(Math.max(Number(limit) || 10, 5), 50)
        const promises: Promise<Product[]>[] = []

        if (platforms.includes('mercadolivre')) {
            promises.push(ScraperService.scrapeMercadoLivre({ keyword, limit: safeLimit }))
        }

        if (platforms.includes('shopee')) {
            promises.push(ScraperService.scrapeShopee({ keyword, limit: safeLimit }))
        }

        // Use allSettled to prevent one failure from blocking others
        const results = await Promise.allSettled(promises)
        const allProducts: Product[] = []

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                allProducts.push(...result.value)
            } else {
                console.error(`Platform ${index} failed:`, result.reason)
            }
        })

        // Calculate Summary Stats
        const totalScanned = allProducts.length
        const averagePrice = totalScanned > 0
            ? allProducts.reduce((acc, p) => acc + p.price, 0) / totalScanned
            : 0

        // Find Best Opportunity
        const bestOpportunity = allProducts.reduce((best, current) => {
            const currentMargin = current.margin?.profitMarginPercent || 0
            const bestMargin = best?.margin?.profitMarginPercent || 0
            return currentMargin > bestMargin ? current : best
        }, null as Product | null)

        const response: ScanResult = {
            products: allProducts,
            summary: {
                totalScanned,
                averagePrice,
                bestOpportunity
            }
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error('Scan Error:', error)
        return NextResponse.json(
            { error: 'Failed to scan market' },
            { status: 500 }
        )
    }
}
