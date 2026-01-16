import { NextResponse } from 'next/server'
import { Queue } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

const scanQueue = new Queue('scan-queue', { connection });

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('id')

    if (!jobId) {
        return NextResponse.json({ error: 'Job ID required' }, { status: 400 })
    }

    try {
        const job = await scanQueue.getJob(jobId)

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 })
        }

        const state = await job.getState()
        const progress = job.progress
        const result = job.returnvalue

        return NextResponse.json({
            id: job.id,
            state,
            progress,
            result: state === 'completed' ? result : null,
            error: job.failedReason
        })

    } catch (error) {
        console.error('Status Check Error:', error)
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
    }
}
