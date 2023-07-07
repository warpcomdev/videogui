import { SessionProvider } from "next-auth/react"

import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Providers } from "../components/Common/providers";
import "../styles/globals.css"; // Global CSS

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Providers>
        <Header />
        <Component {...pageProps} />
        <Footer />
        <ScrollToTop />
      </Providers>
    </SessionProvider>
  )
}