import type { IronSessionOptions } from "iron-session";
import { withIronSessionApiRoute, withIronSessionSsr  } from "iron-session/next";
import type { User } from '../pages/api/user'

/**
 * Session Options 
 * Cookie config
 */
export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "video-gui-iron-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  }
};

// /**
//  * Session SSR 
//  */
// export function withSessionSSR(handler) {
//   return withIronSessionSsr(handler, sessionOptions)
// }

// /**
//  * Session API Route 
//  */
// export function withSessionAPI(handler) {
//   return withIronSessionApiRoute(handler, sessionOptions)
// }

/**
 * Session module interface 
 */
declare module "iron-session" {
  interface IronSessionData {
   // user?: User | null;
   user?: User ;
  }
}