import '../tailwind.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Reverse QR</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
