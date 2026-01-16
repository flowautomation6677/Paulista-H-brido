import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

async function testShopee() {
    console.log('Starting Shopee Test...');
    try {
        const browser = await puppeteer.launch({
            headless: true, // Run headed to see what happens
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        // Set a realistic User Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        const keyword = 'iphone';
        const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(keyword)}`;
        console.log(`Navigating to ${url}...`);

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        console.log('Navigation complete');

        // Auto-scroll
        console.log('Scrolling...');
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    // Scroll for a bit
                    if (totalHeight >= 3000) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });

        // Check selectors
        // Tried: div[data-sqe="item"]
        console.log('Checking selectors...');
        const items = await page.$$eval('div[data-sqe="item"]', (elements) => {
            return elements.map(el => {
                // Shopee usually puts title in the second div inside the anchor or similar
                // This is brittle. Just grabbing text content for debug.
                return el.textContent.substring(0, 50);
            });
        });

        console.log(`Found ${items.length} Shopee items.`);

        // Check fallback selectors if 0
        if (items.length === 0) {
            // Try to obtain any list item
            const anyItems = await page.$$eval('li', els => els.length);
            console.log(`Found ${anyItems} 'li' elements (maybe they are items?)`);

            const html = await page.content();
            console.log('HTML Dump (partial):', html.substring(0, 500));
        }

        await browser.close();
    } catch (error) {
        console.error('CRITICAL ERROR:', error);
    }
}

testShopee();
