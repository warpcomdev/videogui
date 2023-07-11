import React, { useState } from 'react'
import Signin from "../components/Login";
import { getSession } from "next-auth/react"
/**
 * Login page
 */

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
      return {
          redirect: {
              destination: '/',
              permanent: false,
          },
      }
  }
  else{
    return {
      props: {
        session: null
    },
  }
  }
}

const LoginPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default LoginPage;