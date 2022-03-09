import { google } from "googleapis";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

async function handler(req, res) {
  const { user } = getSession(req, res);

  if (!user) {
    res.send(401);
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
    range: "Sheet1!A:E",
  });

  const rows = data.values.shift().map((v) => v.toLowerCase());

  const userData = data.values;

  const result = userData.reduce((obj, user, i) => {
    const result = {};

    rows.forEach((row, idx) => (result[row] = userData[i][idx]));

    result["id"] = i;

    obj.push(result);

    return obj;
  }, []);

  return res.status(201).json(result);
}

export default withApiAuthRequired(handler);
