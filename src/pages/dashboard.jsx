/*
  Pagina  principal
*/
import { withIronSessionSsr } from "iron-session/next";
import { Inter } from "@next/font/google";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/index";
import useUser from "../lib/useUser";
import { sessionOptions } from "../lib/session";
import fetchJson from "../lib/fetchJson";

const inter = Inter({ subsets: ["latin"] });

/**
 * Función para obtener los datos de las cámaras
 */
async function getData(token) {
  try {
    const urlData = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/api/camera";
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
    throw new Error("Ocurrio un error al extraer los datos");
  }
}

/**
 * Página principal
 */
function Dashboard({ cameras }) {
    // Si el usuario no esta en sessión redirecciona al login
    // const { user } = useUser({
    //   redirectTo: '/'
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
      <Hero data = {cameras} />
    </>
  );
}

export default Dashboard;

/**
 * Busca los datos en el servidor
 */
export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user ?? null;

    if (user && user.isLoggedIn) {
      var data = await getData(user.token);
      return {
        props: {
          cameras: data
        },
      };
    } else {
      return {
        props: {
          cameras: null
        },
      };
    }
  },
  sessionOptions
);