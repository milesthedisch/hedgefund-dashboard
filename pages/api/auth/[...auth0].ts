import type { NextApiRequest, NextApiResponse } from "next";
import { handleAuth, handleLogin, handleLogout } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req: NextApiRequest, res: NextApiResponse) {
    const { user } = getSession(req, res);
    const isAudit =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("audit");
    const isAdmin =
      user["https://balmoral-dashboard.vercel.com/roles"].includes("admin");

    const adminStart = "/admin/strategies";
    const auditStart = "/admin/audit";

    await handleLogin(req, res, {
      returnTo: isAdmin ? adminStart : isAudit ? auditStart : "/dashboard",
    });
  },
  async logout(req: NextApiRequest, res: NextApiResponse) {
    await handleLogout(req, res, {
      returnTo: "/api/auth/login",
    });
  },
});
