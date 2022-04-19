import type { NextApiRequest, NextApiResponse } from "next";
import protectRoute from "../../../util/protectRoute";
import createUser from "../../../db/user/create";

export default protectRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;

    try {
      const result = await createUser(data);

      res.status(200).json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error updating balance", success: false });
    }
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
});
