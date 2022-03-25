export default function protectRoute(routeHandler) {
  return function wrappedRoute(req, res) {
    console.log(req.body);

    if (req.body.secret !== process.env.AUTH0_HOOK_SECRET) {
      res.status(401).json({
        error: "not_authenticated",
        description: "The request is not authenticated",
      });

      return;
    }

    return routeHandler(req, res);
  };
}
