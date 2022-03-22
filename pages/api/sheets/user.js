import { google } from "googleapis";
import { calculateBalance } from "../../../util/calcBalance";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

async function handler(req, res) {
  const { user } = getSession(req, res);

  if (!user) {
    return res.redirect(401, "/401");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({
    auth,
    version: "v4",
  });

  const { data } = await sheets.spreadsheets.values.get({
    spreadsheetId: "1tzsbxOYZNQoHmJl0cxiGbx_F5tfl91Nq83aoC_WAI7Q",
    range:
      process.env.VERCEL_ENV === "preview" ? "preview!A:F" : "production!A:F",
  });

  const rows = data.values.shift().map((str) => str.toLowerCase());
  const userData = data.values.filter((row, index) => row[0] === user.email);

  if (!userData.length) {
    return res.status(404).send(404);
  } else {
    var result = {};
    rows.forEach((row, idx) => (result[row] = userData[0][idx]));

    return res.status(201).json(result);
  }
}

export default withApiAuthRequired(handler);
