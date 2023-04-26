import type { User } from './user'

import { Octokit } from 'octokit'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../lib/session'
import { NextApiRequest, NextApiResponse } from 'next'
const octokit = new Octokit()

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username } = await req.body

  try {
    const {
      data: { login, name },
    } = await octokit.rest.users.getByUsername({ username })

    const user =
      { isLoggedIn: true,
        login,
        name: name
      } as User
    req.session.user = user
    await req.session.save()
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions)