import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import UserAgent from 'user-agents';
import { Browser, Page } from 'puppeteer';

// Enable Stealth capabilities
puppeteer.use(StealthPlugin());

interface ScraperOptions {
    keyword: string
    limit: number
}

// Types for Products (Define locally to avoid sharing dependency for now)
interface Product {
    id: string;
    title: string;
    price: number;
    permalink: string;
    thumbnail: string;
    platform: string;
    currency: string;
    margin?: any;
    salesVolume?: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
const randomDelay = (min: number, max: number) => delay(Math.floor(Math.random() * (max - min + 1) + min))

export class ScraperService {

    static async scrapeMercadoLivre(options: ScraperOptions): Promise<Product[]> {
        let browser: Browser | null = null;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();

            // Randomize User Agent
            const userAgent = new UserAgent({ deviceCategory: 'desktop' });
            await page.setUserAgent(userAgent.toString());
            await page.setViewport({ width: 1366, height: 768 });

            const url = `https://lista.mercadolivre.com.br/${options.keyword.replace(/\s+/g, '-')}_NoIndex_True`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // Scraping Logic (Same as before but with Stealth active)
            const containerSelector = '.ui-search-layout__item';
            await page.waitForSelector(containerSelector, { timeout: 15000 }).catch(() => null);

            const items = await page.$$eval(containerSelector, (elements) => {
                return elements.map(el => {
                    const title = el.querySelector('.ui-search-item__title')?.textContent?.trim() || '';
                    const priceText = el.querySelector('.andes-money-amount__fraction')?.textContent?.replace(/\./g, '') || '0';
                    const price = parseFloat(priceText);

                    let linkEl = el.querySelector('a.ui-search-link') as HTMLAnchorElement;
                    if (!linkEl) linkEl = el.querySelector('a') as HTMLAnchorElement;
                    let permalink = linkEl?.href || '';

                    const thumbnail = el.querySelector('img')?.getAttribute('src') || '';

                    // Sales Volume (Mercado Livre)
                    const salesVolume = el.querySelector('.ui-search-reviews__amount')?.textContent?.trim() ||
                        el.querySelector('.ui-search-item__group__element--mock-quantity')?.textContent?.trim() || '';

                    return { title, price, permalink, thumbnail, salesVolume };
                });
            });

            // Process Items
            const products: Product[] = items
                .filter(i => i.permalink && i.price > 0)
                .slice(0, options.limit)
                .map(item => ({
                    id: `ml-${Math.random().toString(36).substr(2, 9)}`,
                    ...item,
                    currency: 'BRL',
                    platform: 'mercadolivre',
                    margin: ScraperService.calculateMargin(item.price, 'mercadolivre')
                }));

            return products;

        } catch (error) {
            console.error('[ML] Error:', error);
            return [];
        } finally {
            if (browser) await browser.close();
        }
    }

    static async scrapeShopee(options: ScraperOptions): Promise<Product[]> {
        let browser: Browser | null = null;
        try {
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            const userAgent = new UserAgent({ deviceCategory: 'desktop' });
            await page.setUserAgent(userAgent.toString());

            const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(options.keyword)}`;
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Auto-scroll logic to trigger lazy load
            await page.evaluate(async () => {
                await new Promise<void>((resolve) => {
                    let totalHeight = 0;
                    const distance = 100;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= 3000 || totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });

            // Extract Items (Simplified Logic for Worker)
            const items = await page.evaluate(() => {
                const results: any[] = [];
                const cards = document.querySelectorAll('.shopee-search-item-result__item');
                // Note: Shopee selectors change frequently, sticking to generic strategy might be better or reusing the complex one
                // Usage of 'any' here for speed, referencing previous robust strategy
                const priceElements = Array.from(document.querySelectorAll('*')).filter(el =>
                    el.textContent && el.textContent.includes('R$') && el.textContent.length < 20
                );

                // ... (simplified extraction logic for brevity, ideally reuse the robust one)
                // Focusing on the structure for now
                return results; // Placeholder: Ensure we copy the FULL logic from original scraper if needed
            });

            // Re-using the robust logic from previous scraper is safer. I'll paste the robust one here.
            const robustItems = await page.evaluate(() => {
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
                    const text = card.textContent || '';
                    const priceText = text.match(/R\$\s*([\d\.]+,\d{2})/)?.[1]?.replace(/\./g, '').replace(',', '.') || '0';
                    const price = parseFloat(priceText);

                    // Try to find title 
                    const title = img?.alt || card.querySelector('div[data-sqe="name"]')?.textContent || 'Produto sem titulo';

                    // Sales Volume (Shopee)
                    const salesVolume = card.querySelector('div[data-sqe="rating"] + div')?.textContent?.trim() ||
                        card.textContent.match(/(\d+[kK]?)\s+vendidos/)?.[1] || '';

                    if (price > 0) {
                        results.push({
                            title,
                            price,
                            permalink: anchor.href,
                            thumbnail: img?.src || '',
                            salesVolume
                        });
                    }
                }
                return results;
            });

            const products: Product[] = robustItems
                .slice(0, options.limit)
                .map(item => ({
                    id: `sh-${Math.random().toString(36).substr(2, 9)}`,
                    ...item,
                    currency: 'BRL',
                    platform: 'shopee',
                    margin: ScraperService.calculateMargin(item.price, 'shopee')
                }));

            return products;

        } catch (error) {
            console.error('[Shopee] Error:', error);
            return [];
        } finally {
            if (browser) await browser.close();
        }
    }

    static calculateMargin(price: number, platform: string) {
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
}
