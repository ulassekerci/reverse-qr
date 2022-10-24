import type { InferGetServerSidePropsType } from 'next'
import { useEffect, useState } from 'react'
import QRCode from 'react-qr-code'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/router'

export const getServerSideProps = async () => {
  return {
    props: {
      id: nanoid(),
    },
  }
}

const Home = ({ id }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [domain, setDomain] = useState('')

  const check = async () => {
    const req = await fetch('/api/' + id)
    const data = await req.json()
    if (data.url) window.location = data.url
  }

  useEffect(() => {
    setDomain(window.location.href)
    const update = setInterval(check, 3000)
    return () => clearInterval(update)
  }, [])

  return (
    <div className='text-slate-700'>
      <div className='flex flex-col items-center'>
        <span className='text-4xl font-bold m-8 mb-12'>Scan The QR Code</span>
        {domain && <QRCode value={window.location.href + id} />}
      </div>
    </div>
  )
}

export default Home
