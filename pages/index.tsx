import type { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { nanoid } from 'nanoid'
import { io, Socket } from 'socket.io-client'
let socket: Socket

export const getServerSideProps = async () => {
  return {
    props: {
      id: nanoid(),
    },
  }
}

const Home = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [domain, setDomain] = useState('')
  const [isConnected, setIsConnected] = useState(0)

  const connect = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      setIsConnected(1)
    })
    socket.on('disconnect', () => {
      setIsConnected(2)
    })
    socket.on(id, (arg) => {
      window.location = arg
    })
  }

  useEffect(() => {
    setDomain(window.location.href)
    connect()

    return () => {
      socket?.removeAllListeners()
    }
  }, [])

  return (
    <div className='text-slate-700 max-w-4xl mx-auto mt-9'>
      {isConnected === 1 && (
        <div className='flex flex-col'>
          <h1 className='text-slate-800 text-4xl font-bold'>Reverse QR</h1>
          <div className='flex mt-9 justify-between items-center'>
            <div className='flex flex-col gap-9'>
              <span className='text-2xl font-semibold text-slate-700 w-80'>
                Easily send URLs from your phone to a computer with just a QR code
              </span>
              <ul className='text-lg font-medium text-slate-600'>
                <span>Instructions:</span>
                <li>1. Scan the QR code</li>
                <li>2. Enter the URL</li>
                <li>3. Press send</li>
              </ul>
            </div>
            {domain && <QRCode value={domain + id} size={280} />}
          </div>
        </div>
      )}
      {isConnected === 2 && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-8 mb-12'>Connection Lost</span>
          <div onClick={connect} className='cursor-pointer'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.8}
              stroke='currentColor'
              className='w-20 h-20 mt-8'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99'
              />
            </svg>
            <span className='texl-xl font-medium'>Reconnect</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
