import type { NextApiRequest, NextApiResponse } from "next";
import {
  getSession,
  handleAuth,
  handleLogin,
  handleLogout,
  handleCallback,
} from "@auth0/nextjs-auth0";

// const afterCallback = (req, res, session, state) => {
//   if (session.user["https://app.balmoral.digital/2fa"]) {
//     // send user to verify there 2fa

//     return res.redirect("/");
//     return session;
//   }

//   return session;
// };

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    await handleLogin(req, res, {
      returnTo: "/",
    });
  },
  async logout(req: NextApiRequest, res: NextApiResponse) {
    await handleLogout(req, res, {
      returnTo: "/api/auth/login",
    });
  },
  async callback(req: NextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res);
    } catch (error) {
      res.status(error.status || 500).end(error.message);
    }
  },
});
