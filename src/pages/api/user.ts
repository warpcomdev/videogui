/**
 * User object
 */
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * User object base type
 */
export type User = {
  isLoggedIn: boolean;
  id: string;
  name: string;
  role: string;
  token: string;
};

/**
 * User object that indicates not logged in
 */
export const NullUser: User = {
  isLoggedIn: false,
  id: "",
  name: "",
  role: "",
  token: "",
};

/**
 * iron-session User API Route:
 */
async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
  if (req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json(NullUser);
  }
}

export default withIronSessionApiRoute(userRoute, sessionOptions);