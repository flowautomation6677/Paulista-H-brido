import puppeteer from 'puppeteer'
import { Product } from '@/types'

// Removed puppeteer-extra/stealth due to critical compatibility issues with Next.js runtime
// puppeteer.use(StealthPlugin())

interface ScraperOptions {
    keyword: string
    limit: number
}

// Helper for delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const randomDelay = (min: number, max: number) => delay(Math.floor(Math.random() * (max - min + 1) + min))

export class ScraperService {

    static async scrapeMercadoLivre(options: ScraperOptions): Promise<Product[]> {
        const products: Product[] = []
        let browser

        try {
            browser = await puppeteer.launch({
                headless: true, // "new" is deprecated, but valid in v22. true is standard.
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled' // basic avoidance
                ]
            })
            const page = await browser.newPage()
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            await page.setViewport({ width: 1366, height: 768 })

            let pageNum = 1
            let url = `https://lista.mercadolivre.com.br/${options.keyword.replace(/\s+/g, '-')}_NoIndex_True`

            while (products.length < options.limit) {
                console.log(`[ML] Scraping page ${pageNum}...`)
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

                // Wait for items
                const containerSelector = '.ui-search-layout__item';
                await page.waitForSelector(containerSelector, { timeout: 10000 }).catch(() => null)

                const items = await page.$$eval(containerSelector, (elements) => {
                    return elements.map(el => {
                        const title = el.querySelector('.ui-search-item__title')?.textContent?.trim() || ''
                        const priceText = el.querySelector('.andes-money-amount__fraction')?.textContent?.replace(/\./g, '') || '0'
                        const price = parseFloat(priceText)

                        // Robust Link Extraction
                        // 1. Try specific class
                        // 2. Try any anchor with href
                        let linkEl = el.querySelector('a.ui-search-link') as HTMLAnchorElement
                        if (!linkEl) {
                            linkEl = el.querySelector('a') as HTMLAnchorElement
                        }

                        let permalink = linkEl?.href || ''

                        // Fallback: if browser returns relative path for some reason (rare in $$eval but possible), fix it
                        if (permalink && !permalink.startsWith('http')) {
                            // Assuming standard ML domain if relative
                            permalink = `https://lista.mercadolivre.com.br${permalink}`
                        }

                        const thumbnail = el.querySelector('img')?.getAttribute('src') || ''

                        return { title, price, permalink, thumbnail }
                    })
                })

                // Filter out invalid items immediately
                const validItems = items.filter(i => i.permalink && i.permalink.startsWith('http') && i.price > 0);

                if (!validItems || validItems.length === 0) break;

                for (const item of validItems) {
                    if (products.length >= options.limit) break

                    // Calculate Margin
                    const margin = ScraperService.calculateMargin(item.price, 'mercadolivre')

                    products.push({
                        id: `ml-${Math.random().toString(36).substr(2, 9)}`,
                        ...item,
                        currency: 'BRL',
                        platform: 'mercadolivre',
                        margin
                    })
                }

                if (products.length >= options.limit) break

                // Next Page Logic
                const nextButton = await page.$('li.andes-pagination__button--next a')
                if (!nextButton) break // No more pages

                url = await (await nextButton.getProperty('href')).jsonValue() as string
                pageNum++
                await randomDelay(1000, 3000) // Safety delay
            }

        } catch (e) {
            console.error('[ML] Error:', e)
        } finally {
            if (browser) await browser.close()
        }

        return products
    }

    static async scrapeShopee(options: ScraperOptions): Promise<Product[]> {
        const products: Product[] = []
        let browser

        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled'
                ]
            })
            const page = await browser.newPage()
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            await page.setViewport({ width: 1366, height: 768 })

            // Navigate to search
            const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(options.keyword)}`
            console.log(`[Shopee] Navigating to ${url}`)
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })

            // Auto-scroll function
            await page.evaluate(async () => {
                await new Promise<void>((resolve) => {
                    let totalHeight = 0
                    const distance = 100
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight
                        window.scrollBy(0, distance)
                        totalHeight += distance

                        // Scroll enough to trigger lazy loading but not forever
                        if (totalHeight >= 3000 || totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer)
                            resolve()
                        }
                    }, 100)
                })
            })

            const items = await page.evaluate(() => {
                const results: any[] = [];
                const priceElements = Array.from(document.querySelectorAll('*')).filter(el =>
                    el.textContent && el.textContent.includes('R$') && el.textContent.length < 20
                );

                const cards = new Set();
                priceElements.forEach(priceEl => {
                    let current = priceEl.parentElement;
                    for (let i = 0; i < 6; i++) {
                        if (!current) break;
                        if (current.tagName === 'A' || current.querySelector('a')) {
                            cards.add(current);
                            if (current.tagName === 'A') break;
                        }
                        current = current.parentElement;
                    }
                });

                for (const card of Array.from(cards) as Element[]) {
                    const anchor = (card.tagName === 'A' ? card : card.querySelector('a')) as HTMLAnchorElement;
                    if (!anchor) continue;

                    const img = card.querySelector('img') as HTMLImageElement;
                    const titleEl = card.querySelector('div[data-sqe="name"]') || card;
                    const title = titleEl.textContent?.trim() || '';
                    const priceText = card.textContent?.match(/R\$\s*([\d\.]+,\d{2})/)?.[1]?.replace(/\./g, '').replace(',', '.') || '0';
                    const price = parseFloat(priceText);

                    if (price > 0 && title.length > 5) {
                        results.push({
                            title,
                            price,
                            permalink: anchor.href,
                            thumbnail: img?.src || ''
                        });
                    }
                }
                return results;
            });

            for (const item of items) {
                if (products.length >= options.limit) break

                const margin = ScraperService.calculateMargin(item.price, 'shopee')

                products.push({
                    id: `sh-${Math.random().toString(36).substr(2, 9)}`,
                    ...item,
                    currency: 'BRL',
                    platform: 'shopee',
                    margin
                })
            }

        } catch (e) {
            console.error('[Shopee] Error:', e)
        } finally {
            if (browser) await browser.close()
        }

        return products
    }

    static calculateMargin(price: number, platform: 'mercadolivre' | 'shopee') {
        let fees = 0
        let shipping = 0

        if (platform === 'mercadolivre') {
            const rate = 0.14
            const fixed = price < 79 ? 6.00 : 0
            const estimatedShipping = price >= 79 ? 20.90 : 0

            fees = (price * rate) + fixed
            shipping = estimatedShipping
        } else {
            const rate = 0.14 + 0.06
            const fixed = 3.00

            fees = (price * rate) + fixed
            shipping = 0
        }

        const totalCost = fees + shipping
        const estimatedProfit = price - totalCost
        const profitMarginPercent = (estimatedProfit / price) * 100

        return {
            fees,
            shipping,
            totalCost,
            estimatedProfit,
            profitMarginPercent
        }
    }
    static async scrapeProductDetails(url: string, platform: 'mercadolivre' | 'shopee') {
        let browser
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-blink-features=AutomationControlled'
                ]
            })
            const page = await browser.newPage()
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })

            // Extract content for AI
            const content = await page.evaluate((platform) => {
                let text = ''
                if (platform === 'mercadolivre') {
                    // Title, Price, Description, Specs
                    const title = document.querySelector('h1')?.textContent || ''
                    const price = document.querySelector('.andes-money-amount__fraction')?.textContent || ''
                    const description = document.querySelector('.ui-pdp-description__content')?.textContent || ''
                    const specs = Array.from(document.querySelectorAll('.ui-pdp-specs__table tr')).map(tr => tr.textContent).join(' ')
                    text = `Title: ${title}\nPrice: ${price}\nSpecs: ${specs}\nDescription: ${description}`
                } else {
                    // Shopee
                    const title = document.querySelector('.attM6y')?.textContent || '' // Class names change often on Shopee, using generic strategy is better but for detailed view we try to get body text
                    const body = document.body.innerText
                    text = body.substring(0, 5000) // Shopee is SPA/complex, grabbing raw text is safer for AI
                }
                return text.replace(/\s+/g, ' ').trim()
            }, platform)

            return content
        } catch (e) {
            console.error('Detail Scrape Error:', e)
            return null
        } finally {
            if (browser) await browser.close()
        }
    }
}
