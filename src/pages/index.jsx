
import { Inter } from "@next/font/google";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/index";
import fetchJson from "../lib/fetchJson";

import { useSession, getSession, signOut } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
      return {
          redirect: {
              destination: '/login',
              permanent: false,
          },
      }
  }
  var data = await getData(session.user.token);
  console.log(data);
  if (data) {
      return {
          props: {
              session,
              cameras: data
          },
      }
  } else {
      return {
          props: {
              session,
              cameras: null
          },
      }
  }

}

/**
 * Función para obtener los datos de las cámaras
 */
async function getData(token) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/v1/api/camera";
    const res = await fetchJson(urlData, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    // handle errors
    if (!res || res.error) {
      // This will activate the closest `error.js` Error Boundary
      throw new Error("Ocurrio un error al extraer los datos");
    }

    return res;
  } catch (error) {
    console.error('ERROR', error);
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

/**
 * Página principal
 */
function Dashboard({ cameras }) {
  return (
    <>
      <Head>
        <title>Astronómico Diputación Badajoz</title>
        <meta
          name="description"
          content="Sistema de transmisión de eventos astronómicos de la Diputación de Badajoz"
        />
      </Head>
      <Hero data = {cameras} />
    </>
  );
}

export default Dashboard;