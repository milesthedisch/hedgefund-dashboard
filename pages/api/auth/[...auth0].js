import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export default (req, res) => {
  res.send(JSON.stringify(process.env));
};
// export default handleAuth({
//   async login(req, res) {
//     await handleLogin(req, res, {
//       returnTo: "/dashboard",
//     });
//   },
// });
