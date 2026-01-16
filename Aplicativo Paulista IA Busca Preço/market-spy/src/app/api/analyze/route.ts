import { NextResponse } from 'next/server'
import { ScraperService } from '@/services/scraper'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { url, platform } = await req.json()

        if (!url || !platform) {
            return NextResponse.json({ error: 'URL and platform required' }, { status: 400 })
        }

        // 1. Scrape Details
        const productContent = await ScraperService.scrapeProductDetails(url, platform)

        if (!productContent) {
            return NextResponse.json({ error: 'Failed to scrape product details' }, { status: 500 })
        }

        // 2. Call OpenAI
        // We assume the key is present. If not, we could mock or error.
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({
                analysis: {
                    keywords: ["Simulated", "AI", "Keywords", "Configuration", "Missing"],
                    shippingEstimates: "Configure API Key for estimates",
                    copyAnalysis: "This is a simulated analysis because OPENAI_API_KEY is missing.",
                    competitorStrategy: "Unknown"
                }
            })
        }

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "Você é um Especialista em Inteligência de E-commerce. Responda APENAS em Português do Brasil." },
            {
                role: "user", content: `Analise os dados do produto abaixo da plataforma ${platform} e extraia:
        1. Lista das 5 melhores palavras-chave de SEO usadas ou recomendadas.
        2. Lógica estimada de frete (se mencionado, ou estimativa de mercado para este tipo de item).
        3. Uma crítica breve do copy de vendas (Pontos Fortes/Fracos).
        4. Estratégia do Concorrente (Preço baixo? Premium? Kit/Bundle?).
        
        Retorne estritamente no formato JSON: { "keywords": [], "shippingEstimates": "", "copyAnalysis": "", "competitorStrategy": "" }
        
        Dados do Produto: ${productContent.substring(0, 3000)}`
            }],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const analysis = JSON.parse(completion.choices[0].message.content || '{}')

        return NextResponse.json({ analysis })

    } catch (error) {
        console.error('Analyze Error:', error)
        return NextResponse.json(
            { error: 'Analysis failed' },
            { status: 500 }
        )
    }
}
