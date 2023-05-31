import React, { useState } from 'react'
import useUser from '../lib/useUser'
import Signin from "../components/Login";

/**
 * Login page
 */
const LoginPage = () => {
  return (
    <>
      <Signin />
    </>
  );
};

export default LoginPage;