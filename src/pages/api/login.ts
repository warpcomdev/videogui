import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionOptions } from "../../lib/session";
// import { withSessionAPI } from "./../lib/session";
import type { User, NullUser } from "./user";
import fetchJson from "../../lib/fetchJson";
import error from "next/error";

/**
 * User object base type
 */
type DataResult = {
  errorNumber: number;
  errorMessage: string;
  data: User;
};

/**
 * Login Video API
 */
async function signIn(id: string, password: string) {
  try {
    // get user from video api
    // ruta api login
    const urlLogin = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/api/login";

    const body = {
      id: id,
      password: password,
    };

    // fetch POST
    var result = await fetchJson(urlLogin, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // ocurrio algún error
    if (!result) {
      return {
        errorNumber: 500,
        errorMessage: "Ocurrió un error inesperado",
        data: null,
      } as DataResult;
    } else {
      // sin permisos
      if (result["error"]) {
        return {
          errorNumber: 401,
          errorMessage: result["error"],
          data: null,
        } as DataResult;
        //       // r
      } else {
        // configura usuario sessión
        var user = {
          isLoggedIn: true,
          id: result["id"],
          name: result["name"],
          role: result["role"],
          token: result["token"],
        } as User;

        return {
          errorNumber: 0,
          errorMessage: "",
          data: user,
        } as DataResult;
      }
    }
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return {
        errorNumber: 401,
        errorMessage: (error as Error).message,
        data: null,
      } as DataResult;
    } else {
      return {
        errorNumber: 500,
        errorMessage: (error as Error).message,
        data: null,
      } as DataResult;
    }
  }
}

/**
 * iron-session Login API Route
 */
async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { id, password } = await req.body;

  // borra sessión actual
  req.session.destroy();
  var result = await signIn(id, password);
  if (!result) {
    res.status(500).json({ message: "Ocurrió un error inesperado" });
  } else {
    if (result.errorNumber !== 0) {
      res.status(result.errorNumber).json({ message: result.errorMessage });
    } else {
      // else
      req.session.user = result.data;
      await req.session.save();
      res.send(req.session.user);
    }
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);