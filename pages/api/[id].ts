import type { NextApiRequest, NextApiResponse } from 'next'
import Redis from 'ioredis'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).end()
  if (!process.env.REDIS_URL) return res.status(500).end()

  try {
    let client = new Redis(process.env.REDIS_URL)
    const url = await client.get(id)
    res.status(200).json({ url: url })
  } catch (error) {
    res.status(500).end()
  }
}
