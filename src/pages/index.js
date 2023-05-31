import { Inter } from "@next/font/google";
import Head from "next/head";
import useUser from '../lib/useUser'
import Signin from "../components/Login";

// import Signin from "./signin";

const inter = Inter({ subsets: ["latin"] });

/**
 * Página index 
 * login si el usuario no esta en sesión (Signin component)
 * en caso de que ya este en sessión se redirecciona a dashboard
 */
export default function Home() {
  // const { user } = useUser({
  //   redirectTo: '/dashboard',
  //   redirectIfFound: true
  // })

  return (
    <>
      <Head>
        <title>Astronómico Diputación Badajoz</title>
        <meta
          name="description"
          content="Sistema de transmisión de eventos astronómicos de la Diputación de Badajoz"
        />
      </Head>
      <Signin />
    </>
  );
}