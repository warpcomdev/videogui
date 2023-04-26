/*
  Pagina  principal
*/
"use client";

import { Inter } from "@next/font/google";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Hero from "../components/Hero/index";
import useUser from "../lib/useUser";
import useEvents from "../lib/useEvents";

const inter = Inter({ subsets: ["latin"] });

export default function Dashboard() {
  const { user } = useUser({})
  //   redirectTo: '/Dashboard',
  // })
  const { events } = useEvents(user);
  const router = useRouter();

  // useEffect(() => {
  //   if (!user || !user?.isLoggedIn) {
  //     router.push({
  //       pathname: "/",
  //     });
  //   }
  // });

  return (
    <>
      <Head>
        <title>Astronómico Diputación Badajoz</title>
        <meta
          name="description"
          content="Sistema de transmisión de eventos astronómicos de la Diputación de Badajoz"
        />
      </Head>
      <Hero />
    </>
  );
}
