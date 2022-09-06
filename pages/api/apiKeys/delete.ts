import type { NextApiRequest, NextApiResponse } from "next";
import deleteOne from "../../../db/apiKeys/deleteOne";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import type { ApiKey } from "@prisma/client";

export default withApiAuthRequired(async function (
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(403).send("Incorrect HTTP code");
  }

  const apiKeyID = req.body.apiKeyID;

  let records: ApiKey;

  try {
    records = await deleteOne(apiKeyID);
  } catch (e) {
    console.error(e);
    return res.status(400).send("Unauthorized, Api-Key not found.");
  }

  return res.status(200).json({ data: records });
});
