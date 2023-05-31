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