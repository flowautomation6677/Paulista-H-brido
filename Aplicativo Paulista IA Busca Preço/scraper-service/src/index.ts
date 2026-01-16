import { Worker, Job } from 'bullmq';
import { ScraperService } from './scraper';
import Redis from 'ioredis';

const connection = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null
});

console.log('🚀 Scraper Worker Started!');

const worker = new Worker('scan-queue', async (job: Job) => {
    console.log(`[Job ${job.id}] Processing ${job.name}...`, job.data);

    try {
        const { keyword, platform, limit } = job.data;
        let products = [];

        // Notify progress
        await job.updateProgress(10);

        if (platform === 'mercadolivre' || platform === 'both') {
            console.log(`[Job ${job.id}] Scraping Mercado Livre...`);
            const mlProducts = await ScraperService.scrapeMercadoLivre({ keyword, limit });
            products.push(...mlProducts);
            await job.updateProgress(50);
        }

        if (platform === 'shopee' || platform === 'both') {
            console.log(`[Job ${job.id}] Scraping Shopee...`);
            const shProducts = await ScraperService.scrapeShopee({ keyword, limit });
            products.push(...shProducts);
            await job.updateProgress(90);
        }

        // Sort or post-process if needed
        console.log(`[Job ${job.id}] Completed. Found ${products.length} products.`);

        return {
            products,
            summary: {
                totalScanned: products.length,
                averagePrice: products.reduce((acc, p) => acc + p.price, 0) / (products.length || 1),
                bestOpportunity: products[0] // Simplify for now
            }
        };

    } catch (error) {
        console.error(`[Job ${job.id}] Failed:`, error);
        throw error;
    }
}, { connection: connection as any, concurrency: 2 }); // Run 2 jobs in parallel

worker.on('completed', job => {
    console.log(`[Job ${job.id}] Finished!`);
});

worker.on('failed', (job, err) => {
    console.error(`[Job ${job?.id}] Failed with ${err.message}`);
});
