import type { NextApiRequest, NextApiResponse } from "next";
import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    await handleLogin(req, res, {
      returnTo: "/dashboard",
    });
  },
});
