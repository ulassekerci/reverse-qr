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
      await fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({ id: id, url: url }),
      })
      setStatus(1)
    } catch (error) {
      setStatus(2)
    }
  }

  return (
    <div className='text-slate-700'>
      {status === 0 && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-10'>Enter the URL</span>
          <form onSubmit={sendURL} className='w-full flex flex-col items-center'>
            <input
              type='url'
              required
              value={url}
              onChange={(e) => {
                setURL(e.target.value)
              }}
              placeholder='https://aws.amazon.com'
              className='w-3/4 h-12 p-2 bg-gray-200 rounded'
            />
            <button className='bg-blue-400 text-white font-medium w-3/4 h-12 m-4 rounded'>Send</button>
          </form>
        </div>
      )}
      {status === 1 && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-6 mt-16'>URL Sent</span>
          <span className='text-xl font-bold'>you can close this tab</span>
        </div>
      )}
      {status === 2 && (
        <div className='flex flex-col items-center'>
          <span className='text-4xl font-bold m-6 mt-16'>An Error Ocurred</span>
          <span className='text-xl font-bold'>try sending again</span>
        </div>
      )}
    </div>
  )
}

export default ID
