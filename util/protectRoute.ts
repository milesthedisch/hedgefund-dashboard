export default function protectRoute(routeHandler: Function) {
  return function wrappedRoute(req, res) {
    if (req.headers["auth0-hook-secret"] !== process.env.AUTH0_HOOK_SECRET) {
      res.status(401).json({
        error: "not_authenticated",
        description: "The request is not authenticated",
      });

      return;
    }

    return routeHandler(req, res);
  };
}
