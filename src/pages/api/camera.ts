/**
 * Camera object types
 */
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "../../lib/session";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * User object base
 */
export type Camera = {
  id: string;
  created_at: string;
  modified_at: string;
  name: string;
  latitude: Number;
  longitude: Number;
  local_path: string;
};

// async function userRoute(req: NextApiRequest, res: NextApiResponse<User>) {
//   if (req.session.user) {
//     res.json({
//       ...req.session.user,
//       isLoggedIn: true,
//     });
//   } else {
//     res.json(NullUser);
//   }
// }

// export default withIronSessionApiRoute(userRoute, sessionOptions);