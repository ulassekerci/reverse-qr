import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import Redis from 'ioredis'

const reqSchema = z.object({
  id: z.string(),
  url: z.string().url(),
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.REDIS_URL) return res.status(500).end()
  try {
    const data = reqSchema.parse(JSON.parse(req.body))
    let client = new Redis(process.env.REDIS_URL)
    client.set(data.id, data.url, 'EX', 120)
    res.status(200).end()
  } catch (error) {
    res.status(500).end()
  }
}
