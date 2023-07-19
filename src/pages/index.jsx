
import { Inter } from "@next/font/google";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/index";
import fetchJson from "../lib/fetchJson";

import { useSession, getSession, signOut } from "next-auth/react"

const inter = Inter({ subsets: ["latin"] });

function isTokenExpired(exp) {
  try {
    const expirationDate = exp;

    // Obtén la fecha actual en segundos
    const currentTimestamp = Math.floor(Date.now() / 1000);

    // Comprueba si el token ha expirado
    if (expirationDate < currentTimestamp) {
      return true; // El token ha expirado
    } else {
      return false; // El token todavía es válido
    }
  } catch (error) {
    return true; // Error al decodificar el token (puede ser inválido)
  }
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  // if (session) {
  //   if (isTokenExpired(session.user.iat)) {
  //     try {
  //       console.log('REFRESH TRY');
  //       const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/v1/api/login";
  //       const res = await fetchJson(urlData, {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + session.user.token,
  //         },
  //       });

  //       // handle errors
  //       if (!res || res.error) {
  //         // This will activate the closest `error.js` Error Boundary
  //         throw new Error("Ocurrio un error al extraer los datos");
  //       }

  //       console.log('REFRESH TOKEN', res);
  //       return res;
  //     } catch (error) {
  //       const response = await fetch("/api/auth/signout", {
  //         method: "POST",
  //       });

  //       if (response.ok) {
  //         router.push("/login");
  //       }
  //     }
  //   }
  // }

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  var data = await getData(session.user.token);
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
    if (!error.message.includes('Unauthorized')) {
      console.log("ERROR", error);
      throw new Error("Ocurrio un error al extraer los datos");
    }
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
      <Hero data={cameras} />
    </>
  );
}

export default Dashboard;