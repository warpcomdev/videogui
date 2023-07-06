import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface Camera {
  id: string;
  created_at: string;
  modified_at: string;
  name: string;
  latitude: number;
  longitude: number;
  local_path: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  token: string;
  cameras: Camera[];
}

interface Credentials {
  id: string;
  password: string;
}

const options: NextAuthOptions = {
  debug: process.env.NODE_ENV !== "production",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: "ID", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials: Credentials) {
        const urlLogin = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/api/login";
        const res = await fetch(`${urlLogin}`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-type': 'application/json' },
        })

        const user: User = await res.json()

        const urlCameras = process.env.NEXT_PUBLIC_VIDEOAPI_URL + "/api/camera";
        if (res.ok && user) {
          const cameraRes = await fetch(`${urlCameras}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', 'Authorization': `Bearer ${user.token}` },
          })

          const cameras: Camera[] = await cameraRes.json()

          if (cameraRes.ok && cameras) {
            user.cameras = cameras
          }
          return user
        }
        return null
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },

    async session({ session, token, user }) {
        session.user = token as any;
        return session;
    },
  },
  pages: {
    signIn: "/login",
  },
}

export default NextAuth(options)
