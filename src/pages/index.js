/*
  Pagina  Home
*/
import { Inter } from "@next/font/google";
import Head from "next/head";
import useUser from '../lib/useUser'
import useEvents from '../lib/useEvents'

// import Signin from "./signin";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // verifica si el usuario ya esta en sessión y lo envia ala página dashboard
  // const { user } = useUser({
  //   redirectTo: '/dashboard',
  // })

  const { user } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })
  const { events } = useEvents(user)

  console.log(user)
  return (
    <>
      <Head>
        <title>Astronómico Diputación Badajoz</title>
        <meta
          name="description"
          content="Sistema de transmisión de eventos astronómicos de la Diputación de Badajoz"
        />
      </Head>
      {/* <Signin /> */}
    </>
  );
}