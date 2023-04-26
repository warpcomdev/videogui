import { AppProps } from "next/app";
import Header from "../components/Header";
import "../styles/globals.css"; // Global CSS
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import { Providers } from "../components/Common/providers";

// import "node_modules/react-modal-video/css/modal-video.css";
// import { SessionProvider} from "next-auth/react";

// import { AppProps } from 'next/app'
import { SWRConfig } from "swr";
import fetchJson from "../lib/fetchJson";

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
