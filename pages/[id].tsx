import type { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/router'

const ID: NextPage = () => {
  const router = useRouter()
  const { id } = router.query

  const [url, setURL] = useState('')
  const [status, setStatus] = useState(0)

  const sendURL = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await fetch('/api/socket', {
        method: 'POST',
        body: JSON.stringify({ id: id, url: url }),
      })
      setStatus(1)
    } catch (error) {
      setStatus(2)
    }
  }

  return (
    <div className='text-slate-700 max-w-sm mx-auto px-4'>
      {status === 0 && (
        <div className='mt-7'>
          <h1 className='text-4xl font-bold text-slate-700'>Hi!</h1>
          <span className='text-lg font-medium text-slate-600 mt-2 block'>Enter any url and press send</span>
          <form onSubmit={sendURL} className='flex flex-col items-center mt-10'>
            <input
              type='url'
              required
              value={url}
              onChange={(e) => {
                setURL(e.target.value)
              }}
              placeholder='https://example.com'
              className='w-full h-12 p-3 bg-slate-200 rounded-lg'
            />
            <button className='bg-slate-700 text-white font-medium w-full h-12 m-4 rounded-lg'>Send</button>
          </form>
        </div>
      )}
      {status === 1 && (
        <div className='flex flex-col items-center'>
          <span className='text-5xl font-bold m-6 mt-16'>URL Sent</span>
          <span className='text-xl font-bold'>You can close this page</span>
        </div>
      )}
      {status === 2 && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-6 mt-16'>An Error Ocurred</span>
          <span className='text-xl font-bold'>Try sending again</span>
        </div>
      )}
    </div>
  )
}

export default ID
