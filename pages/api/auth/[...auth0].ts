import type { NextApiRequest, NextApiResponse } from "next";
import {
  handleCallback,
  handleAuth,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";

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
});
