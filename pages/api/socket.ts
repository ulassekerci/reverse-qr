import { NextApiRequest } from 'next'
import { Server } from 'Socket.IO'
import { z } from 'zod'

const reqSchema = z.object({
  id: z.string(),
  url: z.string().url(),
})

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (res.socket.server.io) {
    try {
      const request = reqSchema.parse(JSON.parse(req.body))
      res.socket.server.io.emit(request.id, request.url)
    } catch (error) {
      return req.method === 'POST' ? res.status(400).end() : res.end()
    }
    return res.end()
  }

  const io = new Server(res.socket.server)
  res.socket.server.io = io
  res.end()
}
