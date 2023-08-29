import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
 
// Font
const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

// Component
import Header from '../components/Header'
 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <div className={roboto.className}>
        <Header/>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  )
}
