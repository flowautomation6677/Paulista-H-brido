import { NextResponse } from 'next/server'
import { Queue } from 'bullmq'
import Redis from 'ioredis'

// Redis connection for BullMQ
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

const scanQueue = new Queue('scan-queue', { connection });

export async function POST(req: Request) {
    try {
        const { keyword, platform, limit } = await req.json()

        if (!keyword) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400 })
        }

        const job = await scanQueue.add('market-scan', {
            keyword,
            platform: platform || 'both',
            limit: limit || 10
        });

        return NextResponse.json({
            jobId: job.id,
            status: 'queued',
            message: 'Scan job submitted successfully'
        })

    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { error: 'Failed to submit job' },
            { status: 500 }
        )
    }
}
