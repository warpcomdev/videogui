import React, { useState } from 'react'
import useUser from '../lib/useUser'

import Signin from "../components/Login";

const LoginPage = () => {
  // verifica si el usuario ya esta en sessión y lo envia ala página dashboard
  const { mutateUser } = useUser({
    redirectTo: '/dashboard',
    redirectIfFound: true,
  })

  return (
    <>
      <Signin />
    </>
  );
};

export default LoginPage;