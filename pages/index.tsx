import type { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { nanoid } from 'nanoid'

export const getServerSideProps = async () => {
  return {
    props: {
      id: nanoid(),
    },
  }
}

const Home = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [domain, setDomain] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  const check = async () => {
    if (!isChecking) return
    const req = await fetch('/api/' + id)
    const data = await req.json()
    if (data.url) window.location = data.url
  }

  useEffect(() => {
    setDomain(window.location.href)
    const timeout = setTimeout(() => setIsChecking(false), 60000)
    const update = setInterval(check, 5000)
    return () => {
      clearInterval(update)
      clearTimeout(timeout)
    }
  }, [isChecking])

  return (
    <div className='text-slate-700'>
      {isChecking && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-8 mb-12'>Scan The QR Code</span>
          {domain && <QRCode value={domain + id} />}
        </div>
      )}
      {!isChecking && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-8 mb-12'>QR Code Expired</span>
          <div onClick={() => setIsChecking(true)} className='cursor-pointer'>
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
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
