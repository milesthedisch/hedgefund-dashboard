import { handleAuth, handleLogin, handleCallback } from "@auth0/nextjs-auth0";

const afterCallback = async (req, res, session) => {
  console.log(req);
  return session();
};

export default handleAuth({
  async login(req, res) {
    await handleLogin(req, res, {
      returnTo: "/dashboard",
    });
  },
});
