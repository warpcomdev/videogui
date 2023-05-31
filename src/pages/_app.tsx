import { AppProps } from "next/app";
import { SWRConfig } from "swr";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Providers } from "../components/Common/providers";
import fetchJson from "../lib/fetchJson";

import "../styles/globals.css"; // Global CSS

/**
 * App config
 * Configuracion SWR para  iron-session
 * Providers modificado para temas
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: fetchJson,
          onError: (err) => {
            console.error(err);
          },
        }}
      >
        <Providers>
          <Header />
          <Component {...pageProps} />
          <Footer />
          <ScrollToTop />
        </Providers>
      </SWRConfig>
    </>
  );
}
